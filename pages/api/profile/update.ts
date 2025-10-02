// pages/api/user/sync.ts  ← 파일명 그대로 써도 되고, 네가 쓰는 "프로필 업데이트" API에 교체해도 됨
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
// ↓ 경로는 프로젝트에 맞게 (pages/api/auth/[...nextauth].ts 에서 export)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // 1) 두 체계의 로그인 상태 확인 (Supabase Auth + NextAuth Kakao)
    const supaPages = createPagesServerClient({ req, res });
    const {
      data: { user: supaUser },
    } = await supaPages.auth.getUser();

    const session = await getServerSession(req, res, authOptions);
    const kakaoUser = session?.user as any | undefined; // { email, name, image, provider, uid }

    if (!supaUser && !kakaoUser) {
      return res.status(401).json({ success: false, error: "로그인이 필요합니다." });
    }

    // 2) 서버 전용 Supabase 클라이언트 (RLS 우회용) — 절대 클라이언트에 노출 금지
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!, // ✅ 서버 전용 키
      { auth: { persistSession: false } }
    );

    // 3) 공통 프로필 페이로드 구성
    // - Supabase Auth: provider='supabase', external_id = supaUser.id(uuid)
    // - Kakao(NextAuth): provider='kakao', external_id = kakaoUser.uid (숫자문자열)
    const provider = (kakaoUser?.provider as string | undefined) ?? (supaUser ? "supabase" : "kakao");

    const external_id = (kakaoUser?.uid as string | undefined) ?? (kakaoUser?.id as string | undefined) ?? (supaUser?.id as string | undefined) ?? null;

    const email = kakaoUser?.email ?? supaUser?.email ?? null;

    const name = kakaoUser?.name ?? (supaUser?.user_metadata as any)?.name ?? null;

    const avatar_url = kakaoUser?.image ?? (supaUser?.user_metadata as any)?.avatar_url ?? null;

    if (!email) {
      return res.status(400).json({ success: false, error: "이메일 권한 동의가 필요합니다." });
    }

    // 4) 업서트 전략
    // - Supabase Auth 사용자: id를 auth.users.id로 고정(기존 구조 유지), onConflict "id"
    // - Kakao 사용자: profiles.id는 자동 생성(UUID). email 기준으로 통합하고 싶으면 onConflict "email".
    //   (또는 공급자+외부ID 기준으로 고유화하려면 onConflict "provider,external_id"와 unique 인덱스 필요)

    if (supaUser) {
      // Supabase Auth 로그인: 기존대로 id 고정
      const { data, error } = await admin
        .from("profiles")
        .upsert(
          {
            id: supaUser.id, // ← auth.users.id(UUID) 그대로
            email,
            name,
            avatar_url,
            provider: "supabase",
            external_id: supaUser.id,
          },
          { onConflict: "id" }
        )
        .select("id")
        .single();

      if (error) {
        console.error("profiles upsert 실패(supabase):", error);
        return res.status(500).json({ success: false, error: "프로필 저장 실패" });
      }

      return res.status(200).json({ success: true, id: data.id });
    }

    // Kakao(NextAuth) 로그인: id는 자동생성(UUID)
    const { data, error } = await admin
      .from("profiles")
      .upsert(
        {
          email,
          name,
          avatar_url,
          provider, // 'kakao'
          external_id, // '4460962190'
        },
        // 이메일로 통합하고 싶으면:
        { onConflict: "email" }
        // 공급자+외부ID로 고유화하고 싶으면:
        // { onConflict: "provider,external_id" }
      )
      .select("id")
      .single();

    if (error) {
      console.error("profiles upsert 실패(kakao):", error);
      return res.status(500).json({ success: false, error: "프로필 저장 실패" });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error("API 처리 중 오류:", error);
    return res.status(500).json({ success: false, error: "서버 오류가 발생했습니다." });
  }
}
