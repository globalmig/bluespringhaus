// app/components/detail/Book_artist.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSession } from "next-auth/react";

interface BookProps {
  id: string; // artistId
}

export default function Book({ id }: BookProps) {
  const router = useRouter();

  // Supabase + NextAuth(Kakao)
  const { user, loading: authLoading } = useAuth();
  const { status } = useSession();
  const sessionLoading = status === "loading";
  const isAuthed = !!user || status === "authenticated";

  // true=가능 / false=불가 / null=판단불가 / undefined=초기
  const [canApply, setCanApply] = useState<boolean | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");

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

      if (!isAuthed) {
        if (mounted.current) {
          setCanApply(null);
          setReason("");
          setLoading(false);
        }
        return;
      }

      try {
        const res = await axios.get("/api/inquiry/check_artist", {
          params: { artistId: id, _t: Date.now() }, // 캐시 버스터
          withCredentials: true,
          headers: { "Cache-Control": "no-cache" }, // 캐시 금지
        });
        if (!mounted.current) return;
        setCanApply(res.data?.canApply === true);
        setReason(res.data?.reason ?? "");
      } catch (err: any) {
        if (!mounted.current) return;
        const status = err?.response?.status;
        const data = err?.response?.data;

        // 409 → 프로필 동기화 후 재시도
        if (status === 409 || data?.requiresSync) {
          try {
            await axios.post("/api/user/sync", {}, { withCredentials: true });
            const r2 = await axios.get("/api/inquiry/check_artist", {
              params: { artistId: id, _t: Date.now() },
              withCredentials: true,
              headers: { "Cache-Control": "no-cache" },
            });
            setCanApply(r2.data?.canApply === true);
            setReason(r2.data?.reason ?? "");
          } catch {
            setCanApply(null);
            setReason("섭외 권한을 확인할 수 없습니다.");
          } finally {
            setLoading(false);
          }
          return;
        }

        // 403 → 이미 진행 중
        if (status === 403) {
          setCanApply(false);
          setReason(data?.reason || "이미 진행 중인 섭외가 있습니다.");
          setLoading(false);
          return;
        }

        // 401 → 비로그인
        if (status === 401) {
          setCanApply(null);
          setReason("로그인이 필요합니다.");
          setLoading(false);
          return;
        }

        // 기타 에러
        setCanApply(null);
        setReason(data?.error || "섭외 권한을 확인할 수 없습니다.");
        setLoading(false);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    check();
  }, [id, isAuthed, authLoading, sessionLoading]);

  // "가능" 확정일 때만 활성화
  const disabled = loading || !isAuthed || canApply !== true;

  const handleClick = () => {
    if (disabled) {
      if (!isAuthed) alert("로그인 후 섭외를 진행하실 수 있습니다.");
      else if (canApply === false) alert(reason || "이미 진행 중인 섭외가 있습니다.");
      else alert("잠시 후 다시 시도해주세요.");
      return;
    }
    router.push(`/artists/book/${id}`); // 라우트는 네 구조에 맞게 유지
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
