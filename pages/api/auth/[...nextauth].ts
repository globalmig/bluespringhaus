// pages/api/auth/[...nextauth].ts`
import NextAuth, { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
  ],

  // ✅ JWT 전략 명시 (중요!)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  // ✅ secret 명시 (필수!)
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, profile, user }) {
      console.log("🔍 JWT 콜백:", { token, account, profile, user });

      // kakao 고유 id를 token.uid에 실어 세션까지 전달
      if (account?.provider === "kakao" && profile) {
        const p: any = profile;
        token.uid = String(p.id); // 카카오 사용자 id
        token.provider = "kakao";
        token.name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || token.name;
        token.picture = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || token.picture;
        token.email = p?.kakao_account?.email || token.email;

        console.log("✅ 카카오 정보 저장:", token);
      }
      return token;
    },

    async session({ session, token }) {
      console.log("🔍 Session 콜백:", { session, token });

      // 클라에서 쓰기 편하게 id를 내려줌
      if (token?.uid) {
        (session.user as any).id = token.uid;
        (session.user as any).provider = token.provider || "kakao";
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;

        console.log("✅ 세션 생성 완료:", session.user);
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      console.log("🔍 SignIn 콜백:", { user, account, profile });

      if (account?.provider !== "kakao" || !profile) {
        console.log("⚠️ 카카오 로그인 아님");
        return true;
      }

      const p: any = profile;
      const provider = "kakao";
      const provider_user_id = String(p.id);
      const id = `${provider}:${provider_user_id}`;

      const name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || null;
      const avatar_url = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || null;
      const email = p?.kakao_account?.email || null;

      console.log("💾 app_users 저장 시도:", { id, provider, provider_user_id, email, name });

      try {
        const { error } = await supabaseAdmin.from("app_users").upsert(
          {
            id,
            provider,
            provider_user_id,
            email,
            name,
            avatar_url,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        if (error) {
          console.error("❌ app_users 저장 실패:", error);
        } else {
          console.log("✅ app_users 저장 성공");
        }
      } catch (err) {
        console.error("❌ app_users upsert 예외:", err);
      }

      return true; // ✅ 반드시 true 반환
    },
  },

  pages: {
    signIn: "/", // 로그인 페이지
    error: "/", // 에러 페이지
  },

  debug: process.env.NODE_ENV === "development", // ✅ 개발 환경에서 디버그 로그
};

export default NextAuth(authOptions);
