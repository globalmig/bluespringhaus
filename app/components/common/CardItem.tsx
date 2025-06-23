"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { FreeMode, Navigation } from "swiper/modules";

const slideData = Array(8).fill({
  name: "이름영역입니다",
  desc: "소개 영역입니다",
  tag: "# 태그",
  image: "/images/hero.jpg",
});

import type { Swiper as SwiperClass } from "swiper";

export default function CardItem() {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="px-4 transform">
      {/* ✅ 헤더와 커스텀 네비게이션 */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-medium my-5">추천 섹션</h2>
        <div className="flex gap-2">
          <button onClick={() => swiperRef.current?.slidePrev()} className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <button onClick={() => swiperRef.current?.slideNext()} className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Swiper 본체 */}
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        breakpoints={{
          320: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 10 },
          640: { slidesPerView: 3, slidesPerGroup: 2, spaceBetween: 15 },
          1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
        }}
        speed={100}
        freeMode={false} // 자유 모드 활성화
        navigation={false} // 기본 네비게이션 비활성화
        pagination={{ clickable: true }}
        modules={[Navigation]}
        className="mySwiper"
      >
        {slideData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="max-w-[354px]">
              <Image src={item.image} alt="Hero Image" width={354} height={300} className="w-full bg-black rounded-2xl" />
              <div className="w-full px-2 flex flex-col gap-1 mt-2">
                <p>{item.name}</p>
                <p>{item.desc}</p>
                <div className="bg-black text-white rounded-full w-fit px-3 py-1 text-sm">{item.tag}</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
