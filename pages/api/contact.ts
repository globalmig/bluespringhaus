import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { userEmail: formEmail, message, speakerId: id, user_id } = req.body;
    // console.log("넘겨받은 user_id:", user_id);

    if (!formEmail || !message || !id) {
      return res.status(400).json({
        success: false,
        error: "이메일, 메시지, 강연자 ID를 모두 입력해주세요.",
      });
    }

    // Pages Router용 Supabase 클라이언트 생성
    const supabase = createPagesServerClient({ req, res });

    // profiles에 로그인 유저 이메일 upsert
    // const { error: profileError } = await supabase.from("profiles").upsert([{ email: loginEmail }], { onConflict: "email" });

    // if (profileError) {
    //   console.error("프로필 저장 실패:", profileError);
    //   return res.status(500).json({
    //     success: false,
    //     error: "문의자 정보 저장에 실패했습니다.",
    //   });
    // }

    // inquiries 테이블에 문의 내용 저장
    const { error: insertError } = await supabase.from("inquiries").insert([
      {
        user_id: user_id,
        contact_email: formEmail, // 폼에 입력한 연락처 이메일 별도 저장
        speaker_id: id,
        message: message,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("문의 저장 실패:", insertError);
      return res.status(500).json({
        success: false,
        error: "문의 정보 저장에 실패했습니다.",
      });
    }

    // 스피커 이메일 조회
    const { data: speaker, error: speakerError } = await supabase.from("speakers").select("email").eq("id", id).single();

    if (speakerError || !speaker) {
      console.error("강연자 이메일 조회 실패:", speakerError);
      return res.status(404).json({
        success: false,
        error: "강연자 정보를 찾을 수 없습니다.",
      });
    }

    // 메일 발송 설정 확인
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error("SMTP 설정이 없습니다.");
      return res.status(500).json({
        success: false,
        error: "메일 서버 설정 오류입니다.",
      });
    }

    // 메일 발송
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
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: speaker.email,
      subject: "[마이크임팩트] 새 문의가 도착했습니다",
      html: `
        <h3>새 문의가 도착했습니다</h3>
        <p><strong>문의자 연락처:</strong> ${formEmail}</p>
         
        <hr>
        <p><strong>메시지:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
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
