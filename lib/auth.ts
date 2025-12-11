// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Supabase Auth로 이메일 로그인 시도
          const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            // console.error("❌ 이메일 로그인 실패:", error);
            return null;
          }

          // 로그인 성공
          // console.log("✅ 이메일 로그인 성공:", data.user.email);

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split("@")[0],
            image: data.user.user_metadata?.avatar_url || null,
          };
        } catch (err) {
          // console.error("❌ 로그인 예외:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // 1) 프로바이더별 기본 필드 세팅
      if (account?.provider === "kakao" && profile) {
        const p: any = profile;
        token.provider = "kakao";
        token.uid = String(p.id);
        token.email = p?.kakao_account?.email ?? token.email; // 카카오는 이메일 없을 수 있음
        token.name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || (token.name as string | undefined);
        token.picture = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || (token.picture as string | undefined);
      }

      if (account?.provider === "credentials" && user) {
        // authorize()에서 리턴한 user가 옴
        token.provider = "credentials";
        // next-auth는 기본적으로 token.email에 user.email을 담아줌. 안전하게 재할당
        token.email = (user as any).email ?? token.email;
        // id는 token.sub로 들어감. 필요하면 token.sub 사용 가능
      }

      // 2) manager 플래그 주입 (⭐ token.uid 말고 token.email 기준으로!)
      //    - 최초 로그인(account 존재) 또는 session.update() 트리거 시 재조회
      //    - 혹은 최초에 undefined인 경우만 조회해도 OK. (항상 조회하고 싶으면 조건을 단순화)
      const needFetch = !!account || trigger === "update" || typeof (token as any).manager === "undefined";

      if (needFetch) {
        const email = token.email as string | undefined;
        if (email) {
          const { data, error } = await supabaseAdmin.from("profiles").select("manager").eq("email", email).maybeSingle();

          (token as any).manager = !!data?.manager; // 없거나 에러면 false
        } else {
          (token as any).manager = false;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // 세션에도 복사
      (session.user as any).manager = !!(token as any).manager;
      (session.user as any).provider = (token as any).provider ?? (session.user as any).provider;

      // (선택) id 보강: next-auth는 token.sub에 user.id를 넣음
      (session.user as any).id = (session.user as any).id ?? (token as any).sub;

      // name/email/image는 next-auth가 기본 셋업하지만 보호차 재할당 가능
      session.user.email = (token.email as string | null) ?? session.user.email;
      session.user.name = (token.name as string | null) ?? session.user.name;
      session.user.image = (token.picture as string | null) ?? session.user.image;

      return session;
    },
    async signIn({ account, profile, user }) {
      // 카카오 로그인
      if (account?.provider === "kakao" && profile) {
        const p: any = profile;
        const kakaoId = String(p.id);
        const name = p?.properties?.nickname || p?.kakao_account?.profile?.nickname || null;
        const avatar_url = p?.properties?.profile_image || p?.kakao_account?.profile?.profile_image_url || null;
        const email = p?.kakao_account?.email || null;

        // console.log(`✅ 카카오 로그인 성공: ${email} (ID: ${kakaoId})`);
      }

      // 이메일 로그인
      if (account?.provider === "credentials" && user) {
        // console.log(`✅ 이메일 로그인 성공: ${user.email}`);
      }

      return true;
    },
  },
  pages: { signIn: "/", error: "/" },
  debug: process.env.NODE_ENV === "development",
};
