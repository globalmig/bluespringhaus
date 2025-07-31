"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { Inquiry, Speaker, Artists } from "@/types/inquiry";
import axios from "axios";
import CardList from "../components/common/CardList";
import RejectItem from "../components/mypage/RejectItem";

type InquiryWithType = Inquiry & {
  type: "speaker" | "artist";
  artists?: Artists[] | Artists;
  speakers?: Speaker[] | Speaker;
};

export default function Mypage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<InquiryWithType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchInquiries = async () => {
        try {
          const res = await axios.get("/api/inquiry");

          const all = [...(res.data.inquiries || []).map((i: any) => ({ ...i, type: "speaker" })), ...(res.data.artistInquiries || []).map((i: any) => ({ ...i, type: "artist" }))];

          setInquiries(all);
        } catch (error) {
          console.error("❌ API 호출 에러:", error);
          alert("잠시 후 다시 이용해주세요.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchInquiries();
    }
  }, [user]);

  const getProfileData = (inq: InquiryWithType): (Speaker | Artists)[] => {
    const data = inq.type === "artist" ? inq.artists : inq.speakers;
    if (Array.isArray(data)) return data;
    if (data) return [data];
    return [];
  };

  const getRejectSlides = (list: InquiryWithType[]) => {
    return list.flatMap((inq) => {
      const profiles = getProfileData(inq);
      return profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        profile_image: profile.profile_image,
        short_desc: profile.short_desc,
        tags: profile.tags,
        reason: inq.reason,
        type: inq.type,
      }));
    });
  };

  const splitByType = (list: InquiryWithType[]) => ({
    speakers: list.filter((inq) => inq.type === "speaker"),
    artists: list.filter((inq) => inq.type === "artist"),
  });

  const pendingInquiries = inquiries.filter((inq) => inq.status === null || inq.status === "in_progress");
  const acceptedInquiries = inquiries.filter((inq) => inq.status === "accepted");
  const rejectedInquiries = inquiries.filter((inq) => inq.status === "rejected");

  const rejectedSplit = splitByType(rejectedInquiries);

  const renderSection = (title: string, list: InquiryWithType[]) => {
    const { speakers, artists } = splitByType(list);

    return (
      <section key={title} className="bg-white rounded-lg w-full max-w-[1440px] mx-auto">
        <div>
          {speakers.length > 0 && <CardList slides={speakers.flatMap(getProfileData)} title={`SPEAKER가 ${title}`} type="speaker" />}
          {artists.length > 0 && <CardList slides={artists.flatMap(getProfileData)} title={`ARTIST가 ${title}`} type="artist" />}
        </div>

        {speakers.length === 0 && artists.length === 0 && (
          <div className="flex flex-col pb-20 border-b">
            <h2 className="text-lg md:text-2xl font-bold my-5">{title}</h2>
            <p className="mt-10">아직 소식이 없습니다.</p>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="mt-10 pb-40 gap-4 flex flex-col w-full max-w-[1440px] mx-auto">
      <h1 className="text-center text-3xl md:text-4xl font-bold w-full max-w-[1440px] px-4">진행상황</h1>
      <p className="px-4 text-center text-sm">섭외 문의 진행상황을 확인해보실 수 있습니다.</p>
      {isLoading ? (
        <div className="w-full mx-auto min-h-screen flex justify-center items-start pt-20">
          <p>잠시만 기다려주세요. 문의 내역을 확인 중입니다.</p>
        </div>
      ) : (
        <>
          {renderSection("섭외 성공! 메일을 확인해주세요🎉", acceptedInquiries)}
          {renderSection("섭외를 고민중이세요", pendingInquiries)}

          {rejectedSplit.artists.length > 0 && <RejectItem slides={getRejectSlides(rejectedSplit.artists)} title="아쉽게 거절하셨어요 😥 (ARTIST)" type="artist" />}

          {rejectedSplit.speakers.length > 0 && <RejectItem slides={getRejectSlides(rejectedSplit.speakers)} title="아쉽게 거절하셨어요 😥 (SPEAKER)" type="speaker" />}
        </>
      )}
    </div>
  );
}
