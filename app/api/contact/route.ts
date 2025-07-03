import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, message } = body;

    if (!email || !message) {
      return NextResponse.json({ success: false, error: "이메일과 메시지를 모두 입력해주세요." }, { status: 400 });
    }

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
      to: "wdpb@mig.kr",
      subject: "🔥 새 문의가 도착했습니다",
      text: `문의자 이메일: ${email}\n\n메시지:\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("메일 전송 실패:", error);
    return NextResponse.json({ success: false, error: "메일 전송에 실패했습니다. 나중에 다시 시도해주세요." }, { status: 500 });
  }
}
