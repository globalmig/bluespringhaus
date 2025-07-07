"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "@/app/components/common/CardItem";
import type { Speaker } from "@/types/inquiry";

interface SearchPageProps {
  searchParams: Record<string, string>;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { location, category, budget } = searchParams;
  const [isSpeakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await axios.get<Speaker[]>("/api/speakers");
        setSpeakers(res.data);
      } catch (error) {
        console.error("API 호출 실패!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const filteredSpeakers = isSpeakers.filter((spk) => {
    const toText = (...args: (string | string[] | null | undefined)[]) =>
      args
        .flat()
        .filter((v): v is string => typeof v === "string")
        .join(" ")
        .toLowerCase();

    const speakerText = toText(spk.name, spk.short_desc, spk.full_desc, spk.career, spk.tags, spk.is_recommended);

    const keywordLocation = location?.trim().toLowerCase();
    const keywordCategory = category?.trim().toLowerCase();
    const keywordBudget = budget?.trim().toLowerCase();

    const isDefault = (value?: string) => !value || value === "추천리스트" || value === "분야 선택" || value === "섭외비 선택";

    const matchLocation = isDefault(keywordLocation) || speakerText.includes(keywordLocation!);
    const matchCategory = isDefault(keywordCategory) || speakerText.includes(keywordCategory!);
    const matchBudget = isDefault(keywordBudget) || speakerText.includes(keywordBudget!);

    return matchLocation && matchCategory && matchBudget;
  });

  return (
    <main className="w-full max-w-[1440px] mx-auto py-10 md:py-20">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">검색 결과</h1>
      {loading ? (
        <p className="text-gray-500">검색 결과를 불러오는 중...</p>
      ) : filteredSpeakers.length > 0 ? (
        <CardItem slides={filteredSpeakers} title="검색 결과" />
      ) : (
        <p className="text-lg">검색 결과가 없습니다.</p>
      )}
    </main>
  );
}
