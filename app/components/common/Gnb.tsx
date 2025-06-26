"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Search from "./Search";
import Login from "../login/Login";

export default function Gnb() {
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

  return (
    <div className="py-4 flex md:flex-col flex-col-reverse">
      <div className="w-full max-w-[1440px] h-24 mx-auto flex items-center justify-center md:justify-between">
        <Link href="/" className="md:block hidden">
          로고
        </Link>
        <nav className="flex gap-20">
          <Link href="/">연사</Link>
          <Link href="/about">인플루언서</Link>
        </nav>
        <Link href="" className="ml-4 text-sm md:block hidden" onClick={handleModalToggle}>
          로그인
        </Link>
        {/* ✅ 모달 오버레이 */}
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-40 flex items-center justify-center">
            <div className="bg-black backdrop-blur-sm bg-opacity-50 w-full h-full " onClick={handleModalToggle}></div>

            <div className="absolute w-full max-w-[460px] lg:max-w-[1400px]">
              <Login onClose={handleModalToggle} />
            </div>
          </div>
        )}
      </div>
      <Search />
    </div>
  );
}
