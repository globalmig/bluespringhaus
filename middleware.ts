// /middleware.ts (또는 /src/middleware.ts)
import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname, searchParams } = url;

  // ✅ 0) Supabase 매직링크/복구 코드가 붙은 요청은 무조건 통과
  //    (/auth/reset?code=...&type=recovery 같은 케이스)
  if (pathname.startsWith("/auth/reset") || searchParams.has("code")) {
    return NextResponse.next();
  }

  // ✅ 1) /loginFinal 접근 가드
  if (pathname.startsWith("/loginFinal")) {
    const agreed = req.cookies.get("agreed")?.value === "1";
    if (!agreed) {
      const to = url.clone();
      to.pathname = "/agree";
      to.searchParams.set("next", pathname + (url.search || ""));
      return NextResponse.redirect(to);
    }
  }

  // ✅ 2) 나머지는 세션 동기화만 수행하고 통과
  return updateSession(req);
}

// ✅ /auth/reset 도 미들웨어가 보도록 매처 확장
//    (정적 리소스는 제외)
export const config = {
  matcher: [
    "/api/:path*",
    "/loginFinal",
    "/loginFinal/:path*",
    "/auth/reset", // ← 추가
    "/((?!_next/static|_next/image|favicon.ico).*)", // 선택: 전역 적용 시
  ],
};
