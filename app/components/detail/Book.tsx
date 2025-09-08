"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";

interface BookProps {
  id: string; // speakerId
}

export default function Book({ id }: BookProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [canApply, setCanApply] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!user) {
        setCanApply(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/inquiry/check?speakerId=${id}`);
        setCanApply(res.data.canApply);
      } catch (error) {
        console.error("❌ 섭외 체크 실패:", error);
        setCanApply(null); // ← 에러는 false가 아니라 null
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [user, id]);

  const handleClick = async () => {
    if (!user) {
      alert("로그인 후 섭외를 진행하실 수 있습니다.");
      return;
    }
    if (setCanApply === null) {
      alert("잠시후 섭외 부탁드립니다.");
    }

    if (!canApply) {
      alert("이미 진행 중인 섭외가 있습니다.");
      return;
    }

    router.push(`/book/${id}`);
  };

  return (
    <div className="fixed bottom-0 w-full z-40 shadow-xl">
      <div className="w-full h-20 bg-white flex justify-center items-center shadow-xl">
        <button
          onClick={handleClick}
          disabled={canApply === false || loading}
          className={`rounded-xl px-32 py-3 text-lg text-white transition-colors ${canApply === false ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "섭외하기" : canApply === false ? "이미 섭외하셨습니다" : "섭외하기"}
        </button>
      </div>
    </div>
  );
}
