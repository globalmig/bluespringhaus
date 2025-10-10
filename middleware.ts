// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /manager 경로만 보호
  const needsGuard = pathname.startsWith("/manager") || pathname.startsWith("/api/manager");

  if (!needsGuard) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 로그인 안 됨 → 홈으로
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 관리자 아님 → 403 또는 홈으로
  if (!(token as any)?.manager) {
    if (pathname.startsWith("/api/manager")) {
      return new NextResponse(JSON.stringify({ error: "forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manager/:path*", "/api/manager/:path*"],
};
