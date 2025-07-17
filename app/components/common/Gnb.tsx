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
    setIsModalOpen(!isModalOpen);
  };

  // ✅ 모달 상태에 따라 스크롤 제어
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // 컴포넌트 언마운트 시 복구
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // 로딩 상태일 때 전체 UI를 막지 말고 작은 로딩 표시만
  // TODO: fixed 수정해야함
  return (
    <div className="py-2 flex md:flex-col bg-zinc-100">
      <div className="w-full max-w-[1440px] h-16 md:h-24 mx-auto flex items-center justify-center md:justify-between">
        <Link href="/" className="md:block hidden font-bold">
          Mic Impact
        </Link>
        {user ? (
          <nav className="flex gap-20 pl-0 md:pl-52">
            <Link href="/">연사</Link>
            <Link href="/artists">인플루언서</Link>
          </nav>
        ) : (
          <nav className="flex gap-20">
            <Link href="/">연사</Link>
            <Link href="/artists">인플루언서</Link>
          </nav>
        )}

        {/* 로딩 상태에서도 UI 표시 */}
        <div>
          {user ? (
            <div className=" hidden md:flex items-center justify-end relative w-60 ">
              <Link href="/mypage">
                <button className="text-sm mr-10 ">마이페이지</button>
              </Link>

              <button onClick={signOut} className="text-sm">
                로그아웃
              </button>
            </div>
          ) : (
            <button onClick={handleModalToggle} className="text-sm">
              로그인
            </button>
          )}
        </div>

        {/* ✅ 모달 오버레이 */}
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-40 flex items-center justify-center">
            <div className="bg-black backdrop-blur-sm bg-opacity-50 w-full h-full" onClick={handleModalToggle}></div>

            <div className="absolute w-full max-w-[460px] lg:max-w-[1400px]">
              <Login onClose={handleModalToggle} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
