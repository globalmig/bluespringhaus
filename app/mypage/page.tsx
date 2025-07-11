"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { Inquiry } from "@/types/inquiry";
import axios from "axios";
import CardList from "../components/common/CardList";

export default function Mypage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

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

          const all = [
            ...(res.data.inquiries || []).map((i: any) => ({ ...i, type: "speaker" })),
            ...(res.data.artistInquiries || []).map((i: any) => ({ ...i, type: "artist" })),
          ];
          setInquiries(all);
        } catch (error) {
          console.error("❌ API 호출 에러:", error);
          alert("잠시후 다시 이용해주세요");
        }
      };

      fetchInquiries();
    }
  }, [user]);

  const pendingInquiries = inquiries.filter((inq) => inq.status === null);
  const acceptedInquiries = inquiries.filter((inq) => inq.status === "accepted");
  const rejectedInquiries = inquiries.filter((inq) => inq.status === "rejected");

  const getProfileData = (inq: any) => (inq.type === "artist" ? inq.artists : inq.speakers);

  return (
    <div className="mx-4 mt-10 pb-40 gap-14 flex flex-col">
      <h1 className="text-center text-3xl mb-2 font-bold">마이페이지</h1>

      <section className="bg-white rounded-lg p-10">
        {acceptedInquiries.length > 0 ? (
          <CardList slides={acceptedInquiries.map(getProfileData)} title="수락된 문의" />
        ) : (
          <p>수락된 문의 내역이 없습니다.</p>
        )}
      </section>

      <section className="bg-white rounded-lg p-10">
        {pendingInquiries.length > 0 ? (
          <CardList slides={pendingInquiries.map(getProfileData)} title="진행중인 문의" />
        ) : (
          <p>진행중인 문의 내역이 없습니다.</p>
        )}
      </section>

      <section className="bg-white rounded-lg p-10">
        {rejectedInquiries.length > 0 ? (
          <CardList slides={rejectedInquiries.map(getProfileData)} title="거절된 문의" />
        ) : (
          <p>거절된 문의 내역이 없습니다.</p>
        )}
      </section>
    </div>
  );
}
