// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // NextAuth/정적 리소스 패스는 통과
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

  // 보호 구간: /mypage
  if (pathname.startsWith("/mypage")) {
    try {
      const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      });

      if (!token) {
        const url = new URL("/", req.url);
        url.searchParams.set("need_login", "1");
        return NextResponse.redirect(url);
      }

      // ✅ 여기서는 더 이상 profile 검사하지 않음 (Edge에서 DB 접근 불가)
    } catch (error) {
      const url = new URL("/", req.url);
      url.searchParams.set("error", "auth_error");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|icon.png|images|assets).*)"],
};
