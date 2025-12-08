// app/manager/page.tsx
"use client";

import React, { Suspense, useEffect, useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Plus, Edit, Trash2, User, Music, Loader2 } from "lucide-react";
import type { Speaker, Artists } from "@/types/inquiry";

interface CombinedItem extends Partial<Speaker & Artists> {
  type: "speaker" | "artist";
}

type PagedResponse<T> = {
  items: T[];
  hasMore: boolean;
  total: number;
  page: number;
  pageSize: number;
};

function ManagerInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ts = searchParams?.get("ts");

  const normalizeImageSrc = (src?: string) => {
    if (!src) return "/default.jpg";
    if (/^(https?:\/\/|\/)/.test(src)) return src;
    return `/uploads/${src}`;
  };

  // 데이터 상태
  const [allSpeakers, setAllSpeakers] = useState<Speaker[]>([]);
  const [allArtists, setAllArtists] = useState<Artists[]>([]);

  // 표시할 데이터 개수
  const [displayCount, setDisplayCount] = useState(50);
  const LOAD_MORE_COUNT = 50;

  // UI 상태
  const [loadingSpeakers, setLoadingSpeakers] = useState(true);
  const [loadingArtists, setLoadingArtists] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "speaker" | "artist">("all");

  // 무한 스크롤을 위한 ref
  const observerTarget = useRef<HTMLDivElement>(null);

  // 세션 체크
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (!(session.user as any).manager) {
      alert("관리자 권한이 필요합니다.");
      router.push("/");
    }
  }, [session, status, router]);

  // 통합 리스트 생성
  const combinedList = useMemo(() => {
    const speakersWithType: CombinedItem[] = allSpeakers.map((item) => ({
      ...item,
      type: "speaker" as const,
    }));
    const artistsWithType: CombinedItem[] = allArtists.map((item) => ({
      ...item,
      type: "artist" as const,
    }));
    return [...speakersWithType, ...artistsWithType];
  }, [allSpeakers, allArtists]);

  // 필터링된 리스트
  const filteredList = useMemo(() => {
    let filtered = combinedList;

    if (filterType !== "all") {
      filtered = filtered.filter((item) => item.type === filterType);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => item.name?.toLowerCase().includes(q) || item.short_desc?.toLowerCase().includes(q));
    }

    return filtered;
  }, [combinedList, searchTerm, filterType]);

  // 실제 화면에 표시할 리스트 (점진적 로딩)
  const displayedList = useMemo(() => {
    return filteredList.slice(0, displayCount);
  }, [filteredList, displayCount]);

  const hasMore = displayedList.length < filteredList.length;
  const isLoading = loadingSpeakers || loadingArtists;

  // 데이터 페칭
  useEffect(() => {
    if (session && (session.user as any).manager) {
      fetchSpeakers();
      fetchArtists();
    }
  }, [session, ts]);
  const fetchSpeakers = async () => {
    try {
      setLoadingSpeakers(true);
      const res = await axios.get<PagedResponse<Speaker>>("/api/speakers", {
        params: {
          _t: Date.now(),
          page: 1,
          pageSize: 200, // 한 번에 200개까지 가져오기
        },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      // ✅ 배열이 아니라 res.data.items 사용
      setAllSpeakers(res.data.items);
    } catch (error) {
      console.error("연사 데이터 로드 실패:", error);
    } finally {
      setLoadingSpeakers(false);
    }
  };

  const fetchArtists = async () => {
    try {
      setLoadingArtists(true);
      const res = await axios.get<PagedResponse<Artists>>("/api/artists", {
        params: {
          _t: Date.now(),
          page: 1,
          pageSize: 200, // 한 번에 200개까지 가져오기
        },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      // ✅ 배열이 아니라 res.data.items 사용
      setAllArtists(res.data.items);
    } catch (error) {
      console.error("아티스트 데이터 로드 실패:", error);
    } finally {
      setLoadingArtists(false);
    }
  };

  // 더 불러오기 함수
  const loadMore = useCallback(() => {
    if (!hasMore) return;
    setDisplayCount((prev) => prev + LOAD_MORE_COUNT);
  }, [hasMore]);

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, loadMore]);

  // 검색/필터 변경 시 displayCount 초기화
  useEffect(() => {
    setDisplayCount(50);
  }, [searchTerm, filterType]);

  const handleDelete = async (item: CombinedItem) => {
    const confirmed = confirm(`'${item.name}'을(를) 정말 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      const res = await axios.delete(`/api/manager/delete?id=${item.id}&type=${item.type}`);

      if (res.status === 200) {
        if (item.type === "speaker") {
          setAllSpeakers((prev) => prev.filter((s) => s.id !== item.id));
        } else {
          setAllArtists((prev) => prev.filter((a) => a.id !== item.id));
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session || !(session.user as any).manager) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-1">연사 및 아티스트 관리</p>
            </div>
            <div className="flex gap-4">
              <Link href="/manager/write" className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                <Plus className="w-4 h-4 mr-2" />
                새로 등록
              </Link>
              <Link href="/manager/list" className="inline-flex items-center px-4 py-2 text-black hover:text-white border-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                진행 리스트
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
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

          <div className="flex gap-6 mt-4 pt-4 border-t">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-1" />
              연사: {allSpeakers.length}명
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Music className="w-4 h-4 mr-1" />
              아티스트: {allArtists.length}명
            </div>
            <div className="text-sm text-gray-600">총 {combinedList.length}명</div>
          </div>
        </div>

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
                  {displayedList.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200">
                          <Image src={normalizeImageSrc(item.profile_image)} alt={item.name || "프로필"} fill sizes="64px" className="object-cover" />
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.short_desc && <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">{item.short_desc}</div>}
                          {item.email && <div className="text-sm text-gray-400 mt-1">{item.email}</div>}
                        </div>
                      </td>

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

              {/* 무한 스크롤 트리거 영역 */}
              {hasMore && (
                <div ref={observerTarget} className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-gray-500">더 불러오는 중...</span>
                </div>
              )}

              {/* 모두 로드 완료 메시지 */}
              {!hasMore && displayedList.length > 0 && <div className="text-center py-6 text-sm text-gray-500">모든 데이터를 불러왔습니다 ({filteredList.length}개)</div>}
            </div>
          )}
        </div>

        {!isLoading && filteredList.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            {searchTerm || filterType !== "all" ? `${displayedList.length}개 표시 중 (총 ${filteredList.length}개)` : `${displayedList.length}개 표시 중 (총 ${combinedList.length}개)`}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ManagerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ManagerInner />
    </Suspense>
  );
}
