// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname, searchParams } = url;

  // ✅ 인증 콜백은 무조건 통과 (code 파라미터가 있는 경우)
  if (searchParams.has("code") || pathname.startsWith("/auth") || searchParams.get("type") === "recovery" || searchParams.get("type") === "magiclink") {
    return NextResponse.next();
  }

  // ✅ 정적 파일들 통과
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/favicon") || pathname.startsWith("/images") || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  // 나머지 경로는 세션 체크
  return updateSession(req);
}
