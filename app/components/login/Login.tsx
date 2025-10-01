// app/components/login/Login.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import KakaoLoginButton from "./KakaoLoginButton";
import axios from "axios";
import { useSession } from "next-auth/react";

axios.defaults.withCredentials = true; // ✅ 전역으로 쿠키 포함

export default function Login({ onClose }: { onClose: () => void }) {
  // ── local states (원래 있던 것 유지)
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ NextAuth 세션 (카카오)
  const { status } = useSession();

  // ✅ 중복 동기화 방지 + 성공 여부 캐시
  const syncing = useRef(false);
  const syncedOnce = useRef(false);

  // ✅ 쿼리의 next 파라미터
  const next = searchParams?.get("next") || "";

  // ✅ 카카오 로그인 완료되면 프로필 동기화 → next로 이동
  useEffect(() => {
    const run = async () => {
      if (status !== "authenticated") return;
      if (syncing.current || syncedOnce.current) return;

      syncing.current = true;
      try {
        const res = await axios.post("/api/user/sync", {});
        // 성공 플래그
        syncedOnce.current = true;

        // 모달 닫기
        onClose?.();

        // 이동 우선순위: next → refresh
        if (next) {
          router.push(next);
        } else {
          router.refresh();
        }
      } catch (e) {
        console.error("user/sync 실패", e);
        // 동기화 실패해도 로그인은 된 상태라 UX상 리다이렉트는 해줄 수 있음
        if (next) router.push(next);
      } finally {
        syncing.current = false;
      }
    };
    run();
  }, [status, next, router, onClose]);

  // ── 에러 쿼리 처리
  useEffect(() => {
    const err = searchParams?.get("error");
    if (err) setError(err);
  }, [searchParams]);

  // ── 이메일/비번 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error, user } = await signIn(email, pw);
      if (error) {
        setError(error.message);
        return;
      }

      if (user && !user.email_confirmed_at) {
        alert("이메일 인증이 완료되지 않았습니다.");
      }

      // 프로필 upsert (Supabase 경로)
      if (user?.id) {
        const trimmedEmail = email.trim();
        const { error: upsertError } = await supabase.from("profiles").upsert({ id: user.id, email: trimmedEmail }, { onConflict: "id" });
        if (upsertError) {
          console.error("❌ 프로필 upsert 실패:", upsertError);
        }
      }

      alert("로그인 성공!");
      onClose?.();

      // next 우선 이동
      if (next) {
        router.push(next);
      } else {
        router.refresh();
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] h-[760px] flex flex-col lg:flex-row rounded-2xl bg-white relative z-50 overflow-hidden">
      {/* 닫기 버튼 */}
      <button className="absolute top-4 right-4 w-10 h-10 z-10" onClick={onClose} type="button">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 좌측 비디오 */}
      <div className="hidden lg:block lg:w-1/2 h-full">
        <video src="/videos/login_pc_2.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover rounded-l-2xl" />
      </div>

      {/* 로그인 영역 */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center py-28 px-6">
        <div className="w-full max-w-md text-center mb-8">
          <h3 className="text-3xl lg:text-4xl font-semibold mb-1">성공적인 섭외,</h3>
          <h3 className="text-3xl lg:text-4xl font-semibold">로그인으로 시작됩니다.</h3>
        </div>

        <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleLogin}>
          <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-3 rounded" required />
          <input type="password" placeholder="비밀번호" value={pw} onChange={(e) => setPw(e.target.value)} className="border p-3 rounded" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="bg-black text-white py-3 rounded hover:bg-blue-600 transition-colors disabled:opacity-50" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <div className="flex justify-center gap-10 text-sm mt-4">
            <Link href="/agree" onClick={onClose}>
              <span className="cursor-pointer text-blue-500">회원가입</span>
            </Link>
            <Link href="/account/recovery" onClick={onClose}>
              <span className="cursor-pointer text-blue-500">비밀번호 찾기</span>
            </Link>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            <span className="block sm:inline">
              {error === "access_denied" && "로그인이 취소되었습니다."}
              {error === "invalid_state" && "보안 오류가 발생했습니다. 다시 시도해주세요."}
              {error === "login_failed" && "로그인 처리 중 오류가 발생했습니다."}
              {!["access_denied", "invalid_state", "login_failed"].includes(error) && error}
            </span>
          </div>
        )}

        {/* 간편 로그인 */}
        <div className="mt-12 w-full max-w-md">
          <KakaoLoginButton />
        </div>
      </div>
    </div>
  );
}
