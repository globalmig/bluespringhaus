import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  if (req.method === "POST") {
    const { type, name, gallery_images, short_desc, full_desc, intro_video, career, tags, email, profile_image, is_recommended, pay } = req.body;

    console.log("👉 받은 데이터:", req.body);

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
      intro_video: typeof intro_video === "string" ? intro_video.split(",").map((v: string) => v.trim()) : Array.isArray(intro_video) ? intro_video : [],
      career,
      tags: typeof tags === "string" ? tags.split(",").map((tag: string) => tag.trim()) : Array.isArray(tags) ? tags : [],
      email,
      profile_image: typeof profile_image === "string" ? profile_image : "",
      is_recommended: typeof is_recommended === "string" ? is_recommended.split(",").map((v: string) => v.trim()) : Array.isArray(is_recommended) ? is_recommended : [],
    };

    console.log("👉 최종 payload:", payload);

    const tableName = type === "speaker" ? "speakers" : "artists";

    const { data, error } = await supabase.from(tableName).insert([payload]);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  }

  return res.status(405).json({ success: false, error: "허용되지 않은 요청 방식입니다." });
}
