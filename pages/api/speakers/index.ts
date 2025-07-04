// pages/api/speakers/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { data, error } = await supabase.from("speakers").select("*").range(0, 9);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}
