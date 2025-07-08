// app/artists/page.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import type { Artists } from "@/types/inquiry";

import SearchArtist from "../components/common/SearchArtist";
import CardList_artist from "../components/common/CardList_artist";

export default function Artists() {
  const [isArtists, setArtists] = useState<Artists[]>([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await axios.get<Artists[]>("/api/artists");
        setArtists(res.data);
      } catch (error) {
        console.error("API 호출 실패!", error);
      }
    };

    fetchArtists();
  }, []);

  const trendingArtists = isArtists.filter((spk) => spk.is_recommended?.includes("trendingArtists"));
  const topClassArtists = isArtists.filter((spk) => spk.is_recommended?.includes("topClassArtists"));
  const risingNewArtists = isArtists.filter((spk) => spk.is_recommended?.includes("risingNewArtists"));

  const emotionalArtists = isArtists.filter((spk) => spk.is_recommended?.includes("emotionalArtists"));

  const hiphopArtists = isArtists.filter((spk) => spk.is_recommended?.includes("hiphopArtists"));

  const bandArtists = isArtists.filter((spk) => spk.is_recommended?.includes("bandArtists"));

  const festivalHeadliners = isArtists.filter((spk) => spk.is_recommended?.includes("festivalHeadliners"));

  const trotArtists = isArtists.filter((spk) => spk.is_recommended?.includes("trotArtists"));

  const indieArtists = isArtists.filter((spk) => spk.is_recommended?.includes("indieArtists"));

  const globalIdolArtists = isArtists.filter((spk) => spk.is_recommended?.includes("globalIdolArtists"));

  const broadcasters = isArtists.filter((spk) => spk.is_recommended?.includes("broadcasters"));

  const topYoutubers = isArtists.filter((spk) => spk.is_recommended?.includes("topYoutubers"));

  return (
    <div className="w-full max-w-[1440px] justify-center items-center mx-auto">
      <div className="relative">
        <SearchArtist />
      </div>

      {/* 지금 인기있는 아티스트 섹션 */}
      <section className="py-10 md:py-20">{trendingArtists.length > 0 ? <CardList_artist slides={trendingArtists} title="지금 인기있는 아티스트" /> : <p>추천 아티스트가 없습니다.</p>}</section>

      <section className="py-10 md:py-20">{topClassArtists.length > 0 ? <CardList_artist slides={topClassArtists} title="탑 클래스 아티스트" /> : <p>탑 클래스 아티스트가 없습니다.</p>}</section>

      <section className="py-10 md:py-20">{risingNewArtists.length > 0 ? <CardList_artist slides={risingNewArtists} title="떠오르는 신규 아티스트" /> : <p>탑 클래스 아티스트가 없습니다.</p>}</section>

      <section className="py-10 md:py-20">
        {emotionalArtists.length > 0 ? <CardList_artist slides={emotionalArtists} title="감성을 일깨우는 감성아티스트" /> : <p>감성을 일깨우는 감성 아티스트가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {hiphopArtists.length > 0 ? <CardList_artist slides={hiphopArtists} title="심장을 울리는 힙합아티스트" /> : <p>마음과 삶을 변화시키는 마인드 전문가 아티스트가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {bandArtists.length > 0 ? <CardList_artist slides={bandArtists} title="밴드붐은 왔다 밴드아티스트" /> : <p>밴드붐은 왔다 밴드아티스트가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {festivalHeadliners.length > 0 ? <CardList_artist slides={festivalHeadliners} title="대학축제 일순위 아티스트" /> : <p>대학축제 일순위 아티스트가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">
        {trotArtists.length > 0 ? <CardList_artist slides={trotArtists} title="흥으로 하나되는 트로트 아티스트" /> : <p>흥으로 하나되는 트로트 아티스트가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">{indieArtists.length > 0 ? <CardList_artist slides={indieArtists} title="진심이 묻어나는 인디아티스트" /> : <p>진심이 묻어나는 인디아티스트</p>}</section>

      <section className="py-10 md:py-20">
        {globalIdolArtists.length > 0 ? <CardList_artist slides={globalIdolArtists} title="세계가 사랑하는 아이돌 아티스트" /> : <p>세계가 사랑하는 아이돌 아티스트가 없습니다.</p>}
      </section>

      <section className="py-10 md:py-20">{broadcasters.length > 0 ? <CardList_artist slides={broadcasters} title="생명력을 불어넣는 방송인" /> : <p>생명력을 불어넣는 방송인가 없습니다.</p>}</section>

      <section className="py-10 md:py-20">{topYoutubers.length > 0 ? <CardList_artist slides={topYoutubers} title="세상을 움직이는 유튜버" /> : <p>세상을 움직이는 유튜버가 없습니다.</p>}</section>
    </div>
  );
}
