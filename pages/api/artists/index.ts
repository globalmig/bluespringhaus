import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { location, category, budget, page = "1", pageSize = "20" } = req.query;

  // ✅ page, pageSize 숫자로 변환 (string | string[] 모두 대응)
  const currentPage = Array.isArray(page) ? parseInt(page[0] || "1", 10) : parseInt(page as string, 10) || 1;

  const perPage = Array.isArray(pageSize) ? parseInt(pageSize[0] || "20", 10) : parseInt(pageSize as string, 10) || 20;

  // ✅ 아티스트용 categoryMap
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

  // ✅ category 필터
  if (category && typeof category === "string" && category.trim() !== "") {
    if (categoryMap[category]) {
      const keywords = categoryMap[category];
      const orConditions = keywords.map((keyword) => `tags.cs.{${keyword}}`).join(",");
      query = query.or(orConditions);
    } else {
      // 직접 입력된 태그
      query = query.contains("tags", [category]);
    }
  }

  // ✅ budget 필터
  if (budget && typeof budget === "string" && budget.trim() !== "") {
    query = query.eq("pay", budget);
  }

  // DB에서 가져오는 상한 (너무 크지 않게)
  query = query.order("created_at", { ascending: false }).limit(200);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  // ✅ location 필터 (JS에서 처리)
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

  // ✅ 페이지네이션 (무한 스크롤용)
  const total = filteredData.length;
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  const items = filteredData.slice(start, end);
  const hasMore = end < total;

  return res.status(200).json({
    items, // 현재 페이지 데이터
    hasMore, // 다음 페이지 존재 여부
    total, // 필터 후 전체 개수
    page: currentPage,
    pageSize: perPage,
  });
}

// import { NextApiRequest, NextApiResponse } from "next";
// import { supabase } from "@/lib/supabase";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { location, category, budget } = req.query;

//   // ✅ 아티스트용 categoryMap 추가
//   const categoryMap: Record<string, string[]> = {
//     indie: ["인디"],
//     ballad: ["발라드"],
//     hiphop: ["힙합"],
//     rnb: ["R&B"],
//     trot: ["트로트"],
//     rock_band: ["락/밴드"],
//     jazz: ["재즈"],
//     edm: ["EDM"],
//     classical: ["클래식"],
//     acoustic: ["어쿠스틱"],
//     idol: ["아이돌"],
//     dance: ["댄스"],
//     broadcaster: ["방송인"],
//     mc: ["MC"],
//     announcer: ["아나운서"],
//     voice_actor: ["성우"],
//     youtuber: ["유튜버"],
//     tiktoker: ["틱톡커"],
//     influencer: ["인플루언서"],
//   };

//   let query = supabase.from("artists").select("*");

//   // ✅ 스피커와 동일한 로직 적용
//   if (category && typeof category === "string" && category.trim() !== "") {
//     if (categoryMap[category]) {
//       const keywords = categoryMap[category];
//       const orConditions = keywords.map((keyword) => `tags.cs.{${keyword}}`).join(",");
//       query = query.or(orConditions);
//     } else {
//       // 직접 입력된 태그는 그대로 검색
//       query = query.contains("tags", [category]);
//     }
//   }

//   // budget 검색
//   if (budget && typeof budget === "string" && budget.trim() !== "") {
//     query = query.eq("pay", budget);
//   }

//   query = query.order("created_at", { ascending: false }).limit(200);

//   const { data, error } = await query;

//   if (error) return res.status(500).json({ error: error.message });

//   // location 필터링
//   let filteredData = data || [];
//   if (location && typeof location === "string" && location.trim() !== "") {
//     const locationLower = location.toLowerCase();

//     filteredData = filteredData.filter((artist) => {
//       const matchesName = artist.name?.toLowerCase().includes(locationLower);
//       const matchesShortDesc = artist.short_desc?.toLowerCase().includes(locationLower);
//       const matchesFullDesc = artist.full_desc?.toLowerCase().includes(locationLower);
//       const matchesTags = artist.tags?.some((tag: string) => tag.toLowerCase().includes(locationLower));

//       return matchesName || matchesShortDesc || matchesFullDesc || matchesTags;
//     });
//   }

//   const finalData = filteredData.slice(0, 100);

//   return res.status(200).json(finalData);
// }
