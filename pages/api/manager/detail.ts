import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, type } = req.query;

  if (!id || !type) {
    return res.status(400).json({ error: "id와 type은 필수입니다." });
  }

  const table = type === "speaker" ? "speakers" : "artists";

  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(data);
}
