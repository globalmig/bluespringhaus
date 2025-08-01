import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
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
    } = req.body;

    if (!formEmail || !message || !id) {
      return res.status(400).json({
        success: false,
        error: "이메일, 메시지, 강연자 ID를 모두 입력해주세요.",
      });
    }

    // ✅ Supabase 인증 유저 가져오기

    const supabase = createPagesServerClient({ req, res });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        error: "로그인이 필요합니다.",
      });
    }

    // ✅ 문의 내용 저장
    const { data: insertedInquiry, error: insertError } = await supabase
      .from("inquiries")
      .insert([
        {
          user_id: user.id, // 💡 여기!
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
      .select()
      .single();

    if (insertError || !insertedInquiry) {
      console.error("문의 저장 실패:", insertError);
      return res.status(500).json({
        success: false,
        error: "문의 정보 저장에 실패했습니다.",
      });
    }

    const inquiryId = insertedInquiry.id;

    // ✅ 토큰 생성
    const token = crypto.createHmac("sha256", process.env.SECRET_KEY!).update(`${inquiryId}-${Date.now()}`).digest("hex");

    // ✅ 토큰 저장
    const { error: updateError } = await supabase.from("inquiries").update({ token }).eq("id", inquiryId);

    if (updateError) {
      console.error("토큰 저장 실패:", updateError);
      return res.status(500).json({
        success: false,
        error: "문의 토큰 저장에 실패했습니다.",
      });
    }

    // ✅ 스피커 이메일 조회
    const { data: speaker, error: speakerError } = await supabase.from("speakers").select("email").eq("id", id).single();

    if (speakerError || !speaker) {
      console.error("강연자 이메일 조회 실패:", speakerError);
      return res.status(404).json({
        success: false,
        error: "강연자 정보를 찾을 수 없습니다.",
      });
    }

    // ✅ SMTP 설정 체크
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP 설정이 없습니다.");
      return res.status(500).json({
        success: false,
        error: "메일 서버 설정 오류입니다.",
      });
    }

    // ✅ 메일 발송
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"마이크임팩트" <${process.env.SMTP_USER}>`,
      to: speaker.email,
      subject: "[마이크임팩트] 새 문의가 도착했습니다",
      html: `
  <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; font-size: 16px; color: #333; line-height: 1.6;">
    <h2 style="color: #2c3e50;">안녕하세요. 마이크임팩트입니다.</h2>

    <p><strong>${manager_name}</strong> 고객님께서 <strong>『${event_title}』</strong> 강연에 대해 <strong>${event_date}</strong> 일정 문의를 주셨습니다.</p>
    <p>아래와 같이 섭외 요청드립니다.</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tbody>
        <tr><td style="font-weight: bold; width: 160px;">개최</td><td>${host}</td></tr>
        <tr><td style="font-weight: bold;">담당자 이름</td><td>${manager_name}</td></tr>
        <tr><td style="font-weight: bold;">전화번호</td><td>${manager_phone}</td></tr>
        <tr><td style="font-weight: bold;">이메일</td><td>${formEmail}</td></tr>
      </tbody>
    </table>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />

    <table style="width: 100%; border-collapse: collapse;">
      <tbody>
        <tr><td style="font-weight: bold; width: 160px;">행사명</td><td>${event_title}</td></tr>
        <tr><td style="font-weight: bold;">행사 설명</td><td>${event_summary}</td></tr>
        <tr><td style="font-weight: bold;">일자</td><td>${event_date}</td></tr>
        <tr><td style="font-weight: bold;">장소</td><td>${event_location}</td></tr>
        <tr><td style="font-weight: bold;">대상</td><td>${audience_type.replace(/\n/g, "<br>")}</td></tr>
        <tr><td style="font-weight: bold;">인원수</td><td>${audience_count}</td></tr>
        <tr><td style="font-weight: bold;">요청사항</td><td>${message.replace(/\n/g, "<br>")}</td></tr>
        <tr><td style="font-weight: bold;">요청 시간</td><td>${requested_time}</td></tr>
        <tr><td style="font-weight: bold;">섭외비</td><td>${offer_fee}</td></tr>
        <tr><td style="font-weight: bold;">기타사항</td><td>${additional_notes.replace(/\n/g, "<br>")}</td></tr>
      </tbody>
    </table>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;" />

    <p style="margin-bottom: 12px;">섭외 요청에 대해 아래 버튼 중 하나를 클릭해 회신해 주세요.</p>

    <div style="margin-top: 20px;">
      <a href="https://bluespringhaus-rbt5.vercel.app/api/inquiry/handle?inquiryId=${inquiryId}&action=accept&token=${token}"
        style="display:inline-block; padding:12px 24px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:6px; font-weight:bold; margin-right:10px;">
        수락
      </a>
      <a href="https://bluespringhaus-rbt5.vercel.app/confirm?inquiryId=${inquiryId}&action=reject&token=${token}"
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
    return res.status(500).json({
      success: false,
      error: "서버 오류가 발생했습니다.",
    });
  }
}
