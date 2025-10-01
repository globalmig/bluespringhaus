"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSession } from "next-auth/react";

interface BookProps {
  id: string; // speakerId
}

export default function Book({ id }: BookProps) {
  const router = useRouter();

  // 두 체계 모두 읽기
  const { user, loading: authLoading } = useAuth();
  const { data: session, status } = useSession();

  const sessionLoading = status === "loading";
  const isAuthed = !!user || status === "authenticated";

  const [canApply, setCanApply] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      // 아직 로그인 판단 전이면 대기
      if (authLoading || sessionLoading) return;

      if (!isAuthed) {
        setCanApply(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/inquiry/check?speakerId=${id}`, {
          withCredentials: true,
        });
        setCanApply(res.data.canApply);
      } catch (error) {
        console.error("❌ 섭외 체크 실패:", error);
        setCanApply(null); // 에러는 판단불가(null)로
      } finally {
        setLoading(false);
      }
    };

    check();
  }, [id, isAuthed, authLoading, sessionLoading]);

  const handleClick = () => {
    // 아직 판단 전이면 막기
    if (authLoading || sessionLoading || loading) return;

    if (!isAuthed) {
      alert("로그인 후 섭외를 진행하실 수 있습니다.");
      return;
    }

    if (canApply === null) {
      alert("잠시 후 다시 시도해주세요.");
      return;
    }

    if (!canApply) {
      alert("이미 진행 중인 섭외가 있습니다.");
      return;
    }

    router.push(`/book/${id}`);
  };

  const disabled = loading || !isAuthed || canApply === false;

  return (
    <div className="fixed bottom-0 w-full z-40 shadow-xl">
      <div className="w-full h-20 bg-white flex justify-center items-center shadow-xl">
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`rounded-xl px-32 py-3 text-lg text-white transition-colors ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "확인 중..." : !isAuthed ? "로그인 필요" : canApply === false ? "이미 섭외하셨습니다" : "섭외하기"}
        </button>
      </div>
    </div>
  );
}
