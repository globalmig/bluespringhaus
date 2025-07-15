import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  if (req.method === "POST") {
    const { type, name, gallery_images, short_desc, full_desc, intro_video, career, tags, email, profile_image, is_recommended } = req.body;

    if (!type || !["artist", "speaker"].includes(type)) {
      return res.status(400).json({ success: false, error: "유효하지 않은 type 값입니다." });
    }

    if (!name || !email || !short_desc) {
      return res.status(400).json({ success: false, error: "필수 정보가 누락되었습니다." });
    }

    const payload = {
      name,
      gallery_images,
      short_desc,
      full_desc,
      intro_video,
      career,
      tags,
      email,
      profile_image,
      is_recommended,
    };

    const tableName = type === "speaker" ? "speakers" : "artists";

    const { data, error } = await supabase.from(tableName).insert([payload]);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, data });
  }

  return res.status(405).json({ success: false, error: "허용되지 않은 요청 방식입니다." });
}
