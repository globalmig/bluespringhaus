import { NextApiRequest, NextApiResponse } from "next";
import { KakaoTokenResponse, KakaoUserInfo, KakaoError } from "../../../../types/kakao";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { code, error, error_description, state } = req.query;

  // 에러 체크
  if (error) {
    console.error("카카오 로그인 에러:", error_description);
    return res.redirect(`/login?error=${encodeURIComponent(error_description as string)}`);
  }

  // state 검증 (실제 구현에서는 더 엄격한 검증 필요)
  // const storedState = req.cookies.kakao_state;
  // if (state !== storedState) {
  //   return res.redirect('/login?error=invalid_state');
  // }

  try {
    // 1. 토큰 요청
    const tokenResponse = await getKakaoToken(code as string);

    // 2. 사용자 정보 조회
    const userInfo = await getKakaoUserInfo(tokenResponse.access_token);

    // 3. 사용자 정보로 로그인 처리
    // 실제 구현에서는 데이터베이스에 사용자 정보 저장/업데이트
    const loginResult = await processUserLogin(userInfo, tokenResponse);

    // 4. 세션 설정 또는 JWT 토큰 생성
    res.setHeader("Set-Cookie", [
      `access_token=${tokenResponse.access_token}; HttpOnly; Path=/; Max-Age=${tokenResponse.expires_in}`,
      `refresh_token=${tokenResponse.refresh_token}; HttpOnly; Path=/; Max-Age=${tokenResponse.refresh_token_expires_in}`,
      `user_id=${userInfo.id}; HttpOnly; Path=/; Max-Age=${tokenResponse.expires_in}`,
    ]);

    res.redirect("/");
  } catch (error) {
    console.error("카카오 로그인 처리 중 오류:", error);
    res.redirect("/login?error=login_failed");
  }
}

async function getKakaoToken(code: string): Promise<KakaoTokenResponse> {
  const tokenURL = "https://kauth.kakao.com/oauth/token";

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", process.env.KAKAO_REST_API_KEY!);
  params.append("redirect_uri", process.env.KAKAO_REDIRECT_URI!);
  params.append("code", code);

  if (process.env.KAKAO_CLIENT_SECRET) {
    params.append("client_secret", process.env.KAKAO_CLIENT_SECRET);
  }

  const response = await fetch(tokenURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`토큰 요청 실패: ${response.status}`);
  }

  return response.json();
}

async function getKakaoUserInfo(accessToken: string): Promise<KakaoUserInfo> {
  const response = await fetch("https://kapi.kakao.com/v2/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`사용자 정보 조회 실패: ${response.status}`);
  }

  return response.json();
}

async function processUserLogin(userInfo: KakaoUserInfo, tokenInfo: KakaoTokenResponse) {
  // 실제 구현에서는 데이터베이스 처리
  // 예: 사용자가 존재하지 않으면 새로 생성, 존재하면 정보 업데이트

  const user = {
    id: userInfo.id,
    email: userInfo.kakao_account?.email,
    nickname: userInfo.kakao_account?.profile?.nickname,
    profile_image: userInfo.kakao_account?.profile?.profile_image_url,
    provider: "kakao",
    access_token: tokenInfo.access_token,
    refresh_token: tokenInfo.refresh_token,
  };

  console.log("로그인 사용자:", user);
  return user;
}
