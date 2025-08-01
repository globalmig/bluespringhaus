"use client";
import React, { useEffect, useState } from "react";

import HeroSlider from "@/app/components/detail/HeroSlider";
import Book from "@/app/components/detail/Book";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import Tab from "@/app/components/detail/Tab";
import { Speaker } from "lucide-react";

interface Speaker {
  id: string;
  name: string;
  profile_image: string[];
  gallery_images: string[];
  short_desc: string;
  full_desc: string;
  intro_video: string[];
  reviews: string[];
  career: string;
  tags: string[];
}

export default function SpeakerDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchSpeaker = async () => {
      const { data, error } = await supabase.from("speakers").select("*").eq("id", id).single();

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      if (data) {
        console.log("받아온 데이터:", data);
        setSpeaker(data as Speaker);
        fetchReviews(Number(data.id)); // reviews 불러오기
      }
    };

    const fetchReviews = async (speakerId: number) => {
      const { data, error } = await supabase.from("reviews").select("*").eq("speaker_id", speakerId).order("created_at", { ascending: false });

      if (error) {
        console.error("리뷰 불러오기 실패:", error);
      } else {
        console.log("리뷰 데이터:", data);
        setReviews(data);
      }
    };

    fetchSpeaker();
  }, [id]);
  return (
    <div>
      <div className="flex flex-col w-full mx-auto">
        {/* <div className="bg-black w-full max-w-[1440px] h-[600px]"></div> */}
        <div className="w-full mx-auto max-w-[1440px]">
          <HeroSlider gallery_images={speaker?.gallery_images} />
          <div className="min-h-80 ">
            <h1 className="text-4xl font-bold mt-16 px-4"> {speaker ? `${speaker.name}` : ""}</h1>
            <p className="px-4 my-6">{speaker?.short_desc}</p>
            <div className="flex flex-wrap gap-2 my-10 px-4">
              {speaker?.tags.map((t) => (
                <span key={t} className="border text-black/70 rounded-full px-3 py-1 text-sm">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
        {speaker && <Tab total={reviews.length} reviews={reviews} id={speaker.id} />}
      </div>
      {speaker?.id && <Book id={speaker.id} />}
    </div>
  );
}
