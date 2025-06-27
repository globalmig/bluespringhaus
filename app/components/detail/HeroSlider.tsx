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

export default function HeroSlider() {
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
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" alt="Nature 1" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" alt="Nature 2" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" alt="Nature 3" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" alt="Nature 4" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" alt="Nature 5" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" alt="Nature 6" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" alt="Nature 7" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" alt="Nature 8" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" alt="Nature 9" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-10.jpg" alt="Nature 10" className="w-full h-full object-cover" />
        </SwiperSlide>
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
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" alt="Nature 2 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>

        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" alt="Nature 2 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" alt="Nature 3 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" alt="Nature 4 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" alt="Nature 5 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" alt="Nature 6 thumb" className="w-full h-ull object-cover rounded cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" alt="Nature 7 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" alt="Nature 8 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" alt="Nature 9 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-10.jpg" alt="Nature 10 thumb" className="w-full h-full object-cover rounded cursor-pointer" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
