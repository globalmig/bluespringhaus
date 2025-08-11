// components/search/searchOptions.tsx
import type { ReactNode } from "react";

import { MdOutlineBusinessCenter, MdPeopleOutline, MdNightlife } from "react-icons/md";
import { LiaFireSolid } from "react-icons/lia";
import { IoBookOutline, IoBusinessOutline } from "react-icons/io5";
import { TbPigMoney } from "react-icons/tb";
import { FaRegStar, FaPlaneDeparture } from "react-icons/fa";
import { GiDrumKit } from "react-icons/gi";
import { MdOutlineFestival } from "react-icons/md";
import { LuMusic } from "react-icons/lu";
import { LuYoutube } from "react-icons/lu";
import { IoIosPhonePortrait } from "react-icons/io";
import {
  FaGuitar,
  FaMicrophoneAlt,
  FaFire,
  FaHeadphones,
  FaMusic,
  FaDrum,
  FaCompactDisc,
  FaGuitar as FaAcoustic,
  FaStar,
  FaRegPlayCircle,
  FaTiktok,
  FaInstagram,
  FaRegNewspaper,
  FaRegUserCircle,
} from "react-icons/fa";
import { GiMicrophone, GiMusicalNotes, GiGuitarBassHead, GiTrumpet, GiPianoKeys } from "react-icons/gi";
import { MdMusicNote, MdOndemandVideo, MdOutlineMicExternalOn, MdPeople, MdVideocam } from "react-icons/md";
import { BiMicrophone, BiUserVoice } from "react-icons/bi";
import { RiVoiceprintFill } from "react-icons/ri";
import { AiOutlineGlobal, AiFillYoutube, AiOutlineInstagram } from "react-icons/ai";
import { FaMoneyBillWave, FaMoneyCheckAlt, FaTrophy, FaCrown } from "react-icons/fa";

type RecommendOption = {
  title: string;
  subTitle: string;
  bgClass: string; // Tailwind bg class
  icon: ReactNode; // JSX 아이콘
};

type CategoryOption = {
  label: string; // 표시용
  value: string; // 쿼리용
  desc: string;
  bgClass: string;
  icon: ReactNode; // JSX 아이콘
};

type BudgetOption = { label: string; icon: ReactNode; bgClass: string };

export type SearchConfig = {
  recommendOptions: RecommendOption[];
  categoryOptions: CategoryOption[];
  budgetOptions: BudgetOption[];
};

// 공통 예산
const commonBudget: BudgetOption[] = [
  { label: "~300만원", bgClass: "bg-[#E6FAF5]", icon: <FaMoneyBillWave className="w-full h-full" color="#84dbc6" /> },
  { label: "300~500만원", bgClass: "bg-[#e6f2fd]", icon: <FaMoneyCheckAlt className="w-full h-full" color="#87baec" /> },
  { label: "500~1000만원", bgClass: "bg-[#FFE4E1]", icon: <FaTrophy className="w-full h-full" color="#ec8977" /> },
  { label: "1000만원 이상", bgClass: "bg-[#FFFDE6]", icon: <FaCrown className="w-full h-full" color="#e0d665" /> },
];

