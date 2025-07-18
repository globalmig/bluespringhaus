"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { Inquiry, Speaker, Artists } from "@/types/inquiry";
import axios from "axios";
import CardList from "../components/common/CardList";

// ✅ 확장 타입 정의
type InquiryWithType = Inquiry & {
  type: "artist" | "speaker";
  artists?: Artists[];
  speakers?: Speaker[];
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
          alert("잠시후 다시 이용해주세요");
        } finally {
          setIsLoading(false);
        }
      };

      fetchInquiries();
    }
  }, [user]);

  const pendingInquiries = inquiries.filter((inq) => inq.status === null || inq.status === "in_progress");
  const acceptedInquiries = inquiries.filter((inq) => inq.status === "accepted");
  const rejectedInquiries = inquiries.filter((inq) => inq.status === "rejected");

  // ✅ artists/speakers가 undefined일 경우 대비
  const getProfileData = (inq: InquiryWithType): (Speaker | Artists)[] => (inq.type === "artist" ? inq.artists ?? [] : inq.speakers ?? []);

  const inquirySections = [
    { title: "섭외 성공! 메일을 확인해주세요🎉", data: acceptedInquiries },
    { title: "섭외를 고민중이세요", data: pendingInquiries },
    { title: "이번엔 인연이 아니었어요 😥", data: rejectedInquiries },
  ];

  return (
    <div className="mt-10 pb-40 gap-14 flex flex-col w-full">
      <h1 className="text-start text-3xl mb-2 font-bold w-full max-w-[1440px] mx-auto px-4">마이페이지</h1>

      {isLoading ? (
        <div className="w-full mx-auto min-h-screen flex justify-center items-start pt-20">
          <p>잠시만 기다려주세요. 문의 내역을 확인 중입니다.</p>
        </div>
      ) : (
        <>
          {inquirySections.map(({ title, data }) => (
            <section key={title} className="bg-white rounded-lg w-full max-w-[1440px] mx-auto">
              {data.length > 0 ? (
                <CardList slides={data.flatMap(getProfileData)} title={title} />
              ) : (
                <div className="flex flex-col pb-20 border-b">
                  <h2 className="text-lg md:text-2xl font-bold my-5 transform duration-300 ease-in-out ">{title}</h2>
                  <p className="mt-10">아직 소식이 없습니다.</p>
                </div>
              )}
            </section>
          ))}
        </>
      )}
    </div>
  );
}
