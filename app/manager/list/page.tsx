"use client";
import React, { useEffect, useState, useMemo } from "react";
import type { Inquiry, Speaker, Artists } from "@/types/inquiry";
import axios from "axios";
import Link from "next/link";

type InquiryWithType = Inquiry & {
  type: "speaker" | "artist";
  artists?: Artists[] | Artists;
  speakers?: Speaker[] | Speaker;
  profiles?: { email: string; name: string };
};

export default function AdminMypage() {
  const [inquiries, setInquiries] = useState<InquiryWithType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "speaker" | "artist">("all");

  useEffect(() => {
    const fetchAllInquiries = async () => {
      try {
        const res = await axios.get("/api/inquiry/admin");
        const all: InquiryWithType[] = [
          ...(res.data.inquiries || []).map((i: any) => ({
            ...i,
            type: "speaker" as const,
          })),
          ...(res.data.artistInquiries || []).map((i: any) => ({
            ...i,
            type: "artist" as const,
          })),
        ];
        setInquiries(all);
      } catch (error) {
        console.error("❌ API 호출 에러:", error);
        alert("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllInquiries();
  }, []);

  // 헬퍼 함수들 (useMemo보다 먼저 선언)
  const getProfileName = (inq: InquiryWithType): string => {
    const data = inq.type === "artist" ? inq.artists : inq.speakers;
    if (Array.isArray(data)) return data.map((d) => d.name).join(", ");
    if (data) return data.name;
    return "-";
  };

  const getProfileImage = (inq: InquiryWithType): string => {
    const data = inq.type === "artist" ? inq.artists : inq.speakers;
    if (Array.isArray(data) && data.length > 0) return data[0].profile_image;
    if (data && !Array.isArray(data)) return data.profile_image;
    return "/placeholder.png";
  };

  // 필터링 로직
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      // 상태 필터
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "pending" && (inq.status === null || inq.status === "in_progress")) ||
        (statusFilter === "accepted" && inq.status === "accepted") ||
        (statusFilter === "rejected" && inq.status === "rejected");

      // 타입 필터
      const typeMatch = typeFilter === "all" || inq.type === typeFilter;

      // 검색어 필터 (이름, 이메일, 회사명, 연락처 등)
      const searchMatch =
        searchTerm === "" ||
        inq.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.manager_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.manager_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getProfileName(inq)?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && typeMatch && searchMatch;
    });
  }, [inquiries, searchTerm, statusFilter, typeFilter]);

  const getStatusBadge = (status: string | null) => {
    if (status === "accepted") {
      return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">✓ 성공</span>;
    } else if (status === "rejected") {
      return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">✗ 거절</span>;
    } else {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">⏳ 진행중</span>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "speaker" ? (
      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">SPEAKER</span>
    ) : (
      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">ARTIST</span>
    );
  };

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === null || i.status === "in_progress").length,
    accepted: inquiries.filter((i) => i.status === "accepted").length,
    rejected: inquiries.filter((i) => i.status === "rejected").length,
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto min-h-screen flex justify-center items-start pt-20">
        <p>전체 문의 내역을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mt-10 pb-40 px-4 w-full max-w-[1440px] mx-auto">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600 mt-1">문의 진행 확인</p>
            </div>
            <div className="flex gap-4">
              <Link href="/manager" className="inline-flex items-center px-4 py-2  text-black hover:text-white border-2 rounded-lg hover:bg-gray-800 transition-colors font-medium">
                등록 페이지
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">전체 문의</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">진행중</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">성공</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">거절</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* 필터 & 검색 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 이름, 이메일, 회사명, 연락처로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 상태 필터 */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">전체 상태</option>
            <option value="pending">진행중</option>
            <option value="accepted">성공</option>
            <option value="rejected">거절</option>
          </select>

          {/* 타입 필터 */}
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">전체 타입</option>
            <option value="speaker">SPEAKER</option>
            <option value="artist">ARTIST</option>
          </select>
        </div>

        <div className="mt-2 text-sm text-gray-600">{filteredInquiries.length}개의 문의가 검색되었습니다.</div>
      </div>

      {/* 테이블 리스트 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">타입</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">대상자</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">문의자</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">회사명</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={`${inq.type}-${inq.id}`} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-4">{getStatusBadge(inq.status)}</td>
                    <td className="px-4 py-4">{getTypeBadge(inq.type)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={getProfileImage(inq)} alt={getProfileName(inq)} className="w-10 h-10 rounded-full object-cover" />
                        <span className="font-medium text-gray-900">{getProfileName(inq)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{inq.profiles?.name || "-"}</p>
                        <p className="text-sm text-gray-500">{inq.profiles?.email || "-"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{inq.manager_name || "-"}</td>
                    <td className="px-4 py-4 text-gray-700">{inq.manager_phone || "-"}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{new Date(inq.created_at).toLocaleDateString("ko-KR")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
