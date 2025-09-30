import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
      // (선택) scope 지정: authorization: { params: { scope: "profile_nickname account_email profile_image" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // kakao 고유 id를 token.uid에 실어 세션까지 전달
      if (account?.provider === "kakao" && profile) {
        const p: any = profile;
        token.uid = String(p.id); // 카카오 사용자 id (숫자 → 문자열)
        token.name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || token.name;
        token.picture = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || token.picture;
        token.email = p?.kakao_account?.email || token.email;
      }
      return token;
    },
    async session({ session, token }) {
      // 클라에서 쓰기 편하게 id를 내려줌
      (session.user as any).id = (token as any).uid || null;
      return session;
    },
  },
  events: {
    // ✅ 로그인 성공 직후 서버에서 Supabase에 upsert
    async signIn({ user, account, profile }) {
      if (account?.provider !== "kakao" || !profile) return;

      const p: any = profile;
      const provider = "kakao";
      const provider_user_id = String(p.id); // kakao id
      const id = `${provider}:${provider_user_id}`;

      const name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || null;
      const avatar_url = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || null;
      const email = p?.kakao_account?.email || null;

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
        { onConflict: "id" } // id 기준 upsert
      );

      if (error) {
        console.error("[signIn upsert] app_users error:", error);
      }
    },
  },
});
