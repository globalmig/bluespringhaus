import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { location, category, budget } = req.query;

  const categoryMap: Record<string, string[]> = {
    economy: ["경제", "투자", "주식", "창업", "기업가정신", "협상", "재테크"],
    humanities: ["인문학", "철학", "심리학", "문학", "과학", "역사", "종교"],
    business: ["경영전략", "리더십", "퍼스널 브랜딩", "마케팅", "조직문화", "브랜딩", "팀워크"],
    trend: ["테크트렌드", "소비트렌드", "MZ세대", "인공지능", "4차 산업"],
    mindset: ["동기부여", "루틴", "성장", "시간관리", "목표", "행복"],
    wellbeing: ["명상", "마음챙김", "정신건강", "라이프 코칭", "건강"],
    culture: ["예술", "젠더", "교육", "정치", "사회문제"],
    global: ["국제정세", "해외 시장 진출", "해외 취업"],
  };

  let query = supabase.from("speakers").select("*");

  // ✅ location 필터는 Supabase 단계에서 제거 (JavaScript에서 처리)

  // category 검색
  if (category && typeof category === "string" && category.trim() !== "") {
    if (categoryMap[category]) {
      const keywords = categoryMap[category];
      const orConditions = keywords.map((keyword) => `tags.cs.{${keyword}}`).join(",");
      query = query.or(orConditions);
    } else {
      query = query.contains("tags", [category]);
    }
  }

  // budget 검색
  if (budget && typeof budget === "string" && budget.trim() !== "") {
    query = query.eq("pay", budget);
  }

  query = query.order("created_at", { ascending: false }).limit(200); // ✅ limit 늘림

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  // ✅ location 필터링을 JavaScript에서 처리
  let filteredData = data || [];
  if (location && typeof location === "string" && location.trim() !== "") {
    const locationLower = location.toLowerCase();

    filteredData = filteredData.filter((speaker) => {
      const matchesName = speaker.name?.toLowerCase().includes(locationLower);
      const matchesShortDesc = speaker.short_desc?.toLowerCase().includes(locationLower);
      const matchesFullDesc = speaker.full_desc?.toLowerCase().includes(locationLower);
      const matchesTags = speaker.tags?.some((tag: string) => tag.toLowerCase().includes(locationLower));

      return matchesName || matchesShortDesc || matchesFullDesc || matchesTags;
    });
  }

  // 최종 결과를 50개로 제한
  const finalData = filteredData.slice(0, 50);

  return res.status(200).json(finalData);
}
