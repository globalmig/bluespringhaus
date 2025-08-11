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

type Target = "speaker" | "artist";

export default function SearchPage({ searchParams }: SearchPageProps) {
  const { location, category, budget, target } = searchParams;
  const [isSpeakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (target === "speaker") {
      axios
        .get<Speaker[]>("/api/speakers")
        .then((res) => setSpeakers(res.data))
        .catch((err) => console.error("API 호출 실패!", err))
        .finally(() => setLoading(false));
    } else {
      axios
        .get<Speaker[]>("/api/artists")
        .then((res) => setSpeakers(res.data))
        .catch((err) => console.error("API 호출 실패!", err))
        .finally(() => setLoading(false));
    }
  }, [target]);

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
      <Search isMoOpen={isMoOpen} setMoOpen={setMoOpen} target={"speaker"} />
      <div className="w-full max-w-[1440px] mx-auto py-12 ">
        {loading ? (
          <div className="min-h-screen flex justify-center">
            <p className="text-gray-500 pt-10">검색 결과를 불러오는 중...</p>
          </div>
        ) : filteredSpeakers.length > 0 ? (
          <CardItem slides={filteredSpeakers} title="검색 결과" target={target} />
        ) : (
          <div className="min-h-screen flex justify-center">
            <p className="text-gray-500 pt-10">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  );
}
