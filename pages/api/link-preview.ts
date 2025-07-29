import { getLinkPreview } from "link-preview-js";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "url이 필요합니다." });
  }

  try {
    const data = await getLinkPreview(url);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "미리보기 생성 실패" });
  }
}