export const SEARCH_OPTIONS: Record<"speaker" | "artist", SearchConfig> = {
  speaker: {
    recommendOptions: [
      { title: "강연가", subTitle: "청중에게 메시지를 전하는 사람", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
      { title: "글로벌 스피커", subTitle: "국제 무대에서 활동하는 연사", bgClass: "bg-[#e6f2fd]", icon: <AiOutlineGlobal color="#87baec" className="w-full h-full" /> },
      { title: "비즈니스 연사", subTitle: "기업·경영·마케팅 전문 강연자", bgClass: "bg-[#E6FAF5]", icon: <MdOutlineBusinessCenter color="#84dbc6" className="w-full h-full" /> },
      { title: "인사이트 메이커", subTitle: "영감을 주는 강연 전문가", bgClass: "bg-[#F3E8FF]", icon: <LiaFireSolid color="#b787eb" className="w-full h-full" /> },
      { title: "네트워크 연사", subTitle: "사람과 사람을 연결하는 발표자", bgClass: "bg-[#FFFDE6]", icon: <MdPeopleOutline color="#e0d665" className="w-full h-full" /> },
    ],
    categoryOptions: [
      { label: "인문 & 철학", value: "humanities", desc: "인문학, 철학 등", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
      { label: "경제 & 경영", value: "economy", desc: "경제, 투자, 주식 등", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
      { label: "비즈니스 & 커리어", value: "business", desc: "경영전략, 리더십 등", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
      { label: "트렌드 & 미래", value: "trend", desc: "테크트렌드, 소비트렌드 등", bgClass: "bg-[#FFFDE6]", icon: <FaRegStar color="#e0d665" className="w-full h-full" /> },
      { label: "자기계발 & 마인드셋", value: "mindset", desc: "동기부여, 습관 & 루틴 등", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
      { label: "라이프 & 웰빙", value: "wellbeing", desc: "명상, 마음챙김 등", bgClass: "bg-[#E6FAF5]", icon: <MdNightlife color="#84dbc6" className="w-full h-full" /> },
      { label: "문화 & 사회", value: "culture", desc: "문화예술, 교육, 사회문제 등", bgClass: "bg-[#e6f2fd]", icon: <FaPlaneDeparture color="#87baec" className="w-full h-full" /> },
      { label: "글로벌", value: "global", desc: "국제정세, 해외 시장 진출 등", bgClass: "bg-[#E6FAF5]", icon: <AiOutlineGlobal color="#84dbc6" className="w-full h-full" /> },
    ],
    budgetOptions: commonBudget,
  },

  // artist
  artist: {
    recommendOptions: [
      { title: "지금 인기있는 아티스트", subTitle: "대중이 주목하는 핫스타", bgClass: "bg-[#FFE4E1]", icon: <LiaFireSolid color="#eb8787" className="w-full h-full" /> },
      { title: "밴드아티스트", subTitle: "에너지 넘치는 밴드 사운드", bgClass: "bg-[#F3E8FF]", icon: <GiDrumKit color="#b787eb" className="w-full h-full" /> },
      { title: "대학축제 일순위 아티스트", subTitle: "무대를 휘어잡는 축제 강자", bgClass: "bg-[#FFFDE6]", icon: <MdOutlineFestival color="#e0d665" className="w-full h-full" /> },
      { title: "트로트 아티스트", subTitle: "흥과 정이 넘치는 무대", bgClass: "bg-[#FFE4E1]", icon: <LuMusic color="#eb8787" className="w-full h-full" /> },
      { title: "세상을 움직이는 유튜버", subTitle: "콘텐츠로 세상을 바꾸는 크리에이터", bgClass: "bg-[#F3E8FF]", icon: <LuYoutube color="#c094ee" className="w-full h-full" /> },
    ],
    categoryOptions: [
      { label: "인디", value: "indie", desc: "진심을 노래하는 감성 음악", bgClass: "bg-[#FFE4E1]", icon: <FaGuitar color="#ec8977" className="w-full h-full" /> },
      { label: "발라드", value: "ballad", desc: "감성을 자극하는 감미로운 목소리", bgClass: "bg-[#e6f2fd]", icon: <FaMicrophoneAlt color="#87baec" className="w-full h-full" /> },
      { label: "힙합", value: "hiphop", desc: "거침없는 플로우, 리듬 위의 메시지", bgClass: "bg-[#E6FAF5]", icon: <FaFire color="#84dbc6" className="w-full h-full" /> },
      { label: "R&B", value: "rnb", desc: "감미롭고 리드미컬한 소울 음악", bgClass: "bg-[#F3E8FF]", icon: <FaHeadphones color="#b787eb" className="w-full h-full" /> },
      { label: "트로트", value: "trot", desc: "흥과 정이 넘치는 대중가요", bgClass: "bg-[#FFFDE6]", icon: <FaMusic color="#e0d665" className="w-full h-full" /> },
      { label: "락/밴드", value: "rock_band", desc: "에너지 넘치는 밴드 사운드", bgClass: "bg-[#FFE4E1]", icon: <FaDrum color="#ec8977" className="w-full h-full" /> },
      { label: "재즈", value: "jazz", desc: "즉흥과 세련미가 어우러진 음악", bgClass: "bg-[#e6f2fd]", icon: <IoIosPhonePortrait color="#87baec" className="w-full h-full" /> },
      { label: "EDM", value: "edm", desc: "클럽을 뜨겁게 만드는 전자음악", bgClass: "bg-[#E6FAF5]", icon: <FaCompactDisc color="#84dbc6" className="w-full h-full" /> },
      { label: "클래식", value: "classical", desc: "시대를 초월한 명곡의 향연", bgClass: "bg-[#F3E8FF]", icon: <LuMusic color="#b787eb" className="w-full h-full" /> },
      { label: "어쿠스틱", value: "acoustic", desc: "따뜻한 소리로 전하는 감성", bgClass: "bg-[#FFFDE6]", icon: <GiGuitarBassHead color="#e0d665" className="w-full h-full" /> },
      { label: "아이돌", value: "idol", desc: "전 세계를 사로잡은 K-POP 스타", bgClass: "bg-[#FFE4E1]", icon: <FaStar color="#ec8977" className="w-full h-full" /> },
      { label: "댄스", value: "dance", desc: "무대를 압도하는 퍼포먼스", bgClass: "bg-[#e6f2fd]", icon: <MdPeople color="#87baec" className="w-full h-full" /> },
      { label: "방송인", value: "broadcaster", desc: "화면 속 에너지를 전하는 사람들", bgClass: "bg-[#E6FAF5]", icon: <MdOndemandVideo color="#84dbc6" className="w-full h-full" /> },
      { label: "MC", value: "mc", desc: "행사의 중심을 잡는 진행 전문가", bgClass: "bg-[#F3E8FF]", icon: <BiMicrophone color="#b787eb" className="w-full h-full" /> },
      { label: "아나운서", value: "announcer", desc: "신뢰감 있는 전달의 목소리", bgClass: "bg-[#FFFDE6]", icon: <FaRegNewspaper color="#e0d665" className="w-full h-full" /> },
      { label: "성우", value: "voice_actor", desc: "목소리로 연기하는 배우", bgClass: "bg-[#FFE4E1]", icon: <BiUserVoice color="#ec8977" className="w-full h-full" /> },
      { label: "유튜버", value: "youtuber", desc: "콘텐츠로 세상을 이끄는 크리에이터", bgClass: "bg-[#e6f2fd]", icon: <AiFillYoutube color="#87baec" className="w-full h-full" /> },
      { label: "틱톡커", value: "tiktoker", desc: "숏폼 영상의 트렌드 리더", bgClass: "bg-[#E6FAF5]", icon: <FaTiktok color="#84dbc6" className="w-full h-full" /> },
      { label: "인플루언서", value: "influencer", desc: "영향력을 가진 SNS 스타", bgClass: "bg-[#F3E8FF]", icon: <AiOutlineInstagram color="#b787eb" className="w-full h-full" /> },
    ],

    budgetOptions: commonBudget,
  },
};
