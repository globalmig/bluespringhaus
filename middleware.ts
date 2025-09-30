// // middleware.ts
// import { NextResponse, NextRequest } from "next/server";
// import { updateSession } from "@/lib/supabase/middleware";

// export default async function middleware(req: NextRequest) {
//   const url = req.nextUrl;
//   const { pathname, searchParams } = url;

//   // ✅ 인증 콜백은 무조건 통과 (code 파라미터가 있는 경우)
//   if (searchParams.has("code") || pathname.startsWith("/auth") || searchParams.get("type") === "recovery" || searchParams.get("type") === "magiclink") {
//     return NextResponse.next();
//   }

//   // ✅ 정적 파일들 통과
//   if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/favicon") || pathname.startsWith("/images") || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
//     return NextResponse.next();
//   }

//   // 나머지 경로는 세션 체크
//   return updateSession(req);
// }

// middleware.ts (루트)
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ NextAuth 내부 라우트/정적/아이콘 등은 항상 통과
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/icon.png"
  ) {
    return NextResponse.next();
  }

  // ✅ 보호할 경로만 토큰 검사 (예: /mypage)
  if (pathname.startsWith("/mypage")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = new URL("/", req.url);
      url.searchParams.set("need_login", "1");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/auth|favicon|images|robots\\.txt|sitemap\\.xml|icon\\.png).*)"],
};
