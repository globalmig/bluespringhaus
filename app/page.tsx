"use client";
import { useEffect, useState } from "react";
import CardItem from "./components/common/CardItem";
import HeroSlider from "./components/detail/HeroSlider";
import Search2 from "./components/common/Search2";

// TODO: 추후 API 연결
// const mockData = [
//   {
//     id: 1,
//     name: "김은하",
//     desc: "IT 스타트업 창업가 / UX 전문가",
//     tag: ["리더십", "I윤리"],
//     image: "/images/speaker01.jpg",
//   },
//   {
//     id: 2,
//     name: "박지훈",
//     desc: "청소년 심리상담사 / 강연 200회 이상",
//     tag: ["리더십", "AI윤리"],
//     image: "/images/speaker02.jpg",
//   },
//   {
//     id: 3,
//     name: "이유정",
//     desc: "전직 아나운서 / 커뮤니케이션 코치",
//     tag: ["리더십", "AI윤리"],
//     image: "/images/speaker03.jpg",
//   },
//   {
//     id: 4,
//     name: "최민수",
//     desc: "전직 프로게이머 / 게임 리더십 전문가",
//     tag: ["리더십", "AI윤리"],
//     image: "/images/speaker04.jpg",
//   },
//   {
//     id: 5,
//     name: "홍다은",
//     desc: "비영리단체 활동가 / 환경 교육 강사",
//     tag: ["지속가능성", "AI윤리"],
//     image: "/images/speaker05.jpg",
//   },
//   {
//     id: 6,
//     name: "정재형",
//     desc: "인공지능 연구원 / AI 윤리 강연자",
//     tag: ["해외취업", "AI윤리"],
//     image: "/images/speaker06.jpg",
//   },
//   {
//     id: 7,
//     name: "서윤지",
//     desc: "디지털 노마드 / 글로벌 커리어 강연가",
//     tag: ["해외취업", "AI윤리", "리더십"],
//     image: "/images/speaker07.jpg",
//   },
//   {
//     id: 8,
//     name: "안도현",
//     desc: "작가 / 시인 / 창작 워크숍 진행",
//     tag: ["해외취업", "글쓰기"],
//     image: "/images/speaker08.jpg",
//   },
// ];
interface Speaker {
  id: string;
  name: string;
  profile_image: string;
  gallery_images: string;
  short_desc: string;
  full_desc: string;
  intro_video: string[];
  reviews: string[];
  career: string;
  tags: string[];
  email: string;
}

export default function Home() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    const fetchSpeakers = async () => {
      const res = await fetch("/api/speakers");
      if (!res.ok) {
        console.error("API 호출 실패!");
        return;
      }
      const data = await res.json();
      setSpeakers(data);
    };
    fetchSpeakers();
  }, []);
  return (
    <div className="w-full max-w-[1440px] justify-center items-center mx-auto">
      <div className="relative">
        <Search2 />

        {/* <div className="absolute top-80 left-1/2 transform -translate-x-1/2 w-full z-20 ">
          <Search />
        </div> */}
        {/* TODO: 중복 코드 수정 */}
        {/* TODO: 데이터 연결되게 수정 */}
        <div className="py-10 md:py-20">
          <CardItem slides={speakers} />
        </div>
      </div>
    </div>
  );
}
