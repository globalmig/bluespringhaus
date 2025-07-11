"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { Inquiry } from "@/types/inquiry";
import axios from "axios";
import ProgressItem from "../components/mypage/ProgressItem";
import CardList from "../components/common/CardList";

const progressText = [
  { icon: "", title: "시작", sub: "문의완료" },
  { icon: "", title: "확인", sub: "확" },
  { icon: "", title: "완료", sub: "메일 확인해주세요!" },
];

export default function Mypage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // 로그인 확인
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // 문의 내역 불러오기
  useEffect(() => {
    if (user) {
      const fetchInquiries = async () => {
        try {
          const res = await axios.get("/api/inquiry"); // ✅ 헤더 없이 쿠키 인증
          setInquiries(res.data.inquiries);
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

  return (
    <div className="mx-4 mt-10 pb-40 gap-14 flex flex-col">
      <h1 className="text-center text-3xl mb-2 font-bold">마이페이지</h1>

      <section className="bg-white rounded-lg p-10">
        {acceptedInquiries.length > 0 ? <CardList slides={acceptedInquiries.map((inq) => inq.speakers)} title="수락된 문의" /> : <p>수락된 문의 내역이 없습니다.</p>}
      </section>

      <section className="bg-white rounded-lg p-10">
        {pendingInquiries.length > 0 ? <CardList slides={pendingInquiries.map((inq) => inq.speakers)} title="진행중인 문의" /> : <p>진행중인 문의 내역이 없습니다.</p>}
      </section>

      <section className="bg-white rounded-lg p-10">
        {rejectedInquiries.length > 0 ? <CardList slides={rejectedInquiries.map((inq) => inq.speakers)} title="거절된 문의" /> : <p>거절된 문의 내역이 없습니다.</p>}
      </section>
    </div>
  );
}
