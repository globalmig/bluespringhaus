"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Login from "../login/Login";
// import { useAuth } from "@/app/contexts/AuthContext"; // ❌ NextAuth로 대체
import { FaRegUser } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"; // ✅ NextAuth

export default function Gnb() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelected, setSelected] = useState("SPEAKERS");
  const { data: session, status } = useSession(); // ✅ 로그인 상태
  const isAuthed = status === "authenticated";

  // 로그인 직후 Supabase 사용자 동기화 (서버 API 방식 쓴다면)
  useEffect(() => {
    if (isAuthed) {
      fetch("/api/user/sync", { method: "POST" }).catch(() => {});
    }
  }, [isAuthed]);

  const handleSelected = (value: string) => setSelected(value);
  const handleModalToggle = () => setIsModalOpen((prev) => !prev);
  const handlePrepare = () => alert("준비중입니다.");

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith("/artists")) setSelected("ARTIST");
    else if (pathname === "/") setSelected("SPEAKERS");
    else setSelected("");
  }, [pathname]);

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isModalOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isModalOpen]);

  return (
    <div className="py-2 flex md:flex-col bg-zinc-100">
      <div className="w-full max-w-[1440px] h-16 md:h-24 mx-auto flex items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="font-bold text-lg md:text-xl flex md:items-center md:gap-2 text-sky-700 " onClick={() => handleSelected("")}>
          <Image src={"/micimpact_logo.png"} alt="마이크임팩트 로고" width={140} height={180} className="hidden md:flex w-auto h-auto max-w-40" />

          <Image src={"/icon/micimpact_logo_m.png"} alt="마이크임팩트 로고" width={32} height={40} className="md:hidden flex w-auto h-auto" />
        </Link>

        {/* 내비게이션 */}
        <nav className="flex gap-4 md:gap-20 text-sm md:text-base mx-auto">
          <Link
            href="/"
            className={`flex flex-col md:flex-row w-full mx-auto justify-center items-center px-2 font-semibold ${
              isSelected === "SPEAKERS" ? "text-sky-600 font-bold border-b-2 pb-2 border-sky-600" : "text-gray-700"
            }`}
            onClick={() => handleSelected("SPEAKERS")}
          >
            <Image src="/icon/speaker_icon.png" alt="스피커 아이콘" width={40} height={40} className="m-0 md:mr-3 hidden md:block w-auto h-auto" />
            <Image src="/icon/speaker_icon.png" alt="스피커 아이콘" width={30} height={30} className="m-0 md:mr-2 md:hidden block w-auto h-auto" />
            Speaker
          </Link>

          <Link
            href="/artists"
            className={`flex flex-col w-full md:flex-row items-center px-2 font-semibold ${isSelected === "ARTIST" ? "text-sky-600 font-bold border-b-2 border-sky-600 pb-2" : "text-gray-700"}`}
            onClick={() => handleSelected("ARTIST")}
          >
            <Image src="/icon/artist_icon.png" alt="아티스트 아이콘" width={40} height={40} className="mr-3 hidden md:block w-auto h-auto" />
            <Image src="/icon/artist_icon.png" alt="스피커 아이콘" width={30} height={30} className="mr-2 md:hidden block w-auto h-auto" />
            Artist
          </Link>
        </nav>

        {/* 로그인/로그아웃 영역 */}
        <div className="flex items-center gap-4">
          {isAuthed ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger className="border rounded-full p-2 md:p-4 bg-gray-200 data-[state=open]:bg-black data-[state=open]:text-white transform duration-300 ease-in-out">
                  <FaRegUser size={18} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{session?.user?.name || session?.user?.email || "My Account"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/mypage" onClick={() => handleSelected("")}>
                      진행상황
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* 전용 로그인 페이지 없이 모달/카카오 버튼만 쓰는 경우 */}
              <button onClick={handleModalToggle} className="text-sm">
                로그인
              </button>
              {/* 또는 바로 카카오 로그인: signIn("kakao", { callbackUrl: "/" }) */}
              {/* <button onClick={() => signIn("kakao", { callbackUrl: "/" })} className="text-sm">카카오 로그인</button> */}
            </>
          )}
        </div>
      </div>

      {/* 로그인 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleModalToggle} />
          <div className="relative z-50 w-full max-w-[460px] md:max-w-[600px] lg:max-w-[1440px] mx-auto px-4">
            <Login onClose={handleModalToggle} />
          </div>
        </div>
      )}
    </div>
  );
}
