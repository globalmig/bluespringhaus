"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Search from "./Search";
import Login from "../login/Login";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Gnb() {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isModalOpen);
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isModalOpen]);

  return (
    <div className="py-2 flex md:flex-col bg-zinc-100">
      <div className="w-full max-w-[1440px] h-16 md:h-24 mx-auto flex items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="font-bold text-lg md:text-xl">
          Mic Impact
        </Link>

        {/* 내비게이션 */}
        <nav className="flex gap-10 md:gap-20 text-sm md:text-base">
          <Link href="/">speaker</Link>
          <Link href="/artists">artist</Link>
        </nav>

        {/* 로그인/로그아웃 영역 */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/mypage" className="text-sm">
                마이페이지
              </Link>
              <button onClick={signOut} className="text-sm">
                로그아웃
              </button>
            </>
          ) : (
            <button onClick={handleModalToggle} className="text-sm">
              로그인
            </button>
          )}
        </div>
      </div>

      {/* 로그인 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 어두운 배경 */}
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleModalToggle} />

          {/* 로그인 폼 */}
          <div className="relative z-10 w-full max-w-[460px] md:max-w-[600px] mx-auto px-4">
            <Login onClose={handleModalToggle} />
          </div>
        </div>
      )}
    </div>
  );
}
