"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Login from "../login/Login";
import { useAuth } from "@/app/contexts/AuthContext";
import { FaMicrophoneAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export default function Gnb() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelected, setSelected] = useState("SPEAKERS");

  const handleSelected = (value: string) => {
    setSelected(value);
  };

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handlePrepare = () => {
    alert("준비중입니다.");
  };

  useEffect(() => {
    if (!pathname) return;
    // ✅ 경로 변경될 때마다 상태 초기화
    if (pathname.startsWith("/artists")) {
      setSelected("ARTIST");
    } else if (pathname === "/") {
      setSelected("SPEAKERS");
    } else {
      setSelected(""); // 기타 페이지 (예: /manager 등)
    }
  }, [pathname]);

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
        <Link href="/" className="font-bold text-lg md:text-xl flex md:items-center md:gap-2 text-sky-700 " onClick={() => handleSelected("")}>
          {/* <FaMicrophoneAlt />s
          MICIMPACT */}
          <Image src={"/micimpact_logo.png"} alt="마이크임팩트 로고" width={140} height={180} className="hidden md:flex" />
          <Image src={"/icon/micimpact_logo_m.png"} alt="마이크임팩트 로고" width={32} height={40} className="md:hidden flex" />
        </Link>

        {/* 내비게이션 */}
        <nav className="flex gap-4 md:gap-20 text-sm md:text-base mx-auto">
          <Link
            href="/"
            className={`flex  flex-col md:flex-row w-full mx-auto justify-center items-center px-2 font-semibold ${
              isSelected === "SPEAKERS" ? "text-sky-600 font-bold border-b-2 pb-2 border-sky-600" : "text-gray-700"
            }`}
            onClick={() => handleSelected("SPEAKERS")}
          >
            <Image src="/icon/speaker_icon.png" alt="스피커 아이콘" width={40} height={40} className="m-0 md:mr-3 hidden md:block"></Image>
            <Image src="/icon/speaker_icon.png" alt="스피커 아이콘" width={30} height={30} className="m-0 md:mr-2  md:hidden block"></Image>
            Speaker
          </Link>

          <Link
            href="/artists"
            className={`flex flex-col w-full md:flex-row items-center px-2 font-semibold ${isSelected === "ARTIST" ? "text-sky-600 font-bold border-b-2 p border-sky-600 pb-2" : "text-gray-700"}`}
            onClick={() => handleSelected("ARTIST")}
          >
            <Image src="/icon/artist_icon.png" alt="아티스트 아이콘" width={40} height={40} className="mr-3 hidden md:block"></Image>
            <Image src="/icon/artist_icon.png" alt="스피커 아이콘" width={30} height={30} className="mr-2 md:hidden block"></Image>
            Artist
          </Link>
        </nav>

        {/* 로그인/로그아웃 영역 */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* 마이페이지 */}

              <DropdownMenu>
                <DropdownMenuTrigger className="border rounded-full p-2 md:p-4 bg-gray-200 data-[state=open]:bg-black data-[state=open]:text-white transform duration-300 ease-in-out">
                  <FaRegUser size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* TODO: 계정정보 수정 기능 만들어야함 */}
                  {/* <DropdownMenuItem
                    onClick={() => {
                      handlePrepare();
                      // handleSelected("");
                    }}
                  >
                    계정정보
                  </DropdownMenuItem> */}
                  <DropdownMenuItem>
                    <Link
                      href="/mypage"
                      onClick={() => {
                        handleSelected("");
                      }}
                    >
                      진행상황
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* <button onClick={signOut} className="text-sm">
                로그아웃
              </button> */}
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
          <div className="relative z-50 w-full max-w-[460px] md:max-w-[600px] lg:max-w-[1440px] mx-auto px-4">
            <Login onClose={handleModalToggle} />
          </div>
        </div>
      )}
    </div>
  );
}
