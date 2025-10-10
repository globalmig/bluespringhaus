// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
    async jwt({ token, account, profile, trigger }) {
      // 1) 기존 카카오 프로필 매핑
      if (account?.provider === "kakao" && profile) {
        const p: any = profile;
        token.uid = String(p.id);
        token.provider = "kakao";
        token.name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || token.name;
        token.picture = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || token.picture;
        token.email = p?.kakao_account?.email || token.email;
      }

      // 2) manager 플래그 주입 (profiles 테이블에서 조회)
      const shouldFetchManager = account?.provider === "kakao" || trigger === "update" || typeof (token as any).manager === "undefined";

      if (shouldFetchManager && token.uid) {
        // ✅ profiles 테이블의 id는 UUID 타입이므로 이메일로 조회
        // 또는 profiles 테이블의 실제 구조에 맞게 수정 필요

        try {
          // 이메일로 조회
          const { data, error } = await supabaseAdmin.from("profiles").select("manager").eq("email", token.email).single();

          if (!error && data) {
            (token as any).manager = !!data?.manager;
            console.log(`✅ Manager 권한 확인: ${token.email} = ${data.manager}`);
          } else {
            (token as any).manager = false;
            console.log(`❌ Manager 조회 실패 또는 권한 없음: ${token.email}`, error?.message);
          }
        } catch (err) {
          (token as any).manager = false;
          console.error("❌ Manager 조회 예외:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.uid) {
        (session.user as any).id = token.uid;
        (session.user as any).provider = token.provider || "kakao";
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }

      // ✅ 세션에도 노출
      (session.user as any).manager = !!(token as any).manager;

      return session;
    },

    async signIn({ account, profile }) {
      if (account?.provider !== "kakao" || !profile) return true;

      const p: any = profile;
      const kakaoId = String(p.id);
      const name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || null;
      const avatar_url = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || null;
      const email = p?.kakao_account?.email || null;

      try {
        // ✅ profiles 테이블 구조에 맞게 조회만 수행 (insert는 하지 않음)
        // profiles는 Supabase Auth가 자동 생성하는 테이블이므로
        // 여기서는 manager 권한만 확인
        console.log(`✅ 로그인 성공: ${email} (ID: ${kakaoId})`);
      } catch (err) {
        console.error("❌ signIn 예외:", err);
      }

      return true;
    },
  },
  pages: { signIn: "/", error: "/" },
  debug: process.env.NODE_ENV === "development",
};
