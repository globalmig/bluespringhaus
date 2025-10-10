// app/components/login/KakaoLoginButton.tsx
"use client";
import React from "react";
import { signIn } from "next-auth/react";
interface KakaoLoginButtonProps {
  className?: string;
  onClick?: () => void; // 클릭 후 추가 작업이 있으면 사용
}
type Props = { className?: string; onClick?: () => void };
export default function KakaoLoginButton({ className = "", onClick }: Props) {
  const handleLogin = async () => {
    // ✅ 카카오 로그인 → 성공 시 메인(/)으로
    await signIn("kakao", { callbackUrl: "/" });

    // (선택) 로그인 요청 후 추가로 실행할 동작이 있다면
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      className={`flex items-center justify-center bg-[#FEE500] hover:bg-[#FFDD00]
                  text-black font-medium px-4  w-full py-3 rounded-lg transition-colors duration-200
                  min-w-[300px] ${className}`}
      aria-label="카카오로 간편 로그인"
    >
      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" className="mr-2" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 0C15.5228 0 20 3.58172 20 8C20 12.4183 15.5228 16 10 16C8.90071 16 7.84847 15.8271 6.87678 15.5122L2.5 18L4.27678 14.0878C1.70073 12.6739 0 10.4706 0 8C0 3.58172 4.47715 0 10 0Z"
          fill="#000000"
        />
      </svg>
      카카오로 간편 로그인
    </button>
  );
}
