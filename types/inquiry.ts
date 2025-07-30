export interface Speaker {
  id: string;
  name: string;
  profile_image: string;
  gallery_images: string[];
  short_desc: string;
  full_desc: string;
  intro_video: string[];
  reviews: string[];
  career: string;
  tags: string[];
  email: string;
  is_recommended: string[];
}

export interface Artists {
  id: string;
  name: string;
  profile_image: string;
  gallery_images?: string[];
  short_desc: string;
  full_desc: string;
  intro_video: string[];
  reviews: string[];
  career: string;
  tags: string[];
  email: string;
  is_recommended: string[];
}

export interface Inquiry {
  id: number;
  speaker_id: number;
  message: string;
  created_at: string;
  contact_email: string;
  user_id: string;
  status: "accepted" | "rejected" | null | "in_progress";
  token: string | null;
  speakers: Speaker;
  reason: string;
  //     host: string;
  //     manager_name: string;
  //     manager_phone: string;
  //     event_title: string;
  //     event_summary: string;
  //     event_date: string;
  //     event_location: string;
  //     audience_type: string;
  //     audience_count: string;
  //     requested_time: string;
  //     offer_fee: string;
  //     additional_notes: string;
}
