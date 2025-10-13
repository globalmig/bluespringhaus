// pages/api/manager/post.ts (또는 현재 파일 경로 그대로)
import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

async function revalidateManager(res: NextApiResponse) {
  try {
    // 목록 페이지 최신화
    await res.revalidate("/manager");
  } catch (e) {
    console.warn("revalidate('/manager') 실패(무시 가능):", e);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  // POST와 PUT 모두 처리
  if (req.method === "POST" || req.method === "PUT") {
    const {
      type,
      name,
      gallery_images,
      short_desc,
      full_desc,
      intro_video,
      intro_book, // ✅ 추가
      career,
      tags,
      email,
      profile_image,
      is_recommended,
      pay,
      id, // PUT 요청 시 업데이트할 항목의 ID
    } = req.body;

    // 유효성 검사
    if (!type || !["artist", "speaker"].includes(type)) {
      return res.status(400).json({ success: false, error: "유효하지 않은 type 값입니다." });
    }
    if (!name || !email || !short_desc) {
      return res.status(400).json({ success: false, error: "필수 정보가 누락되었습니다." });
    }

    const payload = {
      name,
      gallery_images: Array.isArray(gallery_images) ? gallery_images : [],
      short_desc,
      full_desc,
      pay,
      intro_video:
        typeof intro_video === "string"
          ? intro_video
              .split(",")
              .map((v: string) => v.trim())
              .filter((v: string) => v !== "")
          : Array.isArray(intro_video)
          ? intro_video
          : [],
      intro_book:
        typeof intro_book === "string"
          ? intro_book
              .split(",")
              .map((book: string) => book.trim())
              .filter((b: string) => b !== "")
          : Array.isArray(intro_book)
          ? intro_book
          : [],
      career,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter((t: string) => t !== "")
          : Array.isArray(tags)
          ? tags
          : [],
      email,
      profile_image: typeof profile_image === "string" ? profile_image : "",
      is_recommended:
        typeof is_recommended === "string"
          ? is_recommended
              .split(",")
              .map((v: string) => v.trim())
              .filter((v: string) => v !== "")
          : Array.isArray(is_recommended)
          ? is_recommended
          : [],
    };

    const tableName = type === "speaker" ? "speakers" : "artists";

    // PUT 요청: 업데이트
    if (req.method === "PUT") {
      if (!id) {
        return res.status(400).json({ success: false, error: "업데이트할 항목의 ID가 필요합니다." });
      }

      const { data, error } = await supabase.from(tableName).update(payload).eq("id", id).select();
      if (error) {
        console.error("❌ Supabase 업데이트 에러:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

      await revalidateManager(res); // ✅ 추가
      return res.status(200).json({ success: true, data });
    }

    // POST 요청: 삽입
    const { data, error } = await supabase.from(tableName).insert([payload]).select();
    if (error) {
      console.error("❌ Supabase 삽입 에러:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    await revalidateManager(res); // ✅ 추가
    return res.status(200).json({ success: true, data });
  }

  // GET 요청 처리 (데이터 조회)
  if (req.method === "GET") {
    const { type } = req.query;

    if (!type || !["artist", "speaker"].includes(type as string)) {
      return res.status(400).json({ success: false, error: "유효하지 않은 type 값입니다." });
    }

    // ✅ 즉시 반영 보장: 브라우저/프록시 캐시 비활성화
    res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");

    const tableName = (type === "speaker" ? "speakers" : "artists") as "speakers" | "artists";
    const { data, error } = await supabase.from(tableName).select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase 조회 에러:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  }

  // DELETE 요청 처리
  if (req.method === "DELETE") {
    const { id, type } = req.body;

    if (!id || !type) {
      return res.status(400).json({ success: false, error: "ID와 type이 필요합니다." });
    }

    const tableName = type === "speaker" ? "speakers" : "artists";
    const { error } = await supabase.from(tableName).delete().eq("id", id);

    if (error) {
      console.error("❌ Supabase 삭제 에러:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    await revalidateManager(res); // ✅ 추가
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ success: false, error: "허용되지 않은 요청 방식입니다." });
}
