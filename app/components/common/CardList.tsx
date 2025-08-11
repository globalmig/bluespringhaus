"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Speaker, Artists } from "@/types/inquiry";
import type { Swiper as SwiperClass } from "swiper";

interface CardItemProps {
  slides: (Speaker | Artists)[];
  title: string;
  type: "speaker" | "artist";
}

export default function CardList({ slides, title, type }: CardItemProps) {
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
    <div className="px-4 py-4 md:py-6 border-b transform duration-300 ease-in-out">
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-2xl font-bold my-5">{title}</h2>
        <div className="flex gap-2">
          <button onClick={() => swiperRef.current?.slidePrev()} className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center" aria-label="이전" type="button">
            ‹
          </button>
          <button onClick={() => swiperRef.current?.slideNext()} className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center" aria-label="다음" type="button">
            ›
          </button>
        </div>
      </div>

      <Swiper
        onSwiper={(s) => (swiperRef.current = s)}
        breakpoints={{
          320: { slidesPerView: 3.2, slidesPerGroup: 1, spaceBetween: 10 },
          640: { slidesPerView: 4.5, slidesPerGroup: 2, spaceBetween: 15 },
          1024: { slidesPerView: 7, slidesPerGroup: 4, spaceBetween: 20 },
        }}
        speed={100}
        modules={[Navigation]}
        className="mySwiper"
      >
        {slides.map((item) => {
          const isLiked = liked.has(item.id);
          const href = `/${type}s/${item.id}`;
          const img = item.profile_image && (item.profile_image.startsWith("http") || item.profile_image.startsWith("/")) ? item.profile_image : "/default.png";

          return (
            <SwiperSlide key={item.id} className="pb-4">
              <div className="relative max-w-[354px]">
                <Link href={href} className="no-underline">
                  <div className="aspect-[3/4] w-full relative rounded-2xl overflow-hidden">
                    <Image src={img} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="w-full px-2 flex flex-col gap-1 mt-2">
                    <p className="font-bold">{item.name}</p>
                    <p className="h-12 text-sm">{item.short_desc?.length > 30 ? item.short_desc.slice(0, 25) + "..." : item.short_desc}</p>
                    <div className="flex flex-wrap md:gap-2 gap-1 mt-2 max-h-[64px] overflow-hidden">
                      {(item.tags ?? []).map((t) => (
                        <span
                          key={`${item.id}-${t}`} // ← key 안정성 보강
                          className="text-zinc-600 bg-slate-200 rounded-full px-2 md:px-3 py-1 md:text-sm text-xs hidden md:block"
                        >
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
