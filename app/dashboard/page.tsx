"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Head from "next/head";
import { KakaoUserInfo } from "@/types/kakao";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<KakaoUserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      // 실제 구현에서는 서버에서 사용자 정보를 가져오는 API 호출
      // 여기서는 예시로 로컬 스토리지나 쿠키에서 정보를 가져온다고 가정
      const response = await fetch("/api/user/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>대시보드 - 카카오 로그인</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">대시보드</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center space-x-4">
                  {user.kakao_account?.profile?.profile_image_url && <img src={user.kakao_account.profile.profile_image_url} alt="프로필 이미지" className="h-16 w-16 rounded-full object-cover" />}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">안녕하세요, {user.kakao_account?.profile?.nickname || "사용자"}님!</h2>
                    <p className="text-gray-600">카카오 로그인으로 성공적으로 로그인했습니다.</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">사용자 정보</h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">사용자 ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">닉네임</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.kakao_account?.profile?.nickname || "정보 없음"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">이메일</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.kakao_account?.email || "정보 없음"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">연결 시각</dt>
                      <dd className="mt-1 text-sm text-gray-900">{user.connected_at ? new Date(user.connected_at).toLocaleString("ko-KR") : "정보 없음"}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;
