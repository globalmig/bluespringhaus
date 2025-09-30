// lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 서비스 롤 키 (절대 클라이언트에 쓰지 않기)
);
