// Pages Router용: /pages/api/manager/delete.ts
import { supabase } from "@/lib/supabase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log("삭제 API 호출됨:", req.method, req.query);

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "DELETE 메서드만 허용됩니다." });
  }

  const { id, type } = req.query;

  if (!id || !type) {
    return res.status(400).json({ error: "id와 type은 필수입니다." });
  }

  if (type !== "speaker" && type !== "artist") {
    return res.status(400).json({ error: "type은 'speaker' 또는 'artist'여야 합니다." });
  }

  try {
    const table = type === "speaker" ? "speakers" : "artists";

    // console.log(`${table} 테이블에서 ID ${id} 삭제 시도`);

    // 삭제 실행
    const { data, error } = await supabase.from(table).delete().eq("id", id).select(); // 삭제된 데이터 반환

    if (error) {
      console.error("삭제 오류:", error);
      return res.status(500).json({ error: error.message });
    }

    // console.log("삭제 성공:", data);

    return res.status(200).json({
      success: true,
      message: "삭제 완료",
      deletedData: data,
    });
  } catch (error) {
    console.error("예상치 못한 오류:", error);
    return res.status(500).json({ error: "서버 오류" });
  }
}
