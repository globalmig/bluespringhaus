import { ReactNode } from "react";

export interface Reviews {
  reviewer_name: ReactNode;
  user_id: string;
  comment: string;
  rating: number;
  created_at: string;
  id: number;
  name: string;
  profile_image: string[];
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
