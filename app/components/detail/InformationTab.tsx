"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Accordiond from "@/app/components/detail/Accordiond";

import ReviewItem_mini from "./ReviewItem_mini";
import VideoList from "./VideoList";
import LinkPreview from "./LinkPreview";

interface Speaker {
  id: string;
  name: string;
  profile_image?: string;
  gallery_images?: string;
  short_desc?: string;
  full_desc?: string;
  intro_video?: string[];
  intro_book?: string[];
  reviews?: string[];
  career?: string;
  tags?: string[];
}

interface ReviewItemProps {
  reviews: any[];
}

export default function InformationTab({ reviews }: ReviewItemProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ size: [] }], // ✅ 크기 선택 UI
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "size", // ✅ 크기 포맷 저장
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [showAllBooks, setShowAllBooks] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchSpeaker = async () => {
      const { data, error } = await supabase.from("speakers").select("*").eq("id", id).single();

      if (error) {
        // console.error("Supabase fetch error:", error);
        return;
      }

      // console.log("받아온 데이터:", data);
      setSpeaker(data as Speaker);
    };

    fetchSpeaker();
  }, [id]);

  return (
    <div className="bg-slate-100">
      <div className="flex flex-col gap-10 py-10 max-w-[1440px] w-full mx-auto px-2">
        <section className="flex flex-col py-6 px-4 md:p-10 bg-white rounded-lg border">
          <h2 className="font-bold text-xl md:text-2xl mb-2">{speaker?.name}님을 소개합니다!</h2>
          <div className="flex gap-6">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: speaker?.full_desc || "" }} />
          </div>
        </section>

        <section className="flex flex-col  py-6 px-4 md:p-10 border bg-white rounded-lg">
          <h2 className="font-bold text-xl md:text-2xl">소개영상</h2>
          <p>{speaker?.name}님의 영상 포트폴리오입니다!</p>
          {Array.isArray(speaker?.intro_video) &&
            speaker!.intro_video.map((video, index) => (
              <div className=" my-4" key={index}>
                <VideoList url={video} title={speaker?.name || "소개 영상"} />
              </div>
            ))}
        </section>

        {speaker?.intro_book && speaker.intro_book.length > 0 ? (
          <section className="flex flex-col py-6 px-4 md:p-10 border bg-white rounded-lg">
            <h2 className="font-bold text-xl md:text-2xl">책</h2>
            <p className="mb-4">집필한 책을 확인해보세요</p>
            <div className="md:block hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {(showAllBooks ? speaker.intro_book : speaker.intro_book.slice(0, 3)).map((item, index) => (
                  <LinkPreview key={index} url={item} />
                ))}
              </div>

              {speaker.intro_book.length > 3 && (
                <button onClick={() => setShowAllBooks(!showAllBooks)} className="mt-6 self-center text-sm text-blue-500  w-full p-8 shadow-md rounded-lg border">
                  {showAllBooks ? "접기" : "더보기"}
                </button>
              )}
            </div>
            <div className="block md:hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {(showAllBooks ? speaker.intro_book : speaker.intro_book.slice(0, 2)).map((item, index) => (
                  <LinkPreview key={index} url={item} />
                ))}
              </div>

              {speaker.intro_book.length > 2 && (
                <button onClick={() => setShowAllBooks(!showAllBooks)} className="mt-6 self-center text-sm text-blue-500  w-full p-6 shadow-md rounded-lg border ">
                  {showAllBooks ? "접기" : "더보기"}
                </button>
              )}
            </div>
          </section>
        ) : null}

        {speaker?.reviews ? (
          <section className="flex flex-col  py-6 px-4 md:p-10 border bg-white rounded-lg">
            <h2 className="font-bold text-xl md:text-2xl">행사 진행 리뷰</h2>
            <p>고객분들의 만족도를 한눈에 봐요!</p>
            <ReviewItem_mini reviews={reviews} />
          </section>
        ) : null}

        {speaker?.career ? (
          <section className="flex flex-col  py-6 px-4 md:p-10 border bg-white rounded-lg">
            <h2 className="font-bold text-xl md:text-2xl">프로필</h2>
            <p>활동기록을 확인해보세요!</p>
            <div className="mt-4">
              <p className="whitespace-pre-line">{speaker?.career}</p>
            </div>
          </section>
        ) : null}

        <section className="flex flex-col mb-10 md:mb-20  py-6 px-4 md:p-10 border bg-white rounded-lg">
          <h2 className="font-bold text-xl md:text-2xl">자주묻는질문</h2>
          <p>전문가님께 자주묻는 질문을 모아놨어요!</p>
          <div className="mt-4">
            <Accordiond />
          </div>
        </section>
      </div>
    </div>
  );
}
