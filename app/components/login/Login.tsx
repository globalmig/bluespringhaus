"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error, user } = await signIn(email, pw);
      if (error) {
        setError(error.message);
      } else {
        if (user && !user.email_confirmed_at) {
          alert("이메일 인증이 완료되지 않았습니다.");
        }

        alert("로그인 성공!");
        const userId = user?.id;
        const trimmedEmail = email.trim();

        if (userId) {
          const { error: upsertError } = await supabase.from("profiles").upsert({ id: userId, email: trimmedEmail }, { onConflict: "id" });

          if (upsertError) {
            console.error("❌ 프로필 upsert 실패:", upsertError);
            alert("프로필 저장 중 문제가 발생했습니다.");
          }
        }

        onClose();
        router.refresh();
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] h-[760px] flex flex-col lg:flex-row rounded-2xl bg-white relative z-50 overflow-hidden">
      {/* 닫기 버튼 */}
      <button className="absolute top-4 right-4 w-10 h-10 z-10" onClick={onClose} type="button">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* PC 배경 비디오 */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <video src="/videos/login_pc_2.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover rounded-l-2xl" />
      </div>

      {/* 로그인 영역 */}
      <div className="w-full  lg:w-1/2 flex flex-col justify-center items-center py-28 px-6">
        <div className="w-full max-w-md text-center mb-8">
          <h3 className="text-3xl lg:text-4xl font-semibold mb-1">성공적인 섭외,</h3>
          <h3 className="text-3xl lg:text-4xl font-semibold">로그인으로 시작됩니다.</h3>
        </div>

        <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleLogin}>
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-3 rounded" required />
          <input type="password" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)} className="border p-3 rounded" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="bg-black text-white py-3 rounded hover:bg-blue-600 transition-colors disabled:opacity-50" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="flex justify-center gap-10 text-sm mt-4">
            <Link href="/agree" onClick={onClose}>
              <span className="cursor-pointer text-blue-500">회원가입</span>
            </Link>
            <Link href="/account/recovery" onClick={onClose}>
              <span className="cursor-pointer text-blue-500">비밀번호 찾기</span>
            </Link>
          </div>
        </form>

        {/* 간편 로그인 자리 */}
        {/* <div className="mt-12 w-full max-w-md">
          <div className="bg-black text-white text-sm h-11 flex items-center justify-center rounded">간편로그인03</div>
        </div> */}
      </div>
    </div>
  );
}
