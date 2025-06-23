import Link from "next/link";
import React from "react";

export default function Gnb() {
  return (
    <div className="border-2 w-full max-w-[1440px] h-24 mx-auto flex items-center justify-between">
      <Link href="/">로고</Link>
      <nav className="flex gap-20">
        <Link href="/">연사</Link>
        <Link href="/about">인플루언서</Link>
      </nav>
      <Link href="/login" className="ml-4 text-sm">
        로그인
      </Link>
    </div>
  );
}
