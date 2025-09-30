export interface KakaoTokenResponse {
  token_type: string;
  access_token: string;
  id_token?: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
}

export interface KakaoProfile {
  nickname: string;
  thumbnail_image_url?: string;
  profile_image_url?: string;
  is_default_image?: boolean;
  is_default_nickname?: boolean;
}

export interface KakaoAccount {
  profile_needs_agreement?: boolean;
  profile_nickname_needs_agreement?: boolean;
  profile_image_needs_agreement?: boolean;
  profile?: KakaoProfile;
  name_needs_agreement?: boolean;
  name?: string;
  email_needs_agreement?: boolean;
  is_email_valid?: boolean;
  is_email_verified?: boolean;
  email?: string;
  age_range_needs_agreement?: boolean;
  age_range?: string;
  birthday_needs_agreement?: boolean;
  birthday?: string;
  birthday_type?: string;
  gender_needs_agreement?: boolean;
  gender?: string;
}

export interface KakaoUserInfo {
  id: number;
  connected_at?: string;
  kakao_account?: KakaoAccount;
  properties?: Record<string, any>;
}

export interface KakaoError {
  error: string;
  error_description: string;
  error_code?: string;
}
