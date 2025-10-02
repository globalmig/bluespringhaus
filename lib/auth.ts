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
    async jwt({ token, account, profile }) {
      if (account?.provider === "kakao" && profile) {
        const p: any = profile;
        token.uid = String(p.id);
        token.provider = "kakao";
        token.name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || token.name;
        token.picture = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || token.picture;
        token.email = p?.kakao_account?.email || token.email;
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
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider !== "kakao" || !profile) return true;
      const p: any = profile;
      const provider = "kakao";
      const provider_user_id = String(p.id);
      const id = `${provider}:${provider_user_id}`;
      const name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || null;
      const avatar_url = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || null;
      const email = p?.kakao_account?.email || null;

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
        if (error) console.error("❌ app_users upsert 실패:", error);
      } catch (err) {
        console.error("❌ app_users upsert 예외:", err);
      }
      return true;
    },
  },
  pages: { signIn: "/", error: "/" },
  debug: process.env.NODE_ENV === "development",
};
