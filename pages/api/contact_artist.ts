import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    console.log("👉 [LOG] 받은 req.body:", req.body);
    const { userEmail: formEmail, message, artistId: id, user_id } = req.body;
    console.log("👉 [LOG] 구조분해 후 값:", {
      formEmail,
      message,
      id,
      user_id,
    });
    if (!formEmail || !message || !id) {
      return res.status(400).json({
        success: false,
        error: "이메일, 메시지, 강연자 ID를 모두 입력해주세요.",
      });
    }

    // Supabase 클라이언트 생성
    const supabase = createPagesServerClient({ req, res });

    // ① inquiries 테이블에 문의 내용 저장 + 삽입된 행 반환
    const { data: insertedInquiry, error: insertError } = await supabase
      .from("inquiries_artist")
      .insert([
        {
          user_id: user_id,
          contact_email: formEmail,
          artist_id: id,
          message: message,
          created_at: new Date().toISOString(),
        },
      ])
      .select() // 삽입된 행 반환
      .single(); // 단일 행만 받음

    if (insertError || !insertedInquiry) {
      console.error("문의 저장 실패:", insertError);
      return res.status(500).json({
        success: false,
        error: "문의 정보 저장에 실패했습니다.",
      });
    }

    const inquiryId = insertedInquiry.id;

    // ② inquiryId로 토큰 생성
    const token = crypto.createHmac("sha256", process.env.SECRET_KEY!).update(`${inquiryId}-${Date.now()}`).digest("hex");

    // ③ 토큰을 inquiries 테이블에 업데이트
    const { error: updateError } = await supabase.from("inquiries_artist").update({ token }).eq("id", inquiryId);

    if (updateError) {
      console.error("토큰 저장 실패:", updateError);
      return res.status(500).json({
        success: false,
        error: "문의 토큰 저장에 실패했습니다.",
      });
    }

    // ④ 스피커 이메일 조회
    const { data: artist, error: artistError } = await supabase.from("artists").select("email").eq("id", id).single();

    if (artistError || !artist) {
      console.error("강연자 이메일 조회 실패:", artistError);
      return res.status(404).json({
        success: false,
        error: "강연자 정보를 찾을 수 없습니다.",
      });
    }

    // ⑤ 메일 발송 설정 확인
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP 설정이 없습니다.");
      return res.status(500).json({
        success: false,
        error: "메일 서버 설정 오류입니다.",
      });
    }

    // ⑥ 메일 발송
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    // TODO:도메인 변경 후 수정해야함 토근 링크
    // TODO: 메일 받은 디자인 변경해야함
    await transporter.sendMail({
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
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
