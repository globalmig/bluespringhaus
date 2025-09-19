import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { location, category, budget } = req.query;

  let query = supabase.from("artists").select("*");

  // location이 있으면 name, short_desc, full_desc에 ilike로 검색
  if (location && typeof location === "string") {
    query = query.or(`name.ilike.%${location}%,short_desc.ilike.%${location}%,full_desc.ilike.%${location}%`);
  }

  // category가 있으면 tags 배열에 category가 포함되는지 검사
  if (category && typeof category === "string") {
    query = query.contains("tags", [category]);
  }

  // budget이 있으면 pay와 비교
  if (budget && typeof budget === "string") {
    query = query.eq("pay", budget);
  }

  // ✅ 최신순 정렬 + 넉넉한 개수 (예: 100개)
  query = query.order("created_at", { ascending: false }).limit(100);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}
