"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Artists } from "@/types/inquiry";

import type { Swiper as SwiperClass } from "swiper";

interface CardItemProps {
  slides: Artists[];
  title: string;
}

export default function CardList_artist({ slides, title }: CardItemProps) {
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
    <div className="px-4 py-4 md:py-6 border-b   transform duration-300 ease-in-out">
      {/* 헤더 & 화살표 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold my-5">{title}</h2>
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
        slidesPerView={2.1} // ✅ 모바일 기본값
        spaceBetween={10}
        breakpoints={{
          640: { slidesPerView: 3.5, spaceBetween: 15 },
          1024: { slidesPerView: 6, spaceBetween: 20 },
        }}
        speed={100}
        modules={[Navigation]}
        className="mySwiper"
      >
        {slides.map((artist) => {
          const isLiked = liked.has(artist.id);
          return (
            <SwiperSlide key={artist.id} className="pb-4">
              <div className="relative max-w-[354px]">
                {/* 카드 본문 */}
                <Link href={`/artists/${artist.id}`} className="no-underline">
                  <div className="aspect-[3/4] w-full relative rounded-2xl overflow-hidden">
                    <Image
                      src={artist.profile_image && (artist.profile_image.startsWith("http") || artist.profile_image.startsWith("/")) ? artist.profile_image : "/default.png"}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="w-full px-2 flex flex-col gap-1 mt-2">
                    <p className="font-bold">{artist.name}</p>
                    <p className="h-12 text-sm">{artist.short_desc.length > 30 ? artist.short_desc.slice(0, 25) + "..." : artist.short_desc}</p>
                    <div className="hidden md:flex flex-wrap md:gap-2 gap-1 mt-2 max-h-[64px] overflow-hidden">
                      {(artist.tags ?? []).map((t, index) => (
                        <span key={index} className=" text-zinc-600 bg-slate-200 rounded-full px-2 md:px-3 py-1 md:text-sm text-xs">
                          {t}
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
