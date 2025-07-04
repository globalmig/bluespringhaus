// pages/api/speakers/[id].ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data, error } = await supabase.from("speakers").select("*").eq("id", id).single();

  if (error) {
    console.error("DB 호출 실패:", error.message);
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: "Speaker not found" });
  }

  return res.status(200).json(data);
}
