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

export default function CardItem_artist({ slides, title }: CardItemProps) {
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
      {/* 제목 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
      </div>

      {/* 슬라이드 */}
      <Swiper
        modules={[Navigation]}
        slidesPerView={1.2}
        spaceBetween={16}
        navigation
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          768: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
          1280: { slidesPerView: 4 },
        }}
      >
        {[...slides]
          .sort((a, b) => Number(b.id) - Number(a.id)) // ✅ 최신순 정렬
          .map((artist) => (
            <SwiperSlide key={artist.id}>
              <div className="relative max-w-[354px]">
                <Link href={`/artists/${artist.id}`} className="no-underline">
                  <Image src={artist.profile_image || "/default.png"} alt={artist.name} width={354} height={300} className="w-full rounded-2xl bg-black object-cover" />
                  <div className="w-full px-2 flex flex-col gap-1 mt-2">
                    <p className="font-bold">{artist.name}</p>
                    <p className="text-gray-600">{artist.short_desc}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(artist.tags ?? []).map((t) => (
                        <span key={t} className="bg-black text-white rounded-full px-3 py-1 text-sm">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>

                {/* 좋아요 버튼 */}
                <button onClick={() => toggleLike(artist.id)} className="absolute top-2 right-2 text-white text-xl z-10">
                  {liked.has(artist.id) ? "❤️" : "🤍"}
                </button>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
