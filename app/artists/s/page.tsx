"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CardItem from "@/app/components/common/CardItem";
import type { Speaker } from "@/types/inquiry";
import SearchArtist from "@/app/components/common/SearchArtist";

interface SearchPageProps {
  searchParams: Record<string, string>;
}

const categories = [
  { label: "인디", value: "indie", sub: ["포크 인디", "어쿠스틱 인디", "인디 밴드"] },
  { label: "발라드", value: "ballad", sub: ["감성 발라드", "이별 노래", "OST"] },
  { label: "힙합", value: "hiphop", sub: ["언더그라운드", "쇼미 출신", "멜로딕 힙합"] },
  { label: "R&B", value: "rnb", sub: ["소울 R&B", "네오소울", "어반 R&B"] },
  { label: "트로트", value: "trot", sub: ["정통 트로트", "퓨전 트로트", "오디션 출신"] },
  { label: "락/밴드", value: "rock_band", sub: ["모던 록", "하드 록", "밴드 라이브"] },
  { label: "재즈", value: "jazz", sub: ["보컬 재즈", "스무스 재즈", "퓨전 재즈"] },
  { label: "EDM", value: "edm", sub: ["하우스", "트랜스", "일렉트로팝"] },
  { label: "클래식", value: "classical", sub: ["현악", "피아노", "관현악"] },
  { label: "어쿠스틱", value: "acoustic", sub: ["싱어송라이터", "감성 기타", "로파이"] },
  { label: "아이돌", value: "idol", sub: ["보이그룹", "걸그룹", "솔로 아이돌"] },
  { label: "댄스", value: "dance", sub: ["케이팝 댄스", "퍼포먼스", "댄서 크루"] },
  { label: "방송인", value: "broadcaster", sub: ["예능인", "인터뷰어", "방송 크리에이터"] },
  { label: "MC", value: "mc", sub: ["행사 MC", "무대 진행", "축제 진행자"] },
  { label: "아나운서", value: "announcer", sub: ["뉴스", "스포츠", "라디오"] },
  { label: "성우", value: "voice_actor", sub: ["애니메이션", "게임", "광고 내레이션"] },
  { label: "유튜버", value: "youtuber", sub: ["브이로그", "정보채널", "먹방/리뷰"] },
  { label: "틱톡커", value: "tiktoker", sub: ["숏폼 댄스", "챌린지", "유머"] },
  { label: "인플루언서", value: "influencer", sub: ["패션", "뷰티", "여행", "라이프스타일"] },
];

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { location, category, budget } = searchParams;
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Speaker[]>("/api/artists")
      .then((res) => setSpeakers(res.data))
      .catch((err) => console.error("API 호출 실패!", err))
      .finally(() => setLoading(false));
  }, []);

  const normalize = (...args: (string | string[] | null | undefined)[]) =>
    args
      .flat()
      .filter((v): v is string => typeof v === "string")
      .join(" ")
      .toLowerCase();

  const isDefault = (val?: string) => !val || ["추천리스트", "분야 선택", "섭외비 선택"].includes(val);

  const matches = (target: string, keyword: string) => target.includes(keyword);

  const filtered = speakers.filter((spk) => {
    const fullText = normalize(spk.name, spk.short_desc, spk.full_desc, spk.career, spk.tags, spk.is_recommended);
    const cat = categories.find((c) => c.value === category?.toLowerCase());
    const catKeywords = [cat?.label, ...(cat?.sub || [])].filter((c): c is string => typeof c === "string").map((c) => c.toLowerCase());

    return (
      (isDefault(location) || matches(fullText, location!.toLowerCase())) &&
      (isDefault(budget) || matches(fullText, budget!.toLowerCase())) &&
      (isDefault(category) || catKeywords.some((kw) => matches(fullText, kw)))
    );
  });

  return (
    <main className="w-full mx-auto">
      <div className="w-full sticky top-0 z-40 bg-white border-b shadow-sm">
        <SearchArtist />
      </div>

      <div className="w-full max-w-[1440px] mx-auto py-12">
        {loading ? (
          <div className="min-h-screen flex justify-center pt-10">
            <p className="text-gray-500">검색 결과를 불러오는 중...</p>
          </div>
        ) : filtered.length > 0 ? (
          <CardItem slides={filtered} title="검색 결과" />
        ) : (
          <div className="min-h-screen flex justify-center pt-10">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
