"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Agree() {
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [thirdPartyChecked, setThirdPartyChecked] = useState(false);
  const allAgreed = termsChecked && privacyChecked && thirdPartyChecked;

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [rePw, setRePw] = useState("");
  const allInput = email && pw && rePw && pw === rePw;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // 가입 후 “메일 확인 대기” 단계 표시
  const [waitingVerify, setWaitingVerify] = useState(false);

  // 재전송 쿨다운(초)
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const router = useRouter();

  const emailRedirectTo = (process.env.NEXT_PUBLIC_SITE_URL || "") + "/loginFinal";

  const safeAlert = (msg: string) => {
    setInfoMsg(msg);
  };

  const handleResend = async (targetEmail: string) => {
    if (!targetEmail) return;
    if (cooldown > 0) return;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: targetEmail.trim(),
      options: { emailRedirectTo },
    });

    if (error) {
      safeAlert(`재전송 실패: ${error.message}`);
    } else {
      safeAlert("인증 메일을 다시 보냈습니다. 메일함(스팸함 포함)을 확인해 주세요.");
      setCooldown(60);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setInfoMsg(null);

    const trimmedEmail = email.trim();

    // (선택) profiles 중복 확인은 경합/지연으로 신뢰도가 낮아 생략하거나 참고용으로만 쓰세요.
    // Auth 레벨에서 이미 존재여부를 판단하는 쪽이 확실합니다.

    // 2️⃣ Supabase 유저 등록
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: pw,
      options: { emailRedirectTo },
    });

    if (error) {
      // 이미 가입된 이메일 케이스 → 인증 메일 재전송 시도
      const msg = (error.message || "").toLowerCase();
      if (error.status === 422 || msg.includes("already")) {
        const { error: resendErr } = await supabase.auth.resend({
          type: "signup",
          email: trimmedEmail,
          options: { emailRedirectTo },
        });
        if (resendErr) {
          safeAlert(`이미 가입된 이메일입니다. 재전송도 실패: ${resendErr.message}`);
        } else {
          safeAlert("이미 가입된 이메일입니다. 인증 메일을 다시 보냈습니다.");
          setWaitingVerify(true);
          setCooldown(60);
        }
      } else {
        safeAlert("회원가입에 실패했습니다: " + error.message);
      }
      setIsSubmitting(false);
      return;
    }

    // 3️⃣ 약관 동의 쿠키 설정
    const r = await fetch("/api/agree/accept", { method: "POST" });
    if (!r.ok) {
      safeAlert("동의 쿠키 설정에 실패했습니다. 그래도 인증 완료 후 로그인은 가능합니다.");
    }

    // 4️⃣ 인증 대기 화면으로 전환 (로그인 페이지로 곧장 보내지 않고, 먼저 인증 유도)
    setWaitingVerify(true);
    safeAlert("입력하신 이메일로 인증 링크를 보냈습니다. 메일함을 확인해 주세요.");
    setIsSubmitting(false);
  };

  // 인증 대기 화면
  if (waitingVerify) {
    return (
      <div className="flex flex-col min-h-screen items-center w-full max-w-[640px] px-4 py-10 mx-auto">
        <h1 className="text-3xl font-bold mb-2">이메일 인증을 완료해 주세요</h1>
        <p className="text-slate-600 mb-6">{infoMsg ?? "메일함(스팸함 포함)에서 인증 메일을 확인하고 링크를 클릭해 주세요."}</p>

        <Image src="/image/auth/mail_check.jpg" alt="이메일 인증" width={200} height={200} className="w-full max-w-[280px] mx-auto" />

        <div className="w-full space-y-4 mt-4">
          <button
            onClick={() => handleResend(email)}
            disabled={cooldown > 0}
            className={`w-full h-12 rounded-xl font-semibold border transition ${cooldown > 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "border-gray-300  text-zinc-800 hover:bg-zinc-100"}`}
          >
            {cooldown > 0 ? `재전송 (${cooldown}s)` : "인증 메일 재전송"}
          </button>

          <button onClick={() => router.push("/login")} className="w-full h-12 rounded-xl  border border-gray-300 hover:bg-blue-900 bg-blue-700 text-white">
            이미 인증을 마쳤어요! (로그인하기)
          </button>

          <div className="text-sm text-slate-500 text-center py-4">
            메일이 계속 안 온다면, 다른 이메일로 다시 가입하거나
            <br />
            비밀번호 재설정을 시도해 보세요.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen items-center w-full max-w-[1440px] px-4 py-10 mx-auto">
      <h1 className="text-3xl font-bold mb-2">약관동의</h1>
      <p className="text-slate-600 mb-6">필수항목 및 선택항목 약관에 동의해주세요.</p>

      {infoMsg && <div className="mb-6 w-full max-w-[600px] rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">{infoMsg}</div>}

      {[
        // 약관 섹션들 (원문 유지)
        {
          label: "[필수] 서비스 이용약관 동의",
          checked: termsChecked,
          setter: setTermsChecked,
          content: `[서비스 이용약관]

제1조 (목적)
본 약관은 귀하가 당사(이하 "회사")가 제공하는 웹사이트 서비스를 이용함에 있어 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "사이트"란 회사가 운영하는 웹사이트를 말합니다.
2. "이용자"란 사이트에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.

제3조 (서비스의 제공)
회사는 이용자에게 아래의 서비스를 제공합니다.
1. 상담/섭외 접수 및 응답
2. 기타 회사가 정하는 서비스

제4조 (서비스 이용의 제한)
회사는 다음의 경우 이용자의 서비스 이용을 제한할 수 있습니다.
1. 타인의 명의를 도용하거나 허위 정보를 기재한 경우
2. 공공질서 및 미풍양속을 해치는 행위를 한 경우

제5조 (지적재산권)
사이트에 게시된 모든 콘텐츠(이미지, 텍스트 등)의 저작권은 회사에 있으며, 사전 동의 없이 무단 복제/배포할 수 없습니다.

제6조 (약관의 개정)
회사는 필요 시 본 약관을 개정할 수 있으며, 개정 시 사전 공지합니다.`,
        },
        {
          label: "[필수] 개인정보 수집 및 이용 동의",
          checked: privacyChecked,
          setter: setPrivacyChecked,
          content: `[개인정보 수집 및 이용 동의서]

회사는 상담 및 섭외에 대한 응답을 위해 다음과 같이 개인정보를 수집·이용합니다.

1. 수집 항목: 이름, 연락처(휴대폰), 이메일, 섭외 내용
2. 수집 목적: 이용자 상담 및 섭외 응답
3. 보유 및 이용 기간: 수집일로부터 1년간 보관 후 파기
4. 귀하는 위와 같은 개인정보 수집·이용에 동의하지 않을 수 있으나, 동의하지 않을 경우 서비스 이용이 제한될 수 있습니다.
`,
        },
        {
          label: "[필수] 제3자 정보 제공 동의",
          checked: thirdPartyChecked,
          setter: setThirdPartyChecked,
          content: `[개인정보 수집 및 이용 동의서]

회사는 상담 및 섭외에 대한 응답을 위해 다음과 같이 개인정보를 수집·이용합니다.

1. 수집 항목: 이름, 연락처(휴대폰), 이메일, 섭외 내용
2. 수집 목적: 이용자 상담 및 섭외 응답
3. 보유 및 이용 기간: 수집일로부터 1년간 보관 후 파기
4. 귀하는 위와 같은 개인정보 수집·이용에 동의하지 않을 수 있으나, 동의하지 않을 경우 서비스 이용이 제한될 수 있습니다.

`,
        },
      ].map((item, i) => (
        <section key={i} className="w-full flex flex-col justify-center items-center my-4 gap-4">
          <button
            onClick={() => item.setter(!item.checked)}
            className={`flex gap-4 justify-start items-center w-full max-w-[600px] h-16 rounded-xl text-lg px-10 border shadow-md transition-all
              ${item.checked ? "bg-black text-white" : "bg-white text-zinc-900 hover:scale-105"}
            `}
          >
            <input type="checkbox" checked={item.checked} readOnly />
            <p>{item.label}</p>
          </button>
          <div className="h-48 overflow-y-auto bg-white p-4 border rounded-xl w-full max-w-[600px] text-sm text-gray-700 whitespace-pre-wrap">{item.content}</div>
        </section>
      ))}

      {/* 입력 폼 */}
      {allAgreed && (
        <section className="w-full max-w-[600px] flex flex-col justify-center items-center mt-20 border-t-2 pt-20">
          <h2 className="text-3xl font-bold mb-2">회원정보 입력</h2>
          <p className="text-slate-600 mb-6">필수항목 및 선택항목 약관에 동의해주세요.</p>

          <form className="w-full flex flex-col gap-6" onSubmit={handleSignUp}>
            <div>
              <p className="pl-2 text-lg">이메일</p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg h-16 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <p className="pl-2 text-lg">비밀번호</p>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full border rounded-lg h-16 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <p className="pl-2 text-lg">비밀번호 확인</p>
              <input
                type="password"
                value={rePw}
                onChange={(e) => setRePw(e.target.value)}
                className={`w-full border rounded-lg h-16 px-4 focus:outline-none focus:ring-2 ${rePw && pw !== rePw ? "ring-red-400 border-red-400" : "focus:ring-blue-400 focus:border-blue-400"}`}
                required
              />
              {rePw && pw !== rePw && <p className="text-red-500 text-sm pl-2 mt-1">비밀번호가 일치하지 않습니다.</p>}
            </div>

            <div className="w-full flex justify-center mt-10 mb-32">
              <button
                disabled={!(allInput && allAgreed) || isSubmitting}
                type="submit"
                className={`mt-8 text-lg font-semibold px-8 py-4 rounded-xl transition-all w-full max-w-[600px]
                  ${allInput && allAgreed && !isSubmitting ? "bg-blue-700 text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                {isSubmitting ? "처리 중..." : "가입하기"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
