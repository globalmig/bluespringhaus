"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface RejectProps {
  id: string | number;
  name: string;
  profile_image: string;
  short_desc: string;
  tags?: string[];
  reason?: string;
}

interface RejectItemProps {
  slides: RejectProps[];
  type: "speaker" | "artist";
  title: string;
}

export default function RejectItem({ slides, type, title }: RejectItemProps) {
  return (
    <div className="px-4 max-w-[1440px] w-full mx-auto flex flex-col justify-center items-center">
      <h2 className="text-lg md:text-2xl text-start font-bold my-5 w-full">{title}</h2>

      <div className="flex flex-col gap-6 max-w-[1440px] w-full ">
        {slides.map((item) => (
          <div key={item.id} className="flex max-w-[1440px] w-full gap-4 items-start border rounded-lg p-4 shadow-sm">
            <div className="w-24 h-32 relative shrink-0 rounded-lg overflow-hidden">
              <Image
                src={item.profile_image && (item.profile_image.startsWith("http") || item.profile_image.startsWith("/")) ? item.profile_image : "/default.png"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col w-full">
              <Link href={`/${type}s/${item.id}`} className="font-bold text-lg hover:underline">
                {item.name}
              </Link>
              <p className="text-sm text-gray-700 mt-1">{item.short_desc}</p>

              {/* {Array.isArray(item.tags) && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              )} */}

              {item.reason && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded">거절 사유: {item.reason}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
