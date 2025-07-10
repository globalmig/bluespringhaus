import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

// ✅ 반드시 이 이름 그대로 export 해야 함!
export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// ✅ 경로 설정도 문제 없음
export const config = {
  matcher: ["/api/:path*"], // 예: /api/review, /api/anything
};
