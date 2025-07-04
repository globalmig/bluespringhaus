"use client";
import React, { useEffect } from "react";
import CardItem from "../components/common/CardItem";
import ProgressItem from "../components/mypage/ProgressItem";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

// TODO: 추후 API 연결

const progressText = [
  { icon: "", title: "시작", sub: "문의완료" },
  { icon: "", title: "확인", sub: "확" },
  { icon: "", title: "완료", sub: "메일 확인해주세요!" },
];

export default function mypage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // 시작 화면으로 리다이렉트
    }
  }, [user, loading, router]);

  return (
    <div className="mx-4 mt-10 pb-40 gap-14 flex flex-col">
      <h1 className="text-center text-3xl mb-2 font-bold">마이페이지</h1>
      {/* 진행사항, 수정 섹션 */}
      <section className="w-full mx-auto gap-10 flex h-[360px] ">
        <div className="progress w-[80%] rounded-2xl border bg-white">
          <div className="textBox flex gap-4 w-full h-[40%] justify-center items-center ">
            <span>문의하신</span>
            {/* 강사이름 드롭다운 */}
            <span>현재 진행 상황을 확인해보세요!</span>
          </div>

          <div className="progressbar w-full h-[60%] flex justify-between items-center ">
            <div className="baseBg w-[80%] h-7 bg-slate-200 rounded-full mx-auto ">
              <div className="baseBg w-[80%] h-7 bg-slate-200 rounded-full mx-auto "></div>
              <div className="flex w-full justify-between">
                {progressText.map((item) => (
                  <ProgressItem title={item.title} sub={item.sub} icon={undefined} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="edit w-[20%]  rounded-2xl border bg-white">
          <div className="flex flex-col gap-4 w-full h-full px-10">https://bluespringhaus-rbt5.vercel.app/
            <button className="border-b w-full py-10">회원정보 수정 {">"}</button>
            {/* TODO: user 예약 신청 데이터 연결 */}
            <button className="border-b w-full py-10">예약 신청 {">"}</button>
            <p>답변 완료</p>
          </div>
        </div>
      </section>

      {/* 문의 답변 섹션
      <section className="bg-white rounded-lg p-10">
        <CardItem slides={mockData} />
      </section> */}

      {/* 문의 신청한 리스트 섹션
      <section className="bg-white rounded-lg p-10">
        <CardItem slides={mockData} />
      </section> */}

      {/* 문의 답변 섹션  TODO: 후순위*/}
      {/* <CardList slides={[]} title={"이전 문의 내역"} sub={"이전에 문의하신 연사분들을 확인해보세요!"} /> */}
    </div>
  );
}
