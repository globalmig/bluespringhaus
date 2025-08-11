"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";

interface gallery {
  gallery_images?: string[];
}

export default function HeroSlider({ gallery_images }: gallery) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="w-full mx-auto relative">
      {/* ✅ PC용 메인 슬라이더 */}
      <div className="hidden md:block h-[600px]">
        <Swiper
          style={
            {
              "--swiper-navigation-color": "#616161",
              "--swiper-pagination-color": "#616161",
            } as React.CSSProperties
          }
          spaceBetween={10}
          navigation={true}
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mb-4 h-[600px] rounded-lg"
        >
          {gallery_images?.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`slide-${index}`} className="w-full h-full object-contain" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 썸네일 */}
        {/* <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={6}
          freeMode
          watchSlidesProgress
          modules={[FreeMode, Navigation, Thumbs]}
          className="absolute -top-36 left-0 right-0 h-32 z-10 shadow-2xl mx-4"
        >
          {gallery_images?.map((img, index) => (
            <SwiperSlide key={index} className="aspect-square h-full">
              <img src={img} alt={`thumb-${index}`} className="w-full h-full object-cover rounded cursor-pointer object-top" />
            </SwiperSlide>
          ))}
        </Swiper> */}
      </div>

      {/* ✅ 모바일/태블릿용 슬라이더 */}
      <div className="block md:hidden">
        <Swiper spaceBetween={10} pagination={{ clickable: true }} modules={[Navigation]} className="h-[240px] rounded-md">
          {gallery_images?.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img} alt={`mobile-${index}`} className="w-full h-full object-contain" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
