"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  // session prop 안 넘겨도 됩니다 (NextAuth가 스스로 초기화)
  return <SessionProvider>{children}</SessionProvider>;
}
