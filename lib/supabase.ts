// api/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // 브라우저에 세션 자동 저장
    autoRefreshToken: true, // 토큰 자동 갱신
    detectSessionInUrl: true, // URL에서 세션 자동 감지
  },
});

// 세션 캐시 관리
class SessionCache {
  private cache: any = null;
  private cacheTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5분

  async getSession() {
    const now = Date.now();

    // 캐시가 유효한 경우 캐시 반환
    if (this.cache && now - this.cacheTime < this.CACHE_DURATION) {
      return this.cache;
    }

    // 새로운 세션 가져오기
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (!error && session) {
      this.cache = session;
      this.cacheTime = now;
    }

    return session;
  }

  clearCache() {
    this.cache = null;
    this.cacheTime = 0;
  }

  // 세션 상태 변경 시 캐시 업데이트
  init() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        this.clearCache();
      } else if (session) {
        this.cache = session;
        this.cacheTime = Date.now();
      }
    });
  }
}

export const sessionCache = new SessionCache();
sessionCache.init(); // 초기화
