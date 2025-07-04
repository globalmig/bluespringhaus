import { supabase } from "@/lib/supabase";
import crypto from "crypto";

const inquiryId = 123; // 문의를 insert 한 후 반환받은 id
const token = crypto
  .createHmac("sha256", process.env.SECRET_KEY!)
  .update(`${inquiryId}-${Date.now()}`) // 고유한 요소를 넣으면 재사용 방지
  .digest("hex");

// inquiries 테이블에 문의 레코드 + token 컬럼에 토큰 저장
await supabase.from("inquiries").update({ token }).eq("id", inquiryId);
