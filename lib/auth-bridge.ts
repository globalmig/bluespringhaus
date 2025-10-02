// lib/auth-bridge.ts (server-only)
import { getServerSession } from "next-auth/next"; // ← next-auth/next 권장
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function getInternalUserId(req: any, res: any) {
  const session = await getServerSession(req, res, authOptions);
  const email = session?.user?.email;
  if (!email) return null;

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
  const { data: profile } = await admin.from("profiles").select("id").eq("email", email).maybeSingle();

  return profile?.id ?? null;
}
