"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Search from "../components/common/Search";
import CardList_artist from "../components/common/CardList_artist";
import type { Speaker } from "@/types/inquiry";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";

export default function Home() {
  const [isSpeakers, setSpeakers] = useState<Speaker[]>([]);
  const [isMoOpen, setMoOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await axios.get<Speaker[]>("/api/artists");
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
    <div className="main  w-full justify-center items-center mx-auto min-h-screen">
      <div className="relative h-[280px] md:h-[600px] slider duration-300 transform ease-in-out  mb-12 md:mb-8 z-40">
        <div className="md:absolute w-full md:bottom-1 ">
          <div className="relative w-full z-40">
            <Search isMoOpen={isMoOpen} setMoOpen={setMoOpen} target={"artist"} />
          </div>
        </div>
        <div className={`absolute md:mt-0 w-full h-[280px] md:h-[650px] bg-zinc-100  ${isMoOpen ? "hidden" : "flex"}`}>
          <Swiper
            direction={"vertical"}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 2500,
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
                <CardList_artist slides={filtered} title={title} />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
