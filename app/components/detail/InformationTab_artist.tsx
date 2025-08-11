"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Accordiond from "@/app/components/detail/Accordiond";

import ReviewItem_mini from "./ReviewItem_mini";
import VideoList from "./VideoList";
import LinkPreview from "./LinkPreview";

interface Artist {
  id: string;
  name: string;
  profile_image?: string[];
  gallery_images?: string[];
  short_desc?: string;
  full_desc?: string;
  intro_video?: string[];
  intro_book?: string[];
  reviews?: string[];
  career?: string;
  tags?: string[];
}

interface ReviewItemProps {
  artist: Artist;
  reviews: any[];
}

export default function InformationTab_artist({ reviews, artist }: ReviewItemProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [showAllBooks, setShowAllBooks] = useState(false);

  return (
    <div className="flex flex-col gap-10  py-10 bg-slate-100 px-2">
      <section className="flex flex-col py-6 px-4 md:p-10 bg-white rounded-lg border  w-full max-w-[1440px] mx-auto">
        <h2 className="font-bold text-xl md:text-2xl mb-2">{artist?.name}님을 소개합니다!</h2>
        <div className="flex gap-6">
          <p>{artist?.full_desc}</p>
        </div>
        {/* TODO: 리뷰 시각화 */}
      </section>

      <section className="flex flex-col p-6 md:p-10 border bg-white rounded-lg  w-full max-w-[1440px] mx-auto">
        <h2 className="font-bold text-xl md:text-2xl">소개영상</h2>
        <p>이용석님의 영상 포트폴리오입니다!</p>
        {/* TODO: 유튜브영상 */}
        {Array.isArray(artist?.intro_video) &&
          artist!.intro_video.map((video, index) => (
            <div className=" my-4">
              <VideoList key={index} url={video} title={artist?.name || "소개 영상"} />
            </div>
          ))}
      </section>

      {artist?.intro_book && artist.intro_book.length > 0 ? (
        <section className="flex flex-col py-6 px-4 md:p-10 border bg-white rounded-lg  w-full max-w-[1440px] mx-auto">
          <h2 className="font-bold text-xl md:text-2xl">책</h2>
          <p className="mb-4">지필한 책을 확인해보세요</p>
          <div className="md:block hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {(showAllBooks ? artist.intro_book : artist.intro_book.slice(0, 3)).map((item, index) => (
                <LinkPreview key={index} url={item} />
              ))}
            </div>

            {artist.intro_book.length > 3 && (
              <button onClick={() => setShowAllBooks(!showAllBooks)} className="mt-6 self-center text-sm text-blue-500  w-full p-8 shadow-md rounded-lg border">
                {showAllBooks ? "접기" : "더보기"}
              </button>
            )}
          </div>
          <div className="block md:hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8  w-full max-w-[1440px] mx-auto">
              {(showAllBooks ? artist.intro_book : artist.intro_book.slice(0, 2)).map((item, index) => (
                <LinkPreview key={index} url={item} />
              ))}
            </div>

            {artist.intro_book.length > 2 && (
              <button onClick={() => setShowAllBooks(!showAllBooks)} className="mt-6 self-center text-sm text-blue-500  w-full p-6 shadow-md rounded-lg border ">
                {showAllBooks ? "접기" : "더보기"}
              </button>
            )}
          </div>
        </section>
      ) : null}

      {artist.reviews ? (
        <section className="flex flex-col  p-2 bg-white rounded-lg w-full max-w-[1440px] mx-auto">
          <h2 className="font-bold text-xl md:text-2xl">행사 진행 리뷰</h2>
          <p>고객분들의 만족도를 한눈에 봐요!</p>
          <ReviewItem_mini reviews={reviews} />
        </section>
      ) : null}

      {artist.career ? (
        <section className="flex flex-col  py-6 px-4 md:p-10 border bg-white rounded-lg w-full max-w-[1440px] mx-auto">
          <h2 className="font-bold text-xl md:text-2xl">프로필</h2>
          <p>활동기록을 확인해보세요!</p>
          <div className="mt-4">
            <p className="whitespace-pre-line">{artist?.career}</p>
          </div>
        </section>
      ) : null}

      <section className="flex flex-col mb-10 md:mb-20  py-6 px-4 md:p-10 bg-white rounded-lg border w-full max-w-[1440px] mx-auto">
        <h2 className="font-bold text-xl md:text-2xl">자주묻는질문</h2>
        <p>전문가님께 자주묻는 질문을 모아놨어요!</p>
        <div className="mt-4">
          <Accordiond />
        </div>
      </section>
    </div>
  );
}
