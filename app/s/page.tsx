// pages/s (또는 app/(route)/s/page.tsx)
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "@/app/components/common/CardItem";
import Search from "../components/common/Search";
import type { Speaker as SpeakerType } from "@/types/inquiry"; // ✅ 아이콘 말고 데이터 타입만

interface SearchPageProps {
  searchParams: Record<string, string | undefined>;
}

type Target = "speaker" | "artist";

export default function SearchPage({ searchParams }: SearchPageProps) {
  const target = (searchParams.target as Target) || "speaker";
  const location = searchParams.location || "";
  const category = searchParams.category || "";
  const budget = searchParams.budget || "";

  const [items, setItems] = useState<SpeakerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endpoint = target === "speaker" ? "/api/speakers" : "/api/artists";
    axios
      .get<SpeakerType[]>(endpoint, {
        params: { location, category, budget, target }, // ✅ 서버로 그대로 전달
      })
      .then((res) => setItems(res.data))
      .catch((err) => console.error("API 호출 실패!", err))
      .finally(() => setLoading(false));
  }, [target, location, category, budget]);

  return (
    <main className="w-full mx-auto ">
      <Search isMoOpen={false} setMoOpen={() => {}} target={target} /> {/* ✅ URL의 target 반영 */}
      <div className="w-full max-w-[1440px] mx-auto py-12 ">
        {loading ? (
          <div className="min-h-screen flex justify-center">
            <p className="text-gray-500 pt-10">검색 결과를 불러오는 중...</p>
          </div>
        ) : items.length > 0 ? (
          <CardItem slides={items} title="검색 결과" target={target} />
        ) : (
          <div className="min-h-screen flex justify-center">
            <p className="text-gray-500 pt-10">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
