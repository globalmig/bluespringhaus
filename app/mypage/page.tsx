"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { Inquiry } from "@/types/inquiry";
import axios from "axios";
import { supabase } from "@/lib/supabase";
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

  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // 로그인 안된 경우 홈으로 리다이렉트
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchInquiries = async () => {
        const { data: session } = await supabase.auth.getSession();

        if (!session?.session?.access_token) {
          console.error("로그인 정보 없음");
          return;
        }

        axios
          .get("/api/inquiry", {
            headers: {
              Authorization: `Bearer ${session.session.access_token}`,
            },
          })
          .then((response) => {
            // console.log(response.data);
            setInquiries(response.data.inquiries);
          })
          .catch((error) => {
            alert("잠시후 다시 이용해주세요");
            console.error("❌ API 호출 에러:", error);
          });
      };

      fetchInquiries();
    }
  }, [user]);

  // inquiry 상태값에 따른 필터처리
  const pendingInquiries = inquiries.filter((inq) => inq.status === null);
  const acceptedInquiries = inquiries.filter((inq) => inq.status === "accepted");
  const rejectedInquiries = inquiries.filter((inq) => inq.status === "rejected");

  return (
    <div className="mx-4 mt-10 pb-40 gap-14 flex flex-col">
      <h1 className="text-center text-3xl mb-2 font-bold">마이페이지</h1>

      {/* <section className="w-full mx-auto gap-10 flex h-[360px]">
        <div className="progress w-[80%] rounded-2xl border bg-white">
          <div className="textBox flex gap-4 w-full h-[40%] justify-center items-center">
            <span>문의하신</span>
            <span>현재 진행 상황을 확인해보세요!</span>
          </div>
          <div className="progressbar w-full h-[60%] flex justify-between items-center">
            <div className="baseBg w-[80%] h-7 bg-slate-200 rounded-full mx-auto">
              <div className="baseBg w-[80%] h-7 bg-slate-200 rounded-full mx-auto"></div>
              <div className="flex w-full justify-between">
                {progressText.map((item, index) => (
                  <ProgressItem key={index} title={item.title} sub={item.sub} icon={undefined} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="edit w-[20%] rounded-2xl border bg-white">
          <div className="flex flex-col gap-4 w-full h-full px-10">
            <button className="border-b w-full py-10">회원정보 수정 {">"}</button>
            <button className="border-b w-full py-10">문의 리스트 {">"}</button>
            <p>답변 완료</p>
          </div>
        </div>
      </section> */}

      <section className="bg-white rounded-lg p-10">
        {acceptedInquiries.length > 0 ? <CardList slides={acceptedInquiries.map((inq) => inq.speakers)} title="수락된 문의" /> : <p>수락된 문의 내역이 없습니다.</p>}
      </section>

      <section className="bg-white rounded-lg p-10">
        {pendingInquiries.length > 0 ? <CardList slides={pendingInquiries.map((inq) => inq.speakers)} title="진행중인 문의" /> : <p>진행중인 문의 내역이 없습니다.</p>}
      </section>

      <section className="bg-white rounded-lg p-10">
        {rejectedInquiries.length > 0 ? <CardList slides={rejectedInquiries.map((inq) => inq.speakers)} title="거절된 문의" /> : <p>거절된 문의 내역이 없습니다.</p>}
      </section>

      {/* 문의 신청한 리스트 섹션
      <section className="bg-white rounded-lg p-10">
        <CardItem slides={mockData} />
      </section> */}

      {/* 문의 답변 섹션  TODO: 후순위*/}
      {/* <CardList slides={[]} title={"이전 문의 내역"} sub={"이전에 문의하신 연사분들을 확인해보세요!"} /> */}
    </div>
  );
}
