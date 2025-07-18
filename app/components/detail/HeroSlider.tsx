"use client"; // Next.js 13+ App Router의 경우 필요

import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

interface gallery {
  gallery_images?: string[];
}

export default function HeroSlider({ gallery_images }: gallery) {
  // 올바른 타입 지정
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="w-full h-[400px] md:h-[570px]  mx-auto relative transform ease-in-out duration-300 ">
      {/* Main Swiper */}
      <Swiper
        style={
          {
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mb-4 h-[420px] md:h-[600px] rounded-lg transform ease-in-out duration-300"
      >
        {gallery_images?.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt="Nature 1" className="w-full h-full object-contain" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        breakpoints={{
          0: {
            slidesPerView: 3, // 모바일
          },
          640: {
            slidesPerView: 4, // 태블릿
          },
          1024: {
            slidesPerView: 6, // 데스크톱
          },
        }}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="absolute -top-36 left-0 right-0 h-32 z-10 shadow-2xl mx-4"
      >
        {gallery_images?.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt="Nature 2 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
