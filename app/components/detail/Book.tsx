"use client";

import React from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";

interface BookProps {
  id: string; // speakerId
}

export default function Book({ id }: BookProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = async () => {
    if (!user) {
      alert("로그인 후 문의를 진행하실 수 있습니다.");
      return;
    }

    try {
      const res = await axios.get(`/api/inquiry/check?speakerId=${id}`);
      const { canApply, reason } = res.data;

      if (!canApply) {
        alert(reason || "이미 진행 중인 문의가 있습니다.");
        return;
      }

      router.push(`/book/${id}`);
    } catch (error) {
      console.error("❌ 문의 가능 여부 확인 실패:", error);
      alert("잠시 후 다시 시도해주세요.");
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
