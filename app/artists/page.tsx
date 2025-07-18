"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import type { Artists } from "@/types/inquiry";

import SearchArtist from "../components/common/SearchArtist";
import CardList_artist from "../components/common/CardList_artist";

export default function Artists() {
  const [isArtists, setArtists] = useState<Artists[]>([]);
  const [loading, setLoading] = useState(true); // true는 boolean으로 수정

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await axios.get<Artists[]>("/api/artists");
        setArtists(res.data);
      } catch (error) {
        console.error("API 호출 실패!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // 카테고리 리스트 배열로 정리
  const artistCategories = [
    { key: "trendingArtists", title: "지금 인기있는 아티스트" },
    { key: "topClassArtists", title: "탑 클래스 아티스트" },
    { key: "risingNewArtists", title: "떠오르는 신규 아티스트" },
    { key: "emotionalArtists", title: "감성을 일깨우는 감성아티스트" },
    { key: "hiphopArtists", title: "심장을 울리는 힙합아티스트" },
    { key: "bandArtists", title: "밴드붐은 왔다 밴드아티스트" },
    { key: "festivalHeadliners", title: "대학축제 일순위 아티스트" },
    { key: "trotArtists", title: "흥으로 하나되는 트로트 아티스트" },
    { key: "indieArtists", title: "진심이 묻어나는 인디아티스트" },
    { key: "globalIdolArtists", title: "세계가 사랑하는 아이돌 아티스트" },
    { key: "broadcasters", title: "생명력을 불어넣는 방송인" },
    { key: "topYoutubers", title: "세상을 움직이는 유튜버" },
  ];

  return (
    <div className="w-full justify-center items-center mx-auto">
      <div className="relative w-full z-50">
        <SearchArtist />
      </div>

      {loading ? (
        <div className="w-full mx-auto min-h-screen flex justify-center items-start pt-20">
          <p>잠시만 기다려주세요.</p>
        </div>
      ) : (
        <>
          {artistCategories.map(({ key, title }) => {
            const filtered = isArtists.filter((artist) => artist.is_recommended?.includes(key));
            if (filtered.length === 0) return null;

            return (
              <section key={key} className="py-4 md:py-6  w-full max-w-[1440px] mx-auto">
                <CardList_artist slides={filtered} title={title} />
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
