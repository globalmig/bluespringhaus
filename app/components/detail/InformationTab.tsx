"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Accordiond from "@/app/components/detail/Accordiond";

import ReviewItem_mini from "./ReviewItem_mini";
import VideoList from "./VideoList";

interface Speaker {
  id: string;
  name: string;
  profile_image: string;
  gallery_images: string;
  short_desc: string;
  full_desc: string;
  intro_video: string[];
  reviews: string[];
  career: string;
  tags: string[];
}

interface ReviewItemProps {
  reviews: any[];
}

export default function InformationTab({ reviews }: ReviewItemProps) {
  const router = useRouter();
  const { id } = useParams();
  const [speaker, setSpeaker] = useState<Speaker | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchSpeaker = async () => {
      const { data, error } = await supabase.from("speakers").select("*").eq("id", id).single();

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      console.log("받아온 데이터:", data);
      setSpeaker(data as Speaker);
    };

    fetchSpeaker();
  }, [id]);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col  p-10  bg-white rounded-lg">
        <h2 className="font-bold text-2xl mb-2">안녕하세요 {speaker?.name}</h2>
        <div className="flex gap-6">
          <p>{speaker?.full_desc}</p>
        </div>
        {/* TODO: 리뷰 시각화 */}
      </section>

      <section className="flex flex-col  p-10 bg-white rounded-lg">
        <h2 className="font-bold text-2xl">소개영상</h2>
        <p>이용석님의 영상 포트폴리오입니다!</p>
        {/* TODO: 유튜브영상 */}
        {Array.isArray(speaker?.intro_video) &&
          speaker!.intro_video.map((video, index) => (
            <div className=" my-4">
              <VideoList key={index} url={video} title={speaker?.name || "소개 영상"} />
            </div>
          ))}
      </section>

      <section className="flex flex-col  p-10 bg-white rounded-lg">
        <h2 className="font-bold text-2xl">행사 진행 리뷰</h2>
        <p>고객분들의 만족도를 한눈에 봐요!</p>
        <ReviewItem_mini reviews={reviews} />
      </section>

      <section className="flex flex-col  p-10 bg-white rounded-lg">
        <h2 className="font-bold text-2xl">경력 및 수상 내역</h2>
        <p>활동기록을 확인해보세요!</p>
        <div className="mt-4">
          <p className="whitespace-pre-line">{speaker?.career}</p>
        </div>
      </section>

      <section className="flex flex-col mb-10 md:mb-20  p-10 bg-white rounded-lg">
        <h2 className="font-bold text-2xl">자주묻는질문</h2>
        <p>전문가님께 자주묻는 질문을 모아놨어요!</p>
        <div className="mt-4">
          <Accordiond />
        </div>
      </section>
    </div>
  );
}
