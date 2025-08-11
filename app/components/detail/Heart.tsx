"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";

export default function Heart({ targetId }: { targetId: string }) {
  const { user, loading } = useAuth();
  const [isSelected, setSelected] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // 로그인 미인증 안내 (원하면 router.push로 이동)
      // alert("로그인이 필요합니다.");
      setSelected(false);
      return;
    }
    if (loading || !user || !targetId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/heart?targetId=${encodeURIComponent(targetId)}`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        if (!cancelled && res.ok) setSelected(!!json.liked);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, loading, targetId]);

  const handleSelect = async () => {
    if (!user || !targetId || busy) return;

    setBusy(true);
    const prev = isSelected;
    setSelected(!prev); // 낙관적

    try {
      const res = await fetch(`/api/heart?targetId=${encodeURIComponent(targetId)}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "요청 실패");
      setSelected(!!json.liked);
    } catch (e) {
      console.error(e);
      setSelected(prev); // 롤백
      alert("처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" className="text-red-500 text-2xl disabled:opacity-50" aria-pressed={isSelected} aria-label={isSelected ? "찜 취소" : "찜하기"} onClick={handleSelect} disabled={busy}>
      {isSelected ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
}
