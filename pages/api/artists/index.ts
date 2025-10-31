import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { location, category, budget } = req.query;

  let query = supabase.from("artists").select("*");

  // ✅ location 필터는 JavaScript에서 처리

  // category가 있으면 tags 배열에 category가 포함되는지 검사
  if (category && typeof category === "string" && category.trim() !== "") {
    query = query.contains("tags", [category]);
  }

  // budget이 있으면 pay와 비교
  if (budget && typeof budget === "string" && budget.trim() !== "") {
    query = query.eq("pay", budget);
  }

  query = query.order("created_at", { ascending: false }).limit(200);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  // ✅ location 필터링을 JavaScript에서 처리
  let filteredData = data || [];
  if (location && typeof location === "string" && location.trim() !== "") {
    const locationLower = location.toLowerCase();

    filteredData = filteredData.filter((artist) => {
      const matchesName = artist.name?.toLowerCase().includes(locationLower);
      const matchesShortDesc = artist.short_desc?.toLowerCase().includes(locationLower);
      const matchesFullDesc = artist.full_desc?.toLowerCase().includes(locationLower);
      const matchesTags = artist.tags?.some((tag: string) => tag.toLowerCase().includes(locationLower));

      return matchesName || matchesShortDesc || matchesFullDesc || matchesTags;
    });
  }

  // 최종 결과를 100개로 제한
  const finalData = filteredData.slice(0, 100);

  return res.status(200).json(finalData);
}
