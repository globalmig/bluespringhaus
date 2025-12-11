"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import CardList from "./components/common/CardList";
import Search from "./components/common/Search";
import type { Speaker } from "@/types/inquiry";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";

type PagedResponse<T> = {
  items: T[];
  hasMore: boolean;
  total: number;
  page: number;
  pageSize: number;
};

export default function Home() {
  const [isSpeakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMoOpen, setMoOpen] = useState(false);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await axios.get<PagedResponse<Speaker>>("/api/speakers", {
          params: {
            page: 1,
            pageSize: 200, // 한 번에 충분히 많이 가져오기
          },
        });
        // ✅ 배열만 상태에 넣기
        setSpeakers(res.data.items);
      } catch (error) {
        // console.error("API 호출 실패!", error);
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
    <div className="main w-full justify-center items-center mx-auto min-h-screen">
      <div className="relative h-[280px] md:h-[600px] slider duration-300 transform ease-in-out  mb-12 md:mb-8 z-40">
        <div className="md:absolute w-full md:bottom-1 ">
          <div className="relative w-full z-40 px-4">
            <Search isMoOpen={isMoOpen} setMoOpen={setMoOpen} target={"speaker"} />
          </div>
        </div>
        <div className={`absolute md:mt-0 w-full h-[280px] md:h-[650px] bg-zinc-100  ${isMoOpen ? "hidden" : "flex"}`}>
          <Swiper
            direction={"vertical"}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}
            className={`mySwiper mt-4 `}
          >
            <SwiperSlide>
              <Image src="/image/banner1.jpg" alt="국내 최고의 전문성과 경험" fill className="object-contain" />
            </SwiperSlide>
            <SwiperSlide>
              <Image src="/image/banner2.jpg" alt="국내 최초 강연 문화 섭외기업" fill className="object-contain" />
            </SwiperSlide>
            <SwiperSlide>
              <Image src="/image/banner3.jpg" alt="최고의 섭외력" fill className="object-contain" />
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      {loading ? (
        <div className={`w-full mx-auto min-h-screen flex justify-center items-start pt-20 ${isMoOpen ? "md:block hidden" : "block"}`}>
          <p>잠시만 기다려주세요.</p>
        </div>
      ) : (
        <div className={`${isMoOpen ? "md:block hidden" : "block"} mt-28`}>
          {speakerCategories.map(({ key, title }) => {
            const filtered = isSpeakers.filter((spk) => spk.is_recommended?.includes(key));
            if (filtered.length === 0) return null;

            return (
              <section key={key} className={` w-full max-w-[1440px] mx-auto`}>
                <CardList slides={filtered} title={title} type={"speaker"} />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
