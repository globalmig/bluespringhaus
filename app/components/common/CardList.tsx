"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Speaker } from "@/types/inquiry";

import type { Swiper as SwiperClass } from "swiper";

interface CardItemProps {
  slides: Speaker[];
  title: string;
}

export default function CardList({ slides, title }: CardItemProps) {
  const swiperRef = useRef<SwiperClass | null>(null);
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
        <h2 className="text-3xl font-medium my-5">{title}</h2>
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
        {slides.map((speaker) => {
          const isLiked = liked.has(speaker.id);

          return (
            <SwiperSlide key={speaker.id}>
              <div className="relative max-w-[354px]">
                {/* 카드 본문 */}
                <Link href={`/speakers/${speaker.id}`} className="no-underline">
                  <Image
                    src={speaker.profile_image?.[0] ?? "/default.png"} // 이미지 없을 때 대체 이미지 권장
                    alt={speaker.name}
                    width={354}
                    height={300}
                    className="w-full rounded-2xl object-cover"
                  />

                  <div className="w-full px-2 flex flex-col gap-1 mt-2">
                    <p>{speaker.name}</p>
                    <p>{speaker.short_desc}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(speaker.tags ?? []).map((t) => (
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
