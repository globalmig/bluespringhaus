import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { location, category, budget } = req.query;

  // ✅ 아티스트용 categoryMap 추가
  const categoryMap: Record<string, string[]> = {
    indie: ["인디"],
    ballad: ["발라드"],
    hiphop: ["힙합"],
    rnb: ["R&B"],
    trot: ["트로트"],
    rock_band: ["락/밴드"],
    jazz: ["재즈"],
    edm: ["EDM"],
    classical: ["클래식"],
    acoustic: ["어쿠스틱"],
    idol: ["아이돌"],
    dance: ["댄스"],
    broadcaster: ["방송인"],
    mc: ["MC"],
    announcer: ["아나운서"],
    voice_actor: ["성우"],
    youtuber: ["유튜버"],
    tiktoker: ["틱톡커"],
    influencer: ["인플루언서"],
  };

  let query = supabase.from("artists").select("*");

  // ✅ 스피커와 동일한 로직 적용
  if (category && typeof category === "string" && category.trim() !== "") {
    if (categoryMap[category]) {
      const keywords = categoryMap[category];
      const orConditions = keywords.map((keyword) => `tags.cs.{${keyword}}`).join(",");
      query = query.or(orConditions);
    } else {
      // 직접 입력된 태그는 그대로 검색
      query = query.contains("tags", [category]);
    }
  }

  // budget 검색
  if (budget && typeof budget === "string" && budget.trim() !== "") {
    query = query.eq("pay", budget);
  }

  query = query.order("created_at", { ascending: false }).limit(200);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  // location 필터링
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

  const finalData = filteredData.slice(0, 100);

  return res.status(200).json(finalData);
}
