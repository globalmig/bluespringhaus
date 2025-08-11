// /middleware.ts (또는 /src/middleware.ts)
import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // 1) /loginFinal 접근 가드
  if (pathname.startsWith("/loginFinal")) {
    const agreed = req.cookies.get("agreed")?.value === "1";
    if (!agreed) {
      const url = req.nextUrl.clone();
      url.pathname = "/agree";
      url.searchParams.set("next", pathname + search);
      return NextResponse.redirect(url); // <-- 동의 안 했으면 즉시 차단
    }
  }

  // 2) 통과한 경우에만 Supabase 세션 동기화
  return updateSession(req);
}

// 매처는 /loginFinal 뒤에 슬래시/하위 경로도 잡도록 확장
export const config = {
  matcher: ["/api/:path*", "/loginFinal", "/loginFinal/:path*"],
};
