// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
// 여기에 현재 [...nextauth].ts의 authOptions 내용 그대로 이동
export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile, user }) {
      /* 동일 */ return token;
    },
    async session({ session, token }) {
      /* 동일 */ return session;
    },
    async signIn({ user, account, profile }) {
      /* 동일 */ return true;
    },
  },
  pages: { signIn: "/", error: "/" },
  debug: process.env.NODE_ENV === "development",
};
