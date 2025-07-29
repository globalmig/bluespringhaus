"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";

interface BookProps {
  id: string;
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
        const res = await axios.get(`/api/inquiry/check_artist?artistId=${id}`);
        setCanApply(res.data.canApply);
      } catch (error) {
        console.error("❌ 문의 체크 실패:", error);
        setCanApply(false);
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [user, id]);

  const handleClick = async () => {
    if (!user) {
      alert("로그인 후 문의를 진행하실 수 있습니다.");
      return;
    }

    if (!canApply) {
      alert("이미 진행 중인 문의가 있습니다.");
      return;
    }

    router.push(`/artists/book/${id}`);
  };

  return (
    <div className="fixed bottom-0 w-full z-40 shadow-xl">
      <div className="w-full h-20 bg-white flex justify-center items-center shadow-xl">
        <button
          onClick={handleClick}
          disabled={canApply === false || loading}
          className={`rounded-xl px-32 py-3 text-lg text-white transition-colors ${canApply === false ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "문의하기" : canApply === false ? "이미 문의하셨습니다" : "문의하기"}
        </button>
      </div>
    </div>
  );
}
