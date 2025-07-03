"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface BookProps {
  id: string;
}

export default function Book({ id }: BookProps) {
  const router = useRouter();

  const handleClick = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.push(`/book/${id}`); // 로그인 O
    } else {

      //   TODO: 로그인모달 뜨게
      alert("로그인 후 문의부탁드립니다");
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
