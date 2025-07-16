"use client";
import React, { useEffect, useState } from "react";

import HeroSlider from "@/app/components/detail/HeroSlider";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import type { Artists } from "@/types/inquiry";
import Tab_artist from "@/app/components/detail/Tab_artist";
import Book_artist from "@/app/components/detail/Book_artist";

export default function SpeakerDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [artists, setArtists] = useState<Artists | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchArtist = async () => {
      const { data, error } = await supabase.from("artists").select("*").eq("id", id).single();

      if (error) {
        console.error("Supabase fetch error:", error);
        return;
      }

      if (data) {
        console.log("받아온 데이터:", data);
        setArtists(data as Artists);
        fetchReviews(Number(data.id)); // reviews 불러오기
      }
    };

    const fetchReviews = async (artistId: number) => {
      const { data, error } = await supabase.from("reviews_artist").select("*").eq("artist_id", artistId).order("created_at", { ascending: false });

      if (error) {
        console.error("리뷰 불러오기 실패:", error);
      } else {
        console.log("리뷰 데이터:", data);
        setReviews(data);
      }
    };

    fetchArtist();
  }, [id]);
  return (
    <div>
      <div className="gap-14 flex flex-col w-full max-w-[1440px] mx-auto">
        {/* <div className="bg-black w-full max-w-[1440px] h-[600px]"></div> */}
        <HeroSlider gallery_images={artists?.gallery_images} />
        <h1 className="text-4xl font-bold"> {artists ? `Artist ${artists.name}` : ""}</h1>

        <div className="flex flex-wrap gap-2 mb-2">
          {artists?.tags.map((t) => (
            <span key={t} className="bg-black text-white rounded-full px-3 py-1 text-sm">
              #{t}
            </span>
          ))}
        </div>

        {artists ? <Tab_artist total={reviews.length} reviews={reviews} artist={artists} /> : <p>아티스트 정보를 불러오는 중입니다...</p>}
      </div>
      {artists?.id && <Book_artist id={artists.id} />}
    </div>
  );
}
