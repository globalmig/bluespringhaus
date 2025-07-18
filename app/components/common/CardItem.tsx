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

export default function CardItem({ slides, title }: CardItemProps) {
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

      <div className="grid grid-cols-4 gap-4">
        {slides.map((speaker) => (
          <div className="relative mb-8">
            {/* 카드 본문 */}
            <Link href={`/speakers/${speaker.id}`} className="no-underline">
              <div className="aspect-[3/4] h-[400px] w-full relative rounded-2xl overflow-hidden">
                <Image
                  src={speaker.profile_image && (speaker.profile_image.startsWith("http") || speaker.profile_image.startsWith("/")) ? speaker.profile_image : "/default.png"}
                  alt={speaker.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="w-full px-2 flex flex-col gap-1 mt-2">
                <p className="font-bold">{speaker.name}</p>
                <p className="h-12 text-sm">{speaker.short_desc.length > 30 ? speaker.short_desc.slice(0, 25) + "..." : speaker.short_desc}</p>
                <div className="flex flex-wrap md:gap-2 gap-1 mt-2 max-h-[64px] overflow-hidden">
                  {(speaker.tags ?? []).map((t) => (
                    <span key={t} className=" text-zinc-600 bg-slate-200 rounded-full px-2 md:px-3 py-1 md:text-sm text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
