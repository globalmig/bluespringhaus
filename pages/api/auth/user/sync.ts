import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { authOptions } from "../auth/[...nextauth]"; // export 해두세요

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: "unauthorized" });

  const provider = "kakao";
  const provider_user_id = String((session.user as any).id || ""); // session.user.id에 kakao id 넣어둠
  if (!provider_user_id) return res.status(400).json({ error: "missing id" });

  const id = `${provider}:${provider_user_id}`;
  const name = session.user.name || null;
  const email = session.user.email || null;
  const avatar_url = session.user.image || null;

  const { error } = await supabaseAdmin.from("app_users").upsert({ id, provider, provider_user_id, email, name, avatar_url, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true });
}
