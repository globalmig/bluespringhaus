export interface Speaker {
  id: number;
  name: string;
  profile_image: string | null;
  short_desc: string;
  tags: string[];
}

export interface Inquiry {
  id: number;
  speaker_id: number;
  message: string;
  created_at: string;
  contact_email: string;
  user_id: string;
  status: "accepted" | "rejected" | null;
  token: string | null;
  speakers: Speaker; // ✅ 여기 추가
}
