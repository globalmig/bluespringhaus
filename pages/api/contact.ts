// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs"; // Supabase 세션 체크 용
import { getServerSession } from "next-auth/next"; // NextAuth(카카오)
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js"; // service-role
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 권한/상태가 매 요청 달라지므로 캐시 금지
  res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "POST only" });
  }

  // ENV 가드
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ success: false, error: "Supabase server env missing" });
  }

  try {
    const {
      userEmail: formEmail,
      message,
      speakerId: id,
      host,
      manager_name,
      manager_phone,
      event_title,
      event_summary,
      event_date,
      event_location,
      audience_type,
      audience_count,
      requested_time,
      offer_fee,
      additional_notes,
    } = req.body ?? {};

    if (!formEmail || !message || !id) {
      return res.status(400).json({ success: false, error: "이메일, 메시지, 강연자 ID를 모두 입력해주세요." });
    }

    // 1) 두 체계 세션 확인
    const supa = createPagesServerClient({ req, res });
    const { data: { user: supaUser } = { user: null } } = await supa.auth.getUser().catch(() => ({ data: { user: null } } as any));
    const nextSession = await getServerSession(req, res, authOptions).catch(() => null);
    const kakaoEmail = (nextSession?.user as any)?.email ?? null;

    if (!supaUser && !kakaoEmail) {
      return res.status(401).json({ success: false, error: "로그인이 필요합니다." });
    }

    // 2) 내부 UUID(profiles.id) 확보 (service-role)
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

    let internalUserId: string | null = null;

    if (supaUser?.id) {
      // Supabase 로그인 → profiles에서 id 매핑 (id 또는 보조컬럼/이메일)
      const { data: byId } = await admin.from("profiles").select("id").eq("id", supaUser.id).maybeSingle();
      if (byId?.id) {
        internalUserId = byId.id;
      } else if ((supaUser as any).email) {
        const { data: byEmail } = await admin
          .from("profiles")
          .select("id")
          .eq("email", (supaUser as any).email)
          .maybeSingle();
        if (byEmail?.id) internalUserId = byEmail.id;
      }
      if (!internalUserId) {
        return res.status(409).json({ success: false, error: "프로필 동기화가 필요합니다.", requiresSync: true });
      }
    } else if (kakaoEmail) {
      // 카카오 로그인 → 이메일로 profiles 조회
      const { data: prof, error: profErr } = await admin.from("profiles").select("id").eq("email", kakaoEmail).maybeSingle();
      if (profErr) return res.status(500).json({ success: false, error: "프로필 조회 실패" });
      if (!prof?.id) {
        return res.status(409).json({ success: false, error: "프로필 동기화가 필요합니다.", requiresSync: true });
      }
      internalUserId = prof.id;
    }

    if (!internalUserId) {
      return res.status(401).json({ success: false, error: "유효하지 않은 세션" });
    }

    // 3) (선택) 중복 보호: 진행중/NULL 존재 시 차단
    const { data: existing, error: findErr } = await admin
      .from("inquiries")
      .select("id, status")
      .eq("user_id", internalUserId)
      .eq("speaker_id", id)
      .or("status.is.null,status.eq.in_progress")
      .maybeSingle();
    if (findErr) return res.status(500).json({ success: false, error: "중복 검증 실패" });
    if (existing) {
      return res.status(403).json({ success: false, error: "이미 진행 중인 섭외가 있습니다." });
    }

    // 4) 섭외 저장 (service-role로 RLS 우회)
    const { data: inserted, error: insertErr } = await admin
      .from("inquiries")
      .insert([
        {
          user_id: internalUserId,
          contact_email: formEmail,
          speaker_id: id,
          status: "in_progress",
          message,
          host,
          manager_name,
          manager_phone,
          event_title,
          event_summary,
          event_date,
          event_location,
          audience_type,
          audience_count,
          requested_time,
          offer_fee,
          additional_notes,
          created_at: new Date().toISOString(),
        },
      ])
      .select("id")
      .single();

    if (insertErr || !inserted) {
      console.error("섭외 저장 실패:", insertErr);
      return res.status(500).json({ success: false, error: "섭외 정보 저장에 실패했습니다." });
    }

    const inquiryId = inserted.id;

    // 5) 토큰 생성/저장
    if (!process.env.SECRET_KEY) {
      console.warn("SECRET_KEY 없음 → 토큰 생성 스킵");
    } else {
      const token = crypto.createHmac("sha256", process.env.SECRET_KEY).update(`${inquiryId}-${Date.now()}`).digest("hex");
      const { error: upErr } = await admin.from("inquiries").update({ token }).eq("id", inquiryId);
      if (upErr) {
        console.error("토큰 저장 실패:", upErr);
        return res.status(500).json({ success: false, error: "섭외 토큰 저장에 실패했습니다." });
      }
    }

    // 6) 스피커 이메일 조회
    const { data: speaker, error: spErr } = await admin.from("speakers").select("email,name").eq("id", id).maybeSingle();
    if (spErr || !speaker?.email) {
      console.error("강연자 이메일 조회 실패:", spErr);
      return res.status(404).json({ success: false, error: "강연자 정보를 찾을 수 없습니다." });
    }

    // 7) 메일 발송 (동적 import 권장)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP 설정 없음 → 메일 생략, 요청은 성공 처리");
      return res.status(200).json({ success: true });
    }

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true", // 465면 true
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const origin = process.env.PUBLIC_ORIGIN || "https://micimpact.net";
    const tokenQS = process.env.SECRET_KEY ? `&token=${encodeURIComponent("set-in-db")}` : ""; // 토큰 저장 안했으면 빈값

    await transporter.sendMail({
      from: process.env.MAIL_FROM || `"마이크임팩트" <${process.env.SMTP_USER}>`,
      to: speaker.email,
      subject: "[마이크임팩트] 새 섭외가 도착했습니다",
      html: `
        <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
          <h2 style="color: #2c3e50;">안녕하세요. 마이크임팩트입니다.</h2>
          <p><strong>${manager_name ?? ""}</strong> 고객님께서 <strong>『${event_title ?? ""}』</strong> 강연에 대해 <strong>${event_date ?? ""}</strong> 일정 섭외를 주셨습니다.</p>
          <p>아래와 같이 섭외 요청드립니다.</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tbody>
        
              <tr><td style="font-weight: bold; width: 160px;">개최</td><td>${host ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">담당자 이름</td><td>${manager_name ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">전화번호</td><td>${manager_phone ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">이메일</td><td>${formEmail ?? ""}</td></tr>
            </tbody>
          </table>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr><td style="font-weight: bold; width: 160px;">행사명</td><td>${event_title ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">행사 설명</td><td>${event_summary ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">일자</td><td>${event_date ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">진행시간</td><td>${requested_time ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">장소</td><td>${event_location ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">대상</td><td>${(audience_type ?? "").replace(/\n/g, "<br>")}</td></tr>
              <tr><td style="font-weight: bold;">인원수</td><td>${audience_count ?? ""}</td></tr>
              <tr><td style="font-weight: bold;">섭외비</td><td>${offer_fee ?? ""}만원</td></tr>
              <tr><td style="font-weight: bold;">요청사항</td><td>${(message ?? "").replace(/\n/g, "<br>")}</td></tr>
              <tr><td style="font-weight: bold;">기타사항</td><td>${(additional_notes ?? "").replace(/\n/g, "<br>")}</td></tr>
            </tbody>
          </table>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />
          <p style="margin-bottom: 12px;">섭외 요청에 대해 아래 버튼 중 하나를 클릭해 회신해 주세요.</p>
          <div style="margin-top: 20px;">
            <a href="${origin}/api/inquiry/handle?inquiryId=${encodeURIComponent(inquiryId)}&action=accept${tokenQS}"
              style="display:inline-block; padding:12px 24px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:6px; font-weight:bold; margin-right:10px;">
              수락
            </a>
            <a href="${origin}/confirm?inquiryId=${encodeURIComponent(inquiryId)}&action=reject${tokenQS}"
              style="display:inline-block; padding:12px 24px; background-color:#f44336; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
              거절
            </a>
          </div>
          <p style="margin-top: 30px; font-size: 14px; color: #999;">※ 도메인은 추후 마이크임팩트 공식 주소로 변경될 예정입니다.</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("API 처리 중 오류:", error);
    return res.status(500).json({ success: false, error: "서버 오류가 발생했습니다." });
  }
}
