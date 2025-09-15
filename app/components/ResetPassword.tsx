"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ResetPassword() {
  // ✅ PKCE 플로우 명시
  const supabase = createClientComponentClient({
    options: { auth: { flowType: "pkce" } },
  });

  const router = useRouter();
  const sp = useSearchParams();

  // Supabase가 리디렉트해줄 때 보통 `?code=...&type=recovery`
  // (일부 환경에선 token_hash가 올 수 있어 폴백용으로 받음)
  const code = sp?.get("code") ?? null; // PKCE 교환용
  const tokenHash = sp?.get("token_hash") ?? null; // verifyOtp 폴백용
  const type = (sp?.get("type") ?? "").toLowerCase(); // recovery 등
  const err = sp?.get("error") ?? null;
  const errd = sp?.get("error_description") ?? null;
  const emailFromQS = sp?.get("email") || "";

  const [ready, setReady] = useState(false); // 인증 완료 → 폼 활성화
  const [msg, setMsg] = useState<string | null>(null);
  const [email, setEmail] = useState(emailFromQS);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [done, setDone] = useState(false);

  const [authLoading, setAuthLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const handledRef = useRef(false);

  // ----- 인증 링크 처리 -----
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (err) {
        if (mounted) setMsg(errd || "링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요.");
        return;
      }

      // 링크 파라미터가 없으면(직접 접근) 아무 것도 안 함
      if (!code && !sp?.get("token_hash")) return;

      setAuthLoading(true);
      setMsg(null);

      try {
        // ✅ 비번 재설정은 항상 verifyOtp 사용
        //    token_hash가 따로 없으면 Supabase가 넘긴 code를 그대로 token_hash로 사용
        if (type === "recovery") {
          const token_hash = sp?.get("token_hash") ?? code!;
          const { error } = await supabase.auth.verifyOtp({
            type: "recovery",
            token_hash,
          });
          if (error) throw error;
          if (!mounted) return;
          setReady(true);
          return;
        }

        // (참고) 다른 타입(예: magiclink/oauth callback)일 때만 PKCE 교환
        if (code) {
          const { error, data } = await supabase.auth.exchangeCodeForSession(code);
          if (error || !data?.session) throw error ?? new Error("세션 생성 실패");
          if (!mounted) return;
          setReady(true);
          return;
        }

        if (mounted) setMsg("유효한 재설정 링크가 아닙니다. 이메일에서 링크를 다시 열어주세요.");
      } catch (e: any) {
        if (mounted) setMsg(e?.message || "링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요.");
      } finally {
        if (mounted) setAuthLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, type, err, errd, supabase]);

  // ----- 에러 메시지 정규화 -----
  const normalizeErr = (m?: string) => {
    if (!m) return null;
    if (/password should be at least/i.test(m)) return "비밀번호는 8자 이상이어야 합니다.";
    if (/same password/i.test(m)) return "이전과 같은 비밀번호입니다. 다른 비밀번호를 사용해주세요.";
    if (/leaked password/i.test(m)) return "유출된 비밀번호로 확인됩니다. 다른 비밀번호를 사용해주세요.";
    if (/weak password/i.test(m)) return "비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.";
    return m;
  };

  // ----- 비밀번호 변경 -----
  async function onChangePw(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (pw.length < 8) return setMsg("비밀번호는 8자 이상이어야 합니다.");
    if (pw !== pw2) return setMsg("비밀번호가 일치하지 않습니다.");

    setFormLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setMsg("세션이 만료되었습니다. 다시 비밀번호 재설정을 요청해주세요.");
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) setMsg(normalizeErr(error.message));
      else {
        setDone(true);
        setTimeout(() => router.push("/"), 1500);
      }
    } catch {
      setMsg("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setFormLoading(false);
    }
  }

  // ----- 재전송 -----
  async function onResend(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!email) return setMsg("가입한 이메일을 입력해주세요.");

    setFormLoading(true);
    try {
      const origin = process.env.NEXT_PUBLIC_SITE_URL!;
      const redirectTo = `${origin}/auth/reset`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) setMsg(error.message);
      else setMsg("재설정 링크를 이메일로 다시 보냈습니다. 메일함을 확인해주세요.");
    } catch {
      setMsg("이메일 전송 중 오류가 발생했습니다.");
    } finally {
      setFormLoading(false);
    }
  }

  // ----- 화면들 -----
  if (done) {
    return (
      <div className="max-w-sm mx-auto mt-24 text-center space-y-3">
        <div className="text-green-600 text-4xl">✓</div>
        <h1 className="text-xl font-semibold text-green-600">변경 완료!</h1>
        <p className="text-sm text-zinc-600">새 비밀번호로 로그인해주세요.</p>
      </div>
    );
  }

  // 직접 접근(링크 없이)
  if (!code && !tokenHash && !err) {
    return (
      <div className="max-w-sm mx-auto mt-24 space-y-4">
        <h1 className="text-xl font-semibold">비밀번호 재설정</h1>
        <p className="text-sm text-zinc-600">가입하신 이메일 주소로 재설정 링크를 보내드립니다.</p>
        <form onSubmit={onResend} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="가입한 이메일"
            required
            disabled={formLoading}
          />
          <button type="submit" disabled={formLoading} className="w-full rounded-md bg-zinc-900 hover:bg-zinc-800 text-white py-2 disabled:opacity-50">
            {formLoading ? "보내는 중..." : "재설정 링크 보내기"}
          </button>
        </form>
        {msg && <p className={`text-sm ${msg.includes("보냈습니다") ? "text-green-600" : "text-red-600"}`}>{msg}</p>}
      </div>
    );
  }

  // 링크 처리 중 오류
  if (msg && !ready) {
    return (
      <div className="max-w-sm mx-auto mt-24 space-y-4">
        <h1 className="text-xl font-semibold text-red-600">링크 오류</h1>
        <p className="text-sm text-red-600">{msg}</p>
        <form onSubmit={onResend} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="가입한 이메일"
            required
            disabled={formLoading}
          />
          <button type="submit" disabled={formLoading} className="w-full rounded-md bg-zinc-900 hover:bg-zinc-800 text-white py-2 disabled:opacity-50">
            {formLoading ? "보내는 중..." : "재설정 링크 다시 보내기"}
          </button>
        </form>
      </div>
    );
  }

  // 비밀번호 변경 폼
  return (
    <div className="max-w-sm mx-auto mt-24">
      <form onSubmit={onChangePw} className="space-y-4">
        <h1 className="text-xl font-semibold">새 비밀번호 설정</h1>

        {authLoading && !ready && (
          <div className="text-sm text-blue-600 flex items-center gap-2 p-3 bg-blue-50 rounded-md">
            <div className="animate-spin w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full"></div>
            링크 확인 중...
          </div>
        )}

        {ready && <div className="text-xs text-green-600 bg-green-50 p-2 rounded-md">✓ 링크 인증이 완료되었습니다.</div>}

        <div className="space-y-3">
          <input
            type="password"
            disabled={!ready || formLoading}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="새 비밀번호 (8자 이상)"
            minLength={8}
          />
          <input
            type="password"
            disabled={!ready || formLoading}
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className="w-full border rounded-md px-3 py-2 disabled:bg-gray-100 focus:outline-none focus:border-blue-500"
            placeholder="새 비밀번호 확인"
            minLength={8}
          />
          <button type="submit" disabled={!ready || formLoading} className="w-full rounded-md bg-zinc-900 hover:bg-zinc-800 text-white py-2 disabled:opacity-50">
            {formLoading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </div>

        {msg && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{msg}</p>}
      </form>
    </div>
  );
}
