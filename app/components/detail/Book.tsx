// app/components/detail/Book.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const { user, loading: authLoading } = useAuth(); // Supabase
  const { status } = useSession(); // NextAuth(Kakao)
  const sessionLoading = status === "loading";
  const isAuthed = !!user || status === "authenticated";

  // canApply: true(가능)/false(불가)/null(판단불가)/undefined(초기)
  const [canApply, setCanApply] = useState<boolean | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const check = async () => {
      if (authLoading || sessionLoading) return;

      // 비로그인은 판단불가로 표시(버튼 비활성)
      if (!isAuthed) {
        if (mounted.current) {
          setCanApply(null);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await axios.get(`/api/inquiry/check`, {
          params: { speakerId: id, _t: Date.now() }, // 캐시 버스터
          withCredentials: true,
          headers: { "Cache-Control": "no-cache" }, // 캐시 금지
        });
        if (mounted.current) setCanApply(res.data?.canApply === true);
      } catch (err: any) {
        // 409 → 프로필 동기화 후 재시도
        if (err?.response?.status === 409 || err?.response?.data?.requiresSync) {
          try {
            await axios.post("/api/user/sync", {}, { withCredentials: true });
            const r2 = await axios.get(`/api/inquiry/check`, {
              params: { speakerId: id, _t: Date.now() },
              withCredentials: true,
              headers: { "Cache-Control": "no-cache" },
            });
            if (mounted.current) setCanApply(r2.data?.canApply === true);
          } catch {
            if (mounted.current) setCanApply(null); // 판단불가로
          }
        } else {
          if (mounted.current) setCanApply(null);
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    check();
  }, [id, isAuthed, authLoading, sessionLoading]);

  // "가능"으로 확정됐을 때만 활성화
  const disabled = loading || !isAuthed || canApply !== true;

  const handleClick = () => {
    if (disabled) return;
    router.push(`/book/${id}`);
  };

  return (
    <div className="fixed bottom-0 w-full z-40 shadow-xl">
      <div className="w-full h-20 bg-white flex justify-center items-center shadow-xl">
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`rounded-xl px-32 py-3 text-lg text-white transition-colors ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "확인 중..." : !isAuthed ? "로그인 필요" : canApply === true ? "섭외하기" : canApply === false ? "이미 섭외하셨습니다" : "확인 중..."}
        </button>
      </div>
    </div>
  );
}
