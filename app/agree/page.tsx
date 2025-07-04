"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Agree() {
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [thirdPartyChecked, setThirdPartyChecked] = useState(false);

  const allAgreed = termsChecked && privacyChecked && thirdPartyChecked;

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [rePw, setRePw] = useState("");

  const allInput = email && pw && rePw && pw === rePw;

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 막기
    const trimmedEmail = email.trim(); // ← 이거 꼭 추가

    // 1️⃣ 가입 전 profiles 테이블에서 이메일 중복 확인
    const { data: existing, error: profileError } = await supabase.from("profiles").select("email").eq("email", trimmedEmail).single();

    if (existing) {
      alert("이미 가입된 이메일입니다. 로그인 또는 비밀번호 찾기를 이용해주세요.");
      return;
    }

    // 2️⃣ Supabase 유저 등록
    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password: pw,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        alert("이미 가입된 이메일입니다. 로그인 또는 비밀번호 찾기를 이용해주세요.");
      } else {
        alert("회원가입에 실패했습니다: " + error.message);
      }
      return;
    }

    // // 3️⃣ 가입 성공 시 profiles 테이블에 추가 -> TODO: login 화면으로 이동
    // const userId = data.user?.id;
    // if (userId) {
    //   const { error: insertError } = await supabase.from("profiles").insert({
    //     id: userId,
    //     email: trimmedEmail,
    //   });

    //   if (insertError) {
    //     console.error("❌ 프로필 삽입 실패:", insertError.message);
    //     alert("프로필 저장 중 문제가 발생했습니다.");
    //   }
    // }

    // TODO:이메일인증활성화해야함마지막에
    // 4️⃣ 완료
    alert("회원가입이 완료되었습니다! 이메일을 확인해주세요.");
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen items-center w-full max-w-[1440px] px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">약관동의</h1>
      <p className="text-slate-600 mb-6">필수항목 및 선택항목 약관에 동의해주세요.</p>

      {/* 약관 1~3 내용 */}
      {[
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
1. 상담/문의 접수 및 응답
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

회사는 상담 및 문의에 대한 응답을 위해 다음과 같이 개인정보를 수집·이용합니다.

1. 수집 항목: 이름, 연락처(휴대폰), 이메일, 문의 내용
2. 수집 목적: 이용자 상담 및 문의 응답
3. 보유 및 이용 기간: 수집일로부터 1년간 보관 후 파기
4. 귀하는 위와 같은 개인정보 수집·이용에 동의하지 않을 수 있으나, 동의하지 않을 경우 서비스 이용이 제한될 수 있습니다.
`,
        },
        {
          label: "[필수] 제3자 정보 제공 동의",
          checked: thirdPartyChecked,
          setter: setThirdPartyChecked,
          content: `[개인정보 수집 및 이용 동의서]

회사는 상담 및 문의에 대한 응답을 위해 다음과 같이 개인정보를 수집·이용합니다.

1. 수집 항목: 이름, 연락처(휴대폰), 이메일, 문의 내용
2. 수집 목적: 이용자 상담 및 문의 응답
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

      {/* 입력 폼 노출 조건 */}
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
                placeholder=""
                onChange={(e) => setRePw(e.target.value)}
                className={`w-full border rounded-lg h-16 px-4 focus:outline-none focus:ring-2 ${rePw && pw !== rePw ? "ring-red-400 border-red-400" : "focus:ring-blue-400 focus:border-blue-400"}`}
                required
              />
              {rePw && pw !== rePw && <p className="text-red-500 text-sm pl-2 mt-1">비밀번호가 일치하지 않습니다.</p>}
            </div>
            {/* 가입하기 버튼 */}
            <div className="w-full flex justify-center mt-10 mb-32">
              <button
                disabled={!(allInput && allAgreed)}
                type="submit"
                className={`mt-8 text-lg font-semibold px-8 py-4 rounded-xl transition-all w-full max-w-[600px]
      ${allInput && allAgreed ? "bg-blue-700 text-white hover:bg-gray-800" : "bg-gray-300 text-gray-500 cursor-not-allowed"}
    `}
              >
                가입하기
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
