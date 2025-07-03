"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { Swiper as SwiperClass } from "swiper";

interface SlideData {
  id: string;
  name: string;
  profile_image: string;
  short_desc: string;
  tags: string[];
}
interface CardItemProps {
  slides: SlideData[];
}

export default function CardItem({ slides }: CardItemProps) {
  const swiperRef = useRef<SwiperClass | null>(null);

  /** ✅ 좋아요한 카드 id를 저장 */
  const [liked, setLiked] = useState<Set<number | string>>(new Set());

  const toggleLike = (id: number | string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="px-4 transform">
      {/* 헤더 & 화살표 */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-medium my-5">추천 섹션</h2>
        <div className="flex gap-2">
          <button onClick={() => swiperRef.current?.slidePrev()} className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">
            ‹
          </button>
          <button onClick={() => swiperRef.current?.slideNext()} className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">
            ›
          </button>
        </div>
      </div>

      {/* 슬라이더 */}
      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        breakpoints={{
          320: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 10 },
          640: { slidesPerView: 3, slidesPerGroup: 2, spaceBetween: 15 },
          1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 20 },
        }}
        speed={100}
        modules={[Navigation]}
        className="mySwiper"
      >
        {slides.map((item) => {
          const isLiked = liked.has(item.id);
          return (
            <SwiperSlide key={item.id}>
              {/* 카드 래퍼를 relative로 두어 하트 위치 기준점 제공 */}
              {/* TODO: 로그인 전용 기능으로 수정해야함 */}
              <div className="relative max-w-[354px]">
                {/* 하트 버튼 TODO: 후순위 작업
                <button
                  aria-label="좋아요"
                  onClick={(e) => {
                    e.stopPropagation(); // 링크로 전파 차단
                    e.preventDefault();
                    toggleLike(item.id);
                  }}
                  className="absolute p-2 pl-10 pb-10 top-2 right-2 z-10 hover:scale-110 transition-transform duration-200"
                >
                  <Image src={isLiked ? "/icon/heart_selected.svg" : "/icon/heart_default.svg"} alt="heart icon" width={24} height={24} />
                </button> */}

                {/* 카드 본문 */}
                <Link href={`/speakers/${item.id}`} className="no-underline">
                  <Image src={item.profile_image} alt={item.name} width={354} height={300} className="w-full rounded-2xl bg-black" />
                  <div className="w-full px-2 flex flex-col gap-1 mt-2">
                    <p>{item.name}</p>
                    <p>{item.short_desc}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(item.tags ?? []).map((t) => (
                        <span key={t} className="bg-black text-white rounded-full px-3 py-1 text-sm">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
