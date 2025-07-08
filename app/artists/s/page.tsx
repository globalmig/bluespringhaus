// app/artists/s/page.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "@/app/components/common/CardItem";
import type { Speaker } from "@/types/inquiry";
import SearchArtist from "@/app/components/common/SearchArtist";

interface SearchPageProps {
  searchParams: Record<string, string>;
}

// 카테고리 정의 (하위 카테고리 포함)
const categories = [
  {
    label: "인디",
    value: "indie",
    subCategories: ["포크 인디", "어쿠스틱 인디", "인디 밴드"],
  },
  {
    label: "발라드",
    value: "ballad",
    subCategories: ["감성 발라드", "이별 노래", "OST"],
  },
  {
    label: "힙합",
    value: "hiphop",
    subCategories: ["언더그라운드", "쇼미 출신", "멜로딕 힙합"],
  },
  {
    label: "R&B",
    value: "rnb",
    subCategories: ["소울 R&B", "네오소울", "어반 R&B"],
  },
  {
    label: "트로트",
    value: "trot",
    subCategories: ["정통 트로트", "퓨전 트로트", "오디션 출신"],
  },
  {
    label: "락/밴드",
    value: "rock_band",
    subCategories: ["모던 록", "하드 록", "밴드 라이브"],
  },
  {
    label: "재즈",
    value: "jazz",
    subCategories: ["보컬 재즈", "스무스 재즈", "퓨전 재즈"],
  },
  {
    label: "EDM",
    value: "edm",
    subCategories: ["하우스", "트랜스", "일렉트로팝"],
  },
  {
    label: "클래식",
    value: "classical",
    subCategories: ["현악", "피아노", "관현악"],
  },
  {
    label: "어쿠스틱",
    value: "acoustic",
    subCategories: ["싱어송라이터", "감성 기타", "로파이"],
  },
  {
    label: "아이돌",
    value: "idol",
    subCategories: ["보이그룹", "걸그룹", "솔로 아이돌"],
  },
  {
    label: "댄스",
    value: "dance",
    subCategories: ["케이팝 댄스", "퍼포먼스", "댄서 크루"],
  },
  {
    label: "방송인",
    value: "broadcaster",
    subCategories: ["예능인", "인터뷰어", "방송 크리에이터"],
  },
  {
    label: "MC",
    value: "mc",
    subCategories: ["행사 MC", "무대 진행", "축제 진행자"],
  },
  {
    label: "아나운서",
    value: "announcer",
    subCategories: ["뉴스", "스포츠", "라디오"],
  },
  {
    label: "성우",
    value: "voice_actor",
    subCategories: ["애니메이션", "게임", "광고 내레이션"],
  },
  {
    label: "유튜버",
    value: "youtuber",
    subCategories: ["브이로그", "정보채널", "먹방/리뷰"],
  },
  {
    label: "틱톡커",
    value: "tiktoker",
    subCategories: ["숏폼 댄스", "챌린지", "유머"],
  },
  {
    label: "인플루언서",
    value: "influencer",
    subCategories: ["패션", "뷰티", "여행", "라이프스타일"],
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
    <main className="w-full max-w-[1440px] mx-auto py-10 md:py-20">
      <SearchArtist />
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
