"use client";
import React, { useEffect } from "react";
import CardItem from "../components/common/CardItem";
import ProgressItem from "../components/mypage/ProgressItem";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

// TODO: 추후 API 연결
const mockData = [
  {
    id: 1,
    name: "김은하",
    desc: "IT 스타트업 창업가 / UX 전문가",
    tag: ["리더십", "I윤리"],
    image: "/images/speaker01.jpg",
  },
  {
    id: 2,
    name: "박지훈",
    desc: "청소년 심리상담사 / 강연 200회 이상",
    tag: ["리더십", "AI윤리"],
    image: "/images/speaker02.jpg",
  },
  {
    id: 3,
    name: "이유정",
    desc: "전직 아나운서 / 커뮤니케이션 코치",
    tag: ["리더십", "AI윤리"],
    image: "/images/speaker03.jpg",
  },
  {
    id: 4,
    name: "최민수",
    desc: "전직 프로게이머 / 게임 리더십 전문가",
    tag: ["리더십", "AI윤리"],
    image: "/images/speaker04.jpg",
  },
  {
    id: 5,
    name: "홍다은",
    desc: "비영리단체 활동가 / 환경 교육 강사",
    tag: ["지속가능성", "AI윤리"],
    image: "/images/speaker05.jpg",
  },
  {
    id: 6,
    name: "정재형",
    desc: "인공지능 연구원 / AI 윤리 강연자",
    tag: ["해외취업", "AI윤리"],
    image: "/images/speaker06.jpg",
  },
  {
    id: 7,
    name: "서윤지",
    desc: "디지털 노마드 / 글로벌 커리어 강연가",
    tag: ["해외취업", "AI윤리", "리더십"],
    image: "/images/speaker07.jpg",
  },
  {
    id: 8,
    name: "안도현",
    desc: "작가 / 시인 / 창작 워크숍 진행",
    tag: ["해외취업", "글쓰기"],
    image: "/images/speaker08.jpg",
  },
];

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
    <div className="mx-4 mt-10 mb-40 gap-14 flex flex-col">
      <h1 className="text-center text-3xl mb-2">마이페이지</h1>
      {/* 진행사항, 수정 섹션 */}
      <section className="w-full mx-auto gap-10 flex h-[360px]">
        <div className="progress w-[80%] rounded-2xl border">
          <div className="textBox flex gap-4 w-full h-[40%] justify-center items-center ">
            <span>문의하신</span>
            {/* 강사이름 드롭다운 */}
            <span>현재 진행 상황을 확인해보세요!</span>
          </div>

          <div className="progressbar w-full h-[60%] flex justify-between items-center">
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
      
      
        <div className="edit w-[20%]  rounded-2xl border">
          <div className="flex flex-col gap-4 w-full h-full px-10">
            <button className="border-b w-full py-10">회원정보 수정 {">"}</button>
            {/* TODO: user 예약 신청 데이터 연결 */}
            <button className="border-b w-full py-10">예약 신청 {">"}</button>
            <p>답변 완료</p>
          </div>
        </div>
        
      </section>

      {/* 문의 답변 섹션 */}
      <section className="">
        <CardItem slides={mockData} />
      </section>

      {/* 문의 신청한 리스트 섹션 */}
      <section>
        <CardItem slides={mockData} />
      </section>

      {/* 문의 답변 섹션  TODO: 후순위*/}
      {/* <CardList slides={[]} title={"이전 문의 내역"} sub={"이전에 문의하신 연사분들을 확인해보세요!"} /> */}
    </div>
  );
}
