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
      artistId: id,
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

    const supabase = createPagesServerClient({ req, res });

    // ✅ 로그인된 유저 확인
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({ success: false, error: "로그인이 필요합니다." });
    }

    // ✅ 문의 내용 저장
    const { data: insertedInquiry, error: insertError } = await supabase
      .from("inquiries_artist")
      .insert([
        {
          user_id: user.id, // ✅ 여기서 서버에서 user.id 사용
          contact_email: formEmail,
          artist_id: id,
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
      return res.status(500).json({ success: false, error: "문의 정보 저장에 실패했습니다." });
    }

    const inquiryId = insertedInquiry.id;

    // ✅ 수락/거절용 토큰 생성
    const token = crypto.createHmac("sha256", process.env.SECRET_KEY!).update(`${inquiryId}-${Date.now()}`).digest("hex");

    // ✅ 토큰을 테이블에 저장
    const { error: updateError } = await supabase.from("inquiries_artist").update({ token }).eq("id", inquiryId);

    if (updateError) {
      console.error("토큰 저장 실패:", updateError);
      return res.status(500).json({ success: false, error: "문의 토큰 저장에 실패했습니다." });
    }

    // ✅ 아티스트 이메일 가져오기
    const { data: artist, error: artistError } = await supabase.from("artists").select("email").eq("id", id).single();

    if (artistError || !artist) {
      console.error("강연자 이메일 조회 실패:", artistError);
      return res.status(404).json({ success: false, error: "강연자 정보를 찾을 수 없습니다." });
    }

    // ✅ SMTP 환경변수 체크
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP 설정이 없습니다.");
      return res.status(500).json({ success: false, error: "메일 서버 설정 오류입니다." });
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
      to: artist.email,
      subject: "[마이크임팩트] 새 문의가 도착했습니다",
      html: `
        <h3>새 문의가 도착했습니다</h3>
        <p><strong>문의자 연락처:</strong> ${formEmail}</p>
        <hr>
        <p><strong>메시지:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p>
          <a href="https://bluespringhaus-rbt5.vercel.app/api/inquiry_artist/handle?inquiryId=${inquiryId}&action=accept&token=${token}"
            style="padding:12px 20px;background-color:#4CAF50;color:white;text-decoration:none;border-radius:4px;">
            수락
          </a>
          <a href="https://bluespringhaus-rbt5.vercel.app/api/inquiry_artist/handle?inquiryId=${inquiryId}&action=reject&token=${token}"
            style="padding:12px 20px;background-color:#f44336;color:white;text-decoration:none;border-radius:4px;margin-left:10px;">
            거절
          </a>
        </p>
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
