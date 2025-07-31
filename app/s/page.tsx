"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "@/app/components/common/CardItem";
import type { Speaker } from "@/types/inquiry";
import Search from "../components/common/Search";

interface SearchPageProps {
  searchParams: Record<string, string>;
}

// 카테고리 정의 (하위 카테고리 포함)
const categories = [
  {
    label: "인문 & 철학",
    value: "humanities",
    subCategories: ["인문학", "철학"],
  },
  {
    label: "경제 & 경영",
    value: "economy",
    subCategories: ["경제", "투자", "주식"],
  },
  {
    label: "비즈니스 & 커리어",
    value: "business",
    subCategories: ["경영전략", "리더십"],
  },
  {
    label: "트렌드 & 미래",
    value: "trend",
    subCategories: ["테크트렌드", "소비트렌드"],
  },
  {
    label: "자기계발 & 마인드셋",
    value: "mindset",
    subCategories: ["동기부여", "습관", "루틴"],
  },
  {
    label: "라이프 & 웰빙",
    value: "wellbeing",
    subCategories: ["명상", "마음챙김"],
  },
  {
    label: "문화 & 사회",
    value: "culture",
    subCategories: ["문화예술", "교육", "사회문제", "젠더", "정치"],
  },
  {
    label: "글로벌",
    value: "global",
    subCategories: ["국제정세", "해외 시장 진출", "해외 취업", "글로벌 리더십"],
  },
];

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

  const [isMoOpen, setMoOpen] = useState(false);

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

    const matchBudget = isDefault(keywordBudget) || speakerText.includes(keywordBudget!);

    const matchCategory =
      isDefault(keywordCategory) ||
      categories
        .filter((c) => c.value === keywordCategory)
        .flatMap((c) => [c.label, ...(c.subCategories || [])])
        .some((kw) => speakerText.includes(kw.toLowerCase()));

    return matchLocation && matchCategory && matchBudget;
  });

  return (
    <main className="w-full mx-auto ">
      <Search isMoOpen={isMoOpen} setMoOpen={setMoOpen} />
      <div className="w-full max-w-[1440px] mx-auto py-12 ">
        {loading ? (
          <div className="min-h-screen flex justify-center">
            <p className="text-gray-500 pt-10">검색 결과를 불러오는 중...</p>
          </div>
        ) : filteredSpeakers.length > 0 ? (
          <CardItem slides={filteredSpeakers} title="검색 결과" />
        ) : (
          <div className="min-h-screen flex justify-center">
            <p className="text-gray-500 pt-10">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
