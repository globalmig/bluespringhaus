"use client";
import React from "react";
import { MdOutlineMail } from "react-icons/md";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ForgotPasswordPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // 운영/로컬 모두 동작하도록 origin 계산
      const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL;
      const redirectTo = `${origin}/auth/reset`;

      // ✅ 비밀번호 재설정 이메일 발송
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      // 보안상: 존재/미존재를 노출하지 말고 항상 같은 응답 처리
      if (error) console.error(error);
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-sm mx-auto mt-24">
        <h1 className="text-xl font-semibold mb-2">메일을 확인해주세요</h1>
        <p className="text-sm text-zinc-600">입력하신 주소로 비밀번호 재설정 링크를 보냈어요. 링크를 눌러 새 비밀번호를 설정해주세요.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px] mx-auto px-4">
      <h1 className="text-2xl font-bold mx-auto  mt-10 md:mt-20 text-center">비밀번호 찾기</h1>
      <h2 className="w-full  mb-10 text-center text-lg mt-2 text-zinc-700">등록하신 이메일 주소를 입력해주세요.</h2>
      <form className="w-full" onSubmit={onSubmit}>
        <div className="flex items-center border-2 rounded-md w-full mt-4">
          <MdOutlineMail className="ml-3 text-gray-400" size={"24"} />
          <input type="email" required className="flex-1 p-4 rounded-md focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="가입한 이메일" />
        </div>
        <button disabled={loading} type="submit" className="bg-sky-500 text-white font-bold  w-full py-3 md:py-5 text-xl rounded-md mt-5">
          {loading ? "…" : "다음"}
        </button>
      </form>
    </div>
  );
}
