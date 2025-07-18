"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CardList from "./components/common/CardList";
import Search from "./components/common/Search";
import type { Speaker } from "@/types/inquiry";

export default function Home() {
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

  // 추천 태그 목록 정의
  const speakerCategories = [
    { key: "popularSpeaker", title: "지금 인기있는 연사" },
    { key: "topClassSpeaker", title: "탑 클래스 연사" },
    { key: "risingNewSpeaker", title: "떠오르는 신규연사" },
    { key: "trendInsightMaker", title: "트렌드 읽는 인사이트메이커" },
    { key: "mindsetExpert", title: "마음과 삶을 변화시키는 마인드 전문가" },
    { key: "culturalArtSpeaker", title: "영감을 주는 문화 예술 연사" },
    { key: "youthInspiringSpeaker", title: "청춘에게 영감을 주는 연사" },
    { key: "selfImprovementSpeaker", title: "꿈에 더 가까워지는 자기계발연사" },
    { key: "globalSpeaker", title: "전 세계가 주목하는 글로벌 스피커" },
    { key: "businessGrowthExpert", title: "성장을 설계하는 비즈니스 전문가" },
  ];

  return (
    <div className="w-full justify-center items-center mx-auto">
      <div className="relative w-full z-50">
        <Search />
      </div>

      {loading ? (
        <div className="w-full mx-auto min-h-screen flex justify-center items-start pt-20">
          <p>잠시만 기다려주세요.</p>
        </div>
      ) : (
        <>
          {speakerCategories.map(({ key, title }) => {
            const filtered = isSpeakers.filter((spk) => spk.is_recommended?.includes(key));
            if (filtered.length === 0) return null;

            return (
              <section key={key} className="py-4 md:py-6 w-full max-w-[1440px] mx-auto">
                <CardList slides={filtered} title={title} />
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
