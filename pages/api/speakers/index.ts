import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { location, category, budget } = req.query;

  // ✅ 상위 카테고리를 하위 키워드로 확장
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

  // location이 있으면 name, short_desc, full_desc에 ilike로 검색
  if (location && typeof location === "string") {
    query = query.or(`name.ilike.%${location}%,short_desc.ilike.%${location}%,full_desc.ilike.%${location}%`);
  }

  // ✅ category 검색 로직 수정
  if (category && typeof category === "string") {
    // 상위 카테고리인 경우 하위 항목들로 확장해서 검색
    if (categoryMap[category]) {
      const keywords = categoryMap[category];
      // tags 배열에 키워드 중 하나라도 포함되면 검색
      const orConditions = keywords.map((keyword) => `tags.cs.{${keyword}}`).join(",");
      query = query.or(orConditions);
    } else {
      // 하위 카테고리를 직접 선택한 경우
      query = query.contains("tags", [category]);
    }
  }

  // budget이 있으면 pay 컬럼과 비교
  if (budget && typeof budget === "string") {
    query = query.eq("pay", budget);
  }

  // ✅ 최신순 정렬 + 넉넉한 개수(예: 50개)
  query = query.order("created_at", { ascending: false }).limit(50);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data);
}
