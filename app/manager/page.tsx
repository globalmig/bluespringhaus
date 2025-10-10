"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Search, Plus, Edit, Trash2, User, Music, Loader2 } from "lucide-react";
import type { Speaker, Artists } from "@/types/inquiry";

// 통합 타입 정의
interface CombinedItem extends Partial<Speaker & Artists> {
  type: "speaker" | "artist";
}

export default function Manager() {
  const normalizeImageSrc = (src?: string) => {
    if (!src) return "/default.jpg";
    // 절대 URL 또는 루트(/) 경로면 허용
    if (/^(https?:\/\/|\/)/.test(src)) return src;

    // 파일명만 저장돼 오는 경우(예: 'test.png')라면 public 하위 경로로 매핑
    // 실제 파일 위치에 맞춰 '/uploads' 등으로 바꿔주세요.
    return `/uploads/${src}`;
  };

  // 인증 관련 상태
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 데이터 상태
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [artists, setArtists] = useState<Artists[]>([]);

  // UI 상태
  const [loadingSpeakers, setLoadingSpeakers] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "speaker" | "artist">("all");

  // 통합 리스트 생성
  const combinedList = useMemo(() => {
    const speakersWithType: CombinedItem[] = speakers.map((item) => ({
      ...item,
      type: "speaker" as const,
    }));
    const artistsWithType: CombinedItem[] = artists.map((item) => ({
      ...item,
      type: "artist" as const,
    }));
    return [...speakersWithType, ...artistsWithType];
  }, [speakers, artists]);

  // 필터링된 리스트
  const filteredList = useMemo(() => {
    let filtered = combinedList;

    // 타입 필터
    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter((item) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || item.short_desc?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    return filtered;
  }, [combinedList, searchTerm, filterType]);

  // 데이터 로딩 상태
  const isLoading = loadingSpeakers || loadingArtists;

  // 데이터 페칭
  useEffect(() => {
    fetchSpeakers();
    fetchArtists();
  }, []);

  const fetchSpeakers = async () => {
    try {
      setLoadingSpeakers(true);
      const res = await axios.get<Speaker[]>("/api/speakers");
      setSpeakers(res.data);
    } catch (error) {
      console.error("연사 데이터 로드 실패:", error);
    } finally {
      setLoadingSpeakers(false);
    }
  };

  const fetchArtists = async () => {
    try {
      setLoadingArtists(true);
      const res = await axios.get<Artists[]>("/api/artists");
      setArtists(res.data);
    } catch (error) {
      console.error("아티스트 데이터 로드 실패:", error);
    } finally {
      setLoadingArtists(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthorized(true);
      } else {
        alert("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error("인증 오류:", error);
      alert("인증 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (item: CombinedItem) => {
    const confirmed = confirm(`'${item.name}'을(를) 정말 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const res = await axios.delete(`/api/manager/delete?id=${item.id}&type=${item.type}`);

      if (res.status === 200) {
        // 상태 업데이트
        if (item.type === "speaker") {
          setSpeakers((prev) => prev.filter((s) => s.id !== item.id));
        } else {
          setArtists((prev) => prev.filter((a) => a.id !== item.id));
        }
        alert("삭제가 완료되었습니다.");
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  // 인증되지 않은 경우
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">관리자 로그인</h2>
            <p className="text-lg text-gray-600 mb-8">관리자님 안녕하세요 :)</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
            <button type="submit" className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-1">연사 및 아티스트 관리</p>
            </div>

            <Link href="/manager/write" className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
              <Plus className="w-4 h-4 mr-2" />
              새로 등록
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="이름 또는 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 타입 필터 */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">전체</option>
              <option value="speaker">연사</option>
              <option value="artist">아티스트</option>
            </select>
          </div>

          {/* 통계 */}
          <div className="flex gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-1" />
              연사: {speakers.length}명
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Music className="w-4 h-4 mr-1" />
              아티스트: {artists.length}명
            </div>
            <div className="text-sm text-gray-600">총 {combinedList.length}명</div>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>데이터를 불러오는 중...</span>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">데이터가 없습니다.</p>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-blue-600 hover:text-blue-800 mt-2">
                  검색 초기화
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">프로필</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">정보</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">타입</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredList.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                      {/* 프로필 이미지 */}
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={normalizeImageSrc(item.profile_image)}
                            alt={item.name || "프로필"}
                            fill
                            sizes="64px" // (선택) 64×64 컨테이너에 맞는 사이즈 힌트
                            className="object-cover"
                          />
                        </div>
                      </td>

                      {/* 정보 */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.short_desc && <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">{item.short_desc}</div>}
                          {item.email && <div className="text-sm text-gray-400 mt-1">{item.email}</div>}
                        </div>
                      </td>

                      {/* 타입 */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.type === "speaker" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {item.type === "speaker" ? <User className="w-3 h-3 mr-1" /> : <Music className="w-3 h-3 mr-1" />}
                          {item.type === "speaker" ? "연사" : "아티스트"}
                        </span>
                      </td>

                      {/* 관리 버튼 */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={{
                              pathname: `/manager/edit/${item.id}`,
                              query: { type: item.type },
                            }}
                            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            수정
                          </Link>

                          <button onClick={() => handleDelete(item)} className="inline-flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">
                            <Trash2 className="w-3 h-3 mr-1" />
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 결과 수 표시 */}
        {!isLoading && filteredList.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            {searchTerm || filterType !== "all" ? `${filteredList.length}개의 결과 (전체 ${combinedList.length}개 중)` : `총 ${combinedList.length}개의 항목`}
          </div>
        )}
      </main>
    </div>
  );
}
