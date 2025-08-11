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
    // categoryOptions: [
    //   { label: "인문 & 철학", value: "humanities", desc: "인문학, 철학 등", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
    //   { label: "경제 & 경영", value: "economy", desc: "경제, 투자, 주식 등", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
    //   { label: "비즈니스 & 커리어", value: "business", desc: "경영전략, 리더십 등", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
    //   { label: "트렌드 & 미래", value: "trend", desc: "테크트렌드, 소비트렌드 등", bgClass: "bg-[#FFFDE6]", icon: <FaRegStar color="#e0d665" className="w-full h-full" /> },
    //   { label: "자기계발 & 마인드셋", value: "mindset", desc: "동기부여, 습관 & 루틴 등", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
    //   { label: "라이프 & 웰빙", value: "wellbeing", desc: "명상, 마음챙김 등", bgClass: "bg-[#E6FAF5]", icon: <MdNightlife color="#84dbc6" className="w-full h-full" /> },
    //   { label: "문화 & 사회", value: "culture", desc: "문화예술, 교육, 사회문제 등", bgClass: "bg-[#e6f2fd]", icon: <FaPlaneDeparture color="#87baec" className="w-full h-full" /> },
    //   { label: "글로벌", value: "global", desc: "국제정세, 해외 시장 진출 등", bgClass: "bg-[#E6FAF5]", icon: <AiOutlineGlobal color="#84dbc6" className="w-full h-full" /> },
    // ],
    categoryOptions: [
      { label: "인문 & 철학", value: "humanities", desc: "인문학,철학,심리학,문학...", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
      { label: "인문학", value: "인문학", desc: "인간·문화·역사를 다각도로 탐구", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
      { label: "철학", value: "철학", desc: "존재·인식·윤리를 사유하고 토론", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
      { label: "심리학", value: "심리학", desc: "마음과 행동의 메커니즘 이해", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
      { label: "문학", value: "문학", desc: "소설·시·에세이 읽기와 창작", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
      { label: "과학", value: "과학", desc: "자연·사회 현상의 체계적 이해", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
      { label: "역사", value: "역사", desc: "과거 사건·구조 해석과 현재 연결", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },
      { label: "종교", value: "종교", desc: "종교사·신학·영성의 이해", bgClass: "bg-[#e6f2fd]", icon: <IoBookOutline color="#87baec" className="w-full h-full" /> },

      { label: "경제 & 경영", value: "economy", desc: "경제,투자,주식,창업...", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
      { label: "경제", value: "경제", desc: "경제 구조·정책·시장 작동 원리", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
      { label: "투자", value: "투자", desc: "자산 배분·리스크 관리·운용 전략", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
      { label: "주식", value: "주식", desc: "종목 분석·포트폴리오·시장 대응", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
      { label: "창업", value: "창업", desc: "아이디어 검증·BM 설계·스케일업", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
      { label: "기업가정신", value: "기업가정신", desc: "문제 해결·혁신·주도적 실행", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
      { label: "협상", value: "협상", desc: "전략·심리·실전 협상 스킬", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },
      { label: "재테크", value: "재테크", desc: "개인 자산관리·세테크·지출 최적화", bgClass: "bg-[#E6FAF5]", icon: <TbPigMoney color="#84dbc6" className="w-full h-full" /> },

      { label: "비즈니스 & 커리어", value: "business", desc: "경영전략,리더십,퍼스널 브랜딩...", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
      { label: "경영전략", value: "경영전략", desc: "시장 분석·포지셔닝·실행 로드맵", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
      { label: "리더십", value: "리더십", desc: "팀 동기부여·의사결정·코칭", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
      { label: "퍼스널 브랜딩", value: "퍼스널 브랜딩", desc: "정체성 설계·콘텐츠·채널 운영", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
      { label: "마케팅", value: "마케팅", desc: "고객 인사이트·퍼널·캠페인", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
      { label: "조직문화", value: "조직문화", desc: "협업 규범·제도·성과 창출 환경", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
      { label: "브랜딩", value: "브랜딩", desc: "브랜드 자산·아이덴티티·스토리", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },
      { label: "팀워크", value: "팀워크", desc: "역할 분담·커뮤니케이션·갈등 해결", bgClass: "bg-[#F3E8FF]", icon: <IoBusinessOutline color="#b787eb" className="w-full h-full" /> },

      { label: "트렌드 & 미래", value: "trend", desc: "테크트렌드,소비트렌드,MZ세대...", bgClass: "bg-[#FFFDE6]", icon: <FaRegStar color="#e0d665" className="w-full h-full" /> },
      { label: "테크트렌드", value: "테크트렌드", desc: "신기술 동향·산업 영향·활용 사례", bgClass: "bg-[#FFFDE6]", icon: <FaRegStar color="#e0d665" className="w-full h-full" /> },
      { label: "소비트렌드", value: "소비트렌드", desc: "소비자 행동 변화·유통·콘텐츠 흐름", bgClass: "bg-[#FFFDE6]", icon: <FaRegStar color="#e0d665" className="w-full h-full" /> },
      { label: "MZ세대", value: "MZ세대", desc: "가치관·문화·소비 성향 이해", bgClass: "bg-[#FFFDE6]", icon: <FaRegStar color="#e0d665" className="w-full h-full" /> },
      { label: "인공지능", value: "인공지능", desc: "생성형 AI·데이터·윤리·업무 적용", bgClass: "bg-[#FFFDE6]", icon: <FaRegStar color="#e0d665" className="w-full h-full" /> },
      { label: "4차 산업", value: "4차 산업", desc: "IoT·로봇·스마트팩토리·DX", bgClass: "bg-[#FFFDE6]", icon: <FaRegStar color="#e0d665" className="w-full h-full" /> },

      { label: "자기계발 & 마인드셋", value: "mindset", desc: "동기부여,습관&루틴,성장 마인드셋...", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
      { label: "동기부여", value: "동기부여", desc: "행동 촉발과 유지 전략", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
      { label: "습관 & 루틴", value: "루틴", desc: "작은 행동 설계·습관화 프레임", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
      { label: "성장 마인드셋", value: "성장", desc: "학습·피드백·회복탄력성 기르기", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
      { label: "시간관리", value: "시간관리", desc: "우선순위·캘린더·집중 기술", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
      { label: "목표 설정", value: "목표", desc: "OKR·SMART·실행 점검", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },
      { label: "행복론", value: "행복", desc: "웰빙·긍정심리·삶의 의미", bgClass: "bg-[#FFE4E1]", icon: <BiMicrophone color="#ec8977" className="w-full h-full" /> },

      { label: "라이프 & 웰빙", value: "wellbeing", desc: "명상, 마음챙김,정신건강...", bgClass: "bg-[#E6FAF5]", icon: <MdNightlife color="#84dbc6" className="w-full h-full" /> },
      { label: "명상", value: "명상", desc: "호흡·집중·자기인식 훈련", bgClass: "bg-[#E6FAF5]", icon: <MdNightlife color="#84dbc6" className="w-full h-full" /> },
      { label: "마음챙김", value: "마음챙김", desc: "현재 알아차림과 스트레스 완화", bgClass: "bg-[#E6FAF5]", icon: <MdNightlife color="#84dbc6" className="w-full h-full" /> },
      { label: "정신건강", value: "정신건강", desc: "불안·우울 이해와 회복 전략", bgClass: "bg-[#E6FAF5]", icon: <MdNightlife color="#84dbc6" className="w-full h-full" /> },
      { label: "라이프 코칭", value: "라이프 코칭", desc: "진로·관계·라이프디자인", bgClass: "bg-[#E6FAF5]", icon: <MdNightlife color="#84dbc6" className="w-full h-full" /> },
      { label: "건강", value: "건강", desc: "운동·영양·수면·예방관리", bgClass: "bg-[#E6FAF5]", icon: <MdNightlife color="#84dbc6" className="w-full h-full" /> },

      { label: "문화 & 사회", value: "culture", desc: "문화예술,젠더,교육...", bgClass: "bg-[#e6f2fd]", icon: <FaPlaneDeparture color="#87baec" className="w-full h-full" /> },
      { label: "문화예술", value: "예술", desc: "미술·음악·공연·전시 기획", bgClass: "bg-[#e6f2fd]", icon: <FaPlaneDeparture color="#87baec" className="w-full h-full" /> },
      { label: "젠더 & 다양성", value: "젠더", desc: "포용·평등·다양성 관점과 실천", bgClass: "bg-[#e6f2fd]", icon: <FaPlaneDeparture color="#87baec" className="w-full h-full" /> },
      { label: "교육", value: "교육", desc: "학습 설계·평생교육·EdTech", bgClass: "bg-[#e6f2fd]", icon: <FaPlaneDeparture color="#87baec" className="w-full h-full" /> },
      { label: "정치", value: "정치", desc: "정책·선거·거버넌스 이해", bgClass: "bg-[#e6f2fd]", icon: <FaPlaneDeparture color="#87baec" className="w-full h-full" /> },
      { label: "사회문제", value: "사회문제", desc: "환경·노동·불평등·지역사회", bgClass: "bg-[#e6f2fd]", icon: <FaPlaneDeparture color="#87baec" className="w-full h-full" /> },

      { label: "글로벌", value: "global", desc: "국제정세,진출,취업", bgClass: "bg-[#E6FAF5]", icon: <AiOutlineGlobal color="#84dbc6" className="w-full h-full" /> },
      { label: "국제정세", value: "국제정세", desc: "지정학·안보·국제 경제 질서", bgClass: "bg-[#E6FAF5]", icon: <AiOutlineGlobal color="#84dbc6" className="w-full h-full" /> },
      { label: "해외 시장 진출", value: "해외 시장 진출", desc: "현지화·규제·파트너십 전략", bgClass: "bg-[#E6FAF5]", icon: <AiOutlineGlobal color="#84dbc6" className="w-full h-full" /> },
      { label: "해외 취업", value: "해외 취업", desc: "직무 탐색·비자·네트워킹·이력서", bgClass: "bg-[#E6FAF5]", icon: <AiOutlineGlobal color="#84dbc6" className="w-full h-full" /> },
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
