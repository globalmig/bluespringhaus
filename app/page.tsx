"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CardList from "./components/common/CardList";
import Search from "./components/common/Search";
import type { Speaker } from "@/types/inquiry";

export default function Home() {
  const [isSpeakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await axios.get<Speaker[]>("/api/speakers");
        setSpeakers(res.data);
      } catch (error) {
        console.error("API 호출 실패!", error);
      }
    };

    fetchSpeakers();
  }, []);

  const popularSpeaker = isSpeakers.filter((spk) => spk.is_recommended?.includes("popularSpeaker"));
  const topClassSpeaker = isSpeakers.filter((spk) => spk.is_recommended?.includes("topClassSpeaker"));
  const risingNewSpeaker = isSpeakers.filter((spk) => spk.is_recommended?.includes("risingNewSpeaker "));

  const trendInsightMaker = isSpeakers.filter((spk) => spk.is_recommended?.includes("trendInsightMaker"));

  const mindsetExpert = isSpeakers.filter((spk) => spk.is_recommended?.includes("mindsetExpert"));

  const culturalArtSpeaker = isSpeakers.filter((spk) => spk.is_recommended?.includes("culturalArtSpeaker"));

  const youthInspiringSpeaker = isSpeakers.filter((spk) => spk.is_recommended?.includes("youthInspiringSpeaker"));

  const selfImprovementSpeaker = isSpeakers.filter((spk) => spk.is_recommended?.includes("selfImprovementSpeaker"));

  const globalSpeaker = isSpeakers.filter((spk) => spk.is_recommended?.includes("globalSpeaker"));

  const businessGrowthExpert = isSpeakers.filter((spk) => spk.is_recommended?.includes("businessGrowthExpert"));

  return (
    <div className="w-full max-w-[1440px] justify-center items-center mx-auto">
      <div className="relative">
        <Search />
      </div>

      {/* 지금 인기있는 연사 섹션 */}
      <section className="py-10 md:py-20">{popularSpeaker.length > 0 ? <CardList slides={popularSpeaker} title="지금 인기있는 연사" /> : <p>추천 연사가 없습니다.</p>}</section>

      <section className="py-10 md:py-20">{topClassSpeaker.length > 0 ? <CardList slides={topClassSpeaker} title="탑 클래스 연사" /> : <p>탑 클래스 연사가 없습니다.</p>}</section>

      <section className="py-10 md:py-20">{risingNewSpeaker.length > 0 ? <CardList slides={risingNewSpeaker} title="떠오르는 신규연사" /> : <p>떠오르는 신규연사가 없습니다.</p>}</section>

      <section className="py-10 md:py-20">
        {trendInsightMaker.length > 0 ? <CardList slides={trendInsightMaker} title="트렌드 읽는 인사이트메이커" /> : <p>트렌드 읽는 인사이트메이커 연사가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {mindsetExpert.length > 0 ? <CardList slides={mindsetExpert} title="마음과 삶을 변화시키는 마인드 전문가" /> : <p>마음과 삶을 변화시키는 마인드 전문가 연사가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {culturalArtSpeaker.length > 0 ? <CardList slides={culturalArtSpeaker} title="영감을 주는 문화 예술 연사" /> : <p>영감을 주는 문화 예술 연사가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {youthInspiringSpeaker.length > 0 ? <CardList slides={youthInspiringSpeaker} title="청춘에게 영감을 주는 연사" /> : <p>청춘에게 영감을 주는 연사가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {selfImprovementSpeaker.length > 0 ? <CardList slides={selfImprovementSpeaker} title="꿈에 더 가까워지는 자기계발연사" /> : <p>꿈에 더 가까워지는 자기계발 연사가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {globalSpeaker.length > 0 ? <CardList slides={globalSpeaker} title="전 세계가 주목하는 글로벌 스피커" /> : <p>전 세계가 주목하는 글로벌 스피커가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {businessGrowthExpert.length > 0 ? <CardList slides={businessGrowthExpert} title="성장을 설계하는 비즈니스 전문가 " /> : <p>성장을 설계하는 비즈니스 전문가가 없습니다.</p>}
      </section>
    </div>
  );
}
