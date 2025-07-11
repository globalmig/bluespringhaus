"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { sessionCache } from "@/lib/supabase"; // ✅ 세션 캐시에서 사용

interface BookProps {
  id: string;
}

export default function Book_artist({ id }: BookProps) {
  const router = useRouter();

  const handleClick = async () => {
    const session = await sessionCache.getSession();

    if (session?.user) {
      // ✅ 로그인 되어 있으면 섭외 폼 페이지로 이동
      router.push(`/artists/book/${id}`);
    } else {
      // ❌ 로그인 안 돼 있으면 안내
      alert("로그인 후 문의를 진행하실 수 있습니다.");
    }
  };

  return (
    <div className="fixed bottom-0 w-full z-50 shadow-xl">
      <div className="w-full h-20 bg-white flex justify-center items-center shadow-xl">
        <button onClick={handleClick} className="bg-blue-500 text-white rounded-xl px-32 py-3 text-lg">
          문의하기
        </button>
      </div>
    </div>
  );
}
