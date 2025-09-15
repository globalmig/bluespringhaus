'use client';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ResetPasswordPage() {
  const supabase = createClientComponentClient();
  const sp = useSearchParams();
  const code = sp?.get('code') ?? null;
  const err  = sp?.get('error') ?? null;
  const errd = sp?.get('error_description') ?? null;
  const emailFromQS = sp?.get('email') || '';

  const [ready, setReady] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [email, setEmail] = useState(emailFromQS);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [done, setDone] = useState(false);

  const exchangedRef = useRef(false);

  useEffect(() => {
    (async () => {
      if (err) { setMsg(errd || '링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요.'); return; }
      if (!code || exchangedRef.current) return;
      exchangedRef.current = true;
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) setMsg('링크가 만료되었거나 유효하지 않습니다. 다시 시도해주세요.');
      else setReady(true);
    })();
  }, [code, err, errd, supabase]);

  const normalizeErr = (m?: string) => {
    if (!m) return null;
    if (/password should be at least/i.test(m)) return '비밀번호는 8자 이상이어야 합니다.';
    return m;
  };

  async function onChangePw(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (pw.length < 8) return setMsg('비밀번호는 8자 이상이어야 합니다.');
    if (pw !== pw2)   return setMsg('비밀번호가 일치하지 않습니다.');
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) setMsg(normalizeErr(error.message));
    else setDone(true);
  }

  async function onResend(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!email) return setMsg('가입한 이메일을 입력해주세요.');
    const origin = process.env.NEXT_PUBLIC_SITE_URL!;
    const redirectTo = `${origin}/auth/reset?email=${encodeURIComponent(email)}`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) setMsg(error.message);
    else setMsg('재설정 링크를 이메일로 다시 보냈습니다. 메일함을 확인해주세요.');
  }

  if (done) {
    return <div className="max-w-sm mx-auto mt-24">변경 완료! 새 비밀번호로 로그인해주세요.</div>;
  }

  if (!code && !err) {
    return (
      <div className="max-w-sm mx-auto mt-24 space-y-3">
        <h1 className="text-xl font-semibold">비밀번호 재설정</h1>
        <form onSubmit={onResend} className="space-y-2">
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2" placeholder="가입한 이메일" required />
          <button className="w-full rounded-md bg-zinc-900 text-white py-2">재설정 링크 보내기</button>
        </form>
      </div>
    );
  }

  if (msg && !ready) {
    return (
      <div className="max-w-sm mx-auto mt-24 space-y-3">
        <p className="text-sm text-red-600">{msg}</p>
        <form onSubmit={onResend} className="space-y-2">
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2" placeholder="가입한 이메일" required />
          <button className="w-full rounded-md bg-zinc-900 text-white py-2">재설정 링크 다시 보내기</button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={onChangePw} className="max-w-sm mx-auto mt-24 space-y-3">
      <h1 className="text-xl font-semibold">새 비밀번호 설정</h1>
      {!ready && <div className="text-sm text-zinc-500">링크 확인 중…</div>}
      <input type="password" disabled={!ready} value={pw}  onChange={(e)=>setPw(e.target.value)}
        className="w-full border rounded-md px-3 py-2" placeholder="새 비밀번호" />
      <input type="password" disabled={!ready} value={pw2} onChange={(e)=>setPw2(e.target.value)}
        className="w-full border rounded-md px-3 py-2" placeholder="새 비밀번호 확인" />
      <button disabled={!ready} className="w-full rounded-md bg-zinc-900 text-white py-2">비밀번호 변경</button>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </form>
  );
}
