"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchArtist({ isMoOpen, setMoOpen }: { isMoOpen: boolean; setMoOpen: (v: boolean) => void }) {
  const router = useRouter();

  const [openPcMenu, setOpenPcMenu] = useState<"recommend" | "category" | "budget" | null>(null);
  const [openMoMenu, setOpenMoMenu] = useState<"recommend" | "category" | "budget" | null>(null);
  const togglePcMenu = (type: "recommend" | "category" | "budget" | null) => {
    setOpenPcMenu((prev) => (prev === type ? null : type));
  };
  const toggleMoMenu = (type: "recommend" | "category" | "budget" | null) => {
    setOpenMoMenu((prev) => (prev === type ? null : type));
  };

  const DEFAULT_LOCATION = "";
  const DEFAULT_CATEGORY = "분야 선택";
  const DEFAULT_BUDGET = "섭외비 선택";

  const [isLocation, setLocation] = useState(DEFAULT_LOCATION);
  const [isCategory, setCategory] = useState(DEFAULT_CATEGORY);
  const [isBudget, setBudget] = useState(DEFAULT_BUDGET);

  const handleOpen = () => {
    setMoOpen(!isMoOpen);

    // setMoLocation(!isMoLocation);
  };

  const handleClose = () => {
    setMoOpen(false);
    setOpenMoMenu(null); // 모바일 드롭다운 닫기
    setOpenPcMenu(null); // PC 드롭다운 닫기
    // setMoLocation(!isMoLocation);
  };

  const selectedPcCategory = (value: string) => {
    setCategory(value);
    setOpenPcMenu(null);
  };

  const selectedMoCategory = (value: string) => {
    setCategory(value);
    setOpenMoMenu(null);
  };

  const selectedPcBudget = (value: string) => {
    setBudget(value);
    setOpenPcMenu(null);
  };

  const selectedMoBudget = (value: string) => {
    setBudget(value);
    setOpenMoMenu(null);
  };

  const handlePcLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setOpenPcMenu("recommend");
  };

  const handleMoLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setOpenMoMenu("recommend");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    const categoryOptions = [
      { label: "인디", value: "indie" },
      { label: "발라드", value: "ballad" },
      { label: "힙합", value: "hiphop" },
      { label: "R&B", value: "rnb" },
      { label: "트로트", value: "trot" },
      { label: "락/밴드", value: "rock_band" },
      { label: "재즈", value: "jazz" },
      { label: "EDM", value: "edm" },
      { label: "클래식", value: "classical" },
      { label: "어쿠스틱", value: "acoustic" },
      { label: "아이돌", value: "idol" },
      { label: "댄스", value: "dance" },
      { label: "방송인", value: "broadcaster" },
      { label: "MC", value: "mc" },
      { label: "아나운서", value: "announcer" },
      { label: "성우", value: "voice_actor" },
      { label: "유튜버", value: "youtuber" },
      { label: "유튜브", value: "youtuber" },
      { label: "틱톡커", value: "tiktoker" },
      { label: "인플루언서", value: "influencer" },
    ];
    const matched = categoryOptions.find((c) => c.label === isCategory);
    const categoryValue = matched?.value ?? "";
    params.append("location", isLocation);
    params.append("category", categoryValue);
    params.append("budget", isBudget);

    router.push(`/s?${params.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-menu") && !target.closest(".dropdown-trigger")) {
        setOpenPcMenu(null);
        setOpenMoMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full  z-40 bg-zinc-100 md:bg-transparent my-0">
      {/* 모바일 전용 검색 창 */}

      <div
        className={`wrap w-full max-w-[1440px] mx-auto mb-0 md:mb-8 rounded-full gap-4 justify-center items-center relative fade-out-slide 
        `}
      >
        <div className={` absolute w-full ${openMoMenu === "recommend" || openMoMenu === null ? "bg-red-300" : "bg-zinc-200"} transform duration-300 ease-out`}></div>
        <div className={`w-full flex  ${isMoOpen ? "justify-end" : "justify-center"} `}>
          <button
            className={`relative flex h-14 md:hidden rounded-full justify-center items-center gap-4 border shadow-sm bg-white transition-all duration-500 ease-in-out ${
              isMoOpen ? "w-14 mb-10" : "w-full "
            }`}
            onClick={handleOpen}
          >
            <div className={`flex justify-center items-center transition-opacity duration-500 ${isMoOpen ? "opacity-0" : "opacity-100"}`}>
              <FaSearch />
            </div>

            <p className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out ${isMoOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>검색을 시작해 보세요</p>

            <p className={`absolute left-1/2 -translate-x-1/2 text-center transition-opacity duration-500 ${isMoOpen ? "opacity-100" : "opacity-0"}`}>X</p>
          </button>
        </div>
      </div>
      {/* 모바일 키워드 검색 섹션 */}
      <div
        className={`md:hidden relative group  flex-col text-start border-r pr-6 py-4  rounded-full pl-10 cursor-pointer dropdown-trigger h-full justify-center ${
          openMoMenu === "recommend" || openMoMenu === null ? "bg-white" : "bg-zinc-200"
        } ${isMoOpen === false ? "hidden" : "flex"} transform duration-300 ease-out`}
        onClick={(e) => {
          e.stopPropagation();
          toggleMoMenu("recommend");
        }}
      >
        <label className="text-sm font-bold">키워드 검색</label>
        <input
          type="text"
          placeholder="키워드를 입력하세요"
          value={isLocation}
          className="h-7 focus:outline-none bg-transparent"
          onChange={handleMoLocationChange}
          onClick={(e) => {
            toggleMoMenu("recommend");

            e.stopPropagation();
          }}
        />
      </div>
      {openMoMenu === "recommend" && (
        <div className={`md:hidden block bg-white shadow-lg rounded-xl mt-4 w-full dropdown-menu ${openMoMenu === "recommend" ? "" : ""}`}>
          <ul className="my-4 mx-4">
            {["추천리스트", "서울", "부산", "제주"].map((loc) => (
              <li key={loc} className="hover:bg-slate-300 cursor-pointer flex items-center py-4 px-4 rounded-md" onClick={() => setLocation(loc)}>
                <div className="bg-black w-10 h-7 rounded"></div>
                <div className="flex flex-col text-sm ml-2">
                  <p className="font-bold">{loc}</p>
                  <p className="text-slate-500">{loc === "추천리스트" ? "전국 인기 장소" : `${loc} 지역`}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* 모바일 대상 섹션 */}
      <div
        className={`md:hidden relative group  flex-col text-start justify-center py-4 px-4  rounded-full border-r pr-6 cursor-pointer dropdown-trigger  transform duration-300 ease-out my-4 ${
          openMoMenu === "category" || openMoMenu === null ? "bg-white" : "bg-zinc-200"
        }  ${isMoOpen === false ? "hidden" : "flex"} `}
        onClick={(e) => {
          e.stopPropagation();
          toggleMoMenu("category");
        }}
      >
        <label className="text-sm font-bold">대상</label>
        <div className="h-7 flex items-center text-gray-700">{isCategory}</div>
      </div>
      {openMoMenu === "category" && (
        <div className="md:hidden block bg-white shadow-lg rounded-xl mt-4 w-full max-h-[400px] overflow-y-auto dropdown-menu">
          <ul className="my-4 mx-4">
            {[
              { label: "인디", value: "indie", icon: "🎸", desc: "진심을 노래하는 감성 음악" },
              { label: "발라드", value: "ballad", icon: "🎤", desc: "감성을 자극하는 감미로운 목소리" },
              { label: "힙합", value: "hiphop", icon: "🔥", desc: "거침없는 플로우, 리듬 위의 메시지" },
              { label: "R&B", value: "rnb", icon: "🎧", desc: "감미롭고 리드미컬한 소울 음악" },
              { label: "트로트", value: "trot", icon: "🎶", desc: "흥과 정이 넘치는 대중가요" },
              { label: "락/밴드", value: "rock_band", icon: "🥁", desc: "에너지 넘치는 밴드 사운드" },
              { label: "재즈", value: "jazz", icon: "🎷", desc: "즉흥과 세련미가 어우러진 음악" },
              { label: "EDM", value: "edm", icon: "🎛️", desc: "클럽을 뜨겁게 만드는 전자음악" },
              { label: "클래식", value: "classical", icon: "🎻", desc: "시대를 초월한 명곡의 향연" },
              { label: "어쿠스틱", value: "acoustic", icon: "🪕", desc: "따뜻한 소리로 전하는 감성" },
              { label: "아이돌", value: "idol", icon: "✨", desc: "전 세계를 사로잡은 K-POP 스타" },
              { label: "댄스", value: "dance", icon: "💃", desc: "무대를 압도하는 퍼포먼스" },
              { label: "방송인", value: "broadcaster", icon: "📺", desc: "화면 속 에너지를 전하는 사람들" },
              { label: "MC", value: "mc", icon: "🎙️", desc: "행사의 중심을 잡는 진행 전문가" },
              { label: "아나운서", value: "announcer", icon: "📰", desc: "신뢰감 있는 전달의 목소리" },
              { label: "성우", value: "voice_actor", icon: "🎭", desc: "목소리로 연기하는 배우" },
              { label: "유튜버", value: "youtuber", icon: "▶️", desc: "콘텐츠로 세상을 이끄는 크리에이터" },
              { label: "틱톡커", value: "tiktoker", icon: "📱", desc: "숏폼 영상의 트렌드 리더" },
              { label: "인플루언서", value: "influencer", icon: "📸", desc: "영향력을 가진 SNS 스타" },
            ].map(({ label, value, icon, desc }) => (
              <li key={value} className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedMoCategory(label)}>
                <div className="bg-gray-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">{icon}</div>
                <div className="flex flex-col text-sm">
                  <p className="font-bold">{label}</p>
                  <p className="text-slate-500">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 모바일 섭외비 섹션 */}
      <div
        className={`md:hidden group items-center justify-center  rounded-full px-4 py-4 transform duration-300 ease-out ${
          openMoMenu === "budget" || openMoMenu === null ? "bg-white" : "bg-zinc-200"
        }  ${isMoOpen === false ? "hidden" : "flex"}`}
      >
        <div
          className="relative flex flex-col text-start  flex-1 cursor-pointer rounded-full dropdown-trigger"
          onClick={(e) => {
            e.stopPropagation();
            toggleMoMenu("budget");
          }}
        >
          <label className="text-sm font-bold">섭외비</label>
          <div className="h-7 flex items-center text-gray-700">{isBudget}</div>
        </div>
      </div>
      {openMoMenu === "budget" && (
        <div className="md:hidden block bg-white shadow-lg rounded-xl mt-4 w-full dropdown-menu ">
          <ul className="my-4 mx-4">
            {[
              { label: "~300만원", icon: "💸" },
              { label: "300~500만원", icon: "💰" },
              { label: "500~1000만원", icon: "🏆" },
              { label: "1000만원 이상", icon: "👑" },
            ].map(({ label, icon }) => (
              <li key={label} className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedMoBudget(label)}>
                <div className="bg-gray-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">{icon}</div>
                <div className="flex flex-col text-sm">
                  <p className="font-bold">{label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-center items-center h-full  rounded-full mt-10">
        <button
          className={`justify-center items-center gap-4 h-14 w-full  bg-blue-500 text-white rounded-full hover:bg-blue-600 transition ${isMoOpen === false ? "hidden" : "md:hidden flex"}`}
          onClick={() => {
            handleSearch();
            handleClose();
          }}
        >
          <div className="flex justify-center items-center ">
            <FaSearch />
          </div>
          검색
        </button>
      </div>
      {/*pc버전 */}
      <div
        className={`w-full max-w-[1440px] mx-auto md:mb-8 shadow-xl rounded-full md:grid md:grid-cols-3 justify-center items-center  md:bg-white relative fade-out-slide ${
          openPcMenu === null ? "bg-white" : "bg-zinc-200 "
        } 
        `}
      >
        <div
          className={`hidden md:flex relative group  flex-col text-start border-r pr-6 py-4  rounded-full pl-10 cursor-pointer dropdown-trigger h-full justify-center ${
            openPcMenu === "recommend" || openPcMenu === null ? "bg-white" : "bg-zinc-200"
          } transform duration-300 ease-out`}
          onClick={(e) => {
            e.stopPropagation();
            togglePcMenu("recommend");
          }}
        >
          <label className="text-sm font-bold">키워드 검색</label>
          <input
            type="text"
            placeholder="키워드를 입력하세요"
            value={isLocation}
            className="h-7 focus:outline-none bg-transparent"
            onChange={handlePcLocationChange}
            onClick={(e) => {
              togglePcMenu("recommend");
              e.stopPropagation();
            }}
          />
        </div>
        {openPcMenu === "recommend" && (
          <div className="hidden md:block absolute left-2 top-20 z-10 bg-white shadow-lg rounded-xl mt-4 w-full max-w-[32%] dropdown-menu">
            <ul className="my-4 mx-4">
              {["추천리스트", "서울", "부산", "제주"].map((loc) => (
                <li key={loc} className="hover:bg-slate-300 cursor-pointer flex items-center py-4 px-4 rounded-md" onClick={() => setLocation(loc)}>
                  <div className="bg-black w-10 h-7 rounded"></div>
                  <div className="flex flex-col text-sm ml-2">
                    <p className="font-bold">{loc}</p>
                    <p className="text-slate-500">{loc === "추천리스트" ? "전국 인기 장소" : `${loc} 지역`}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 대상 섹션 */}
        <div
          className={`hidden relative group md:flex flex-col text-start justify-center py-4 px-4  rounded-full border-r pr-6 cursor-pointer dropdown-trigger h-full transform duration-300 ease-out ${
            openPcMenu === "category" || openPcMenu === null ? "bg-white" : "bg-zinc-200"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            togglePcMenu("category");
          }}
        >
          <label className="text-sm font-bold">대상</label>
          <div className="h-7 flex items-center text-gray-700">{isCategory}</div>
        </div>
        {openPcMenu === "category" && (
          <div className="hidden md:block  absolute top-20 z-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl mt-4 w-full max-w-[32%] max-h-[400px] overflow-y-auto dropdown-menu">
            <ul className="my-4 mx-4">
              {[
                { label: "인문 & 철학", value: "humanities", icon: "🍽️", desc: "인문학, 철학 등" },
                { label: "경제 & 경영", value: "economy", icon: "🏛️", desc: "경제, 투자, 주식 등" },
                { label: "비즈니스 & 커리어", value: "business", icon: "🏨", desc: "경영전략, 리더십 등" },
                { label: "트렌드 & 미래", value: "trend", icon: "🎯", desc: "테크트렌드, 소비트렌드 등" },
                { label: "자기계발 & 마인드셋", value: "mindset", icon: "🎯", desc: "동기부여, 습관 & 루틴 등" },
                { label: "라이프 & 웰빙", value: "wellbeing", icon: "🎯", desc: "명상, 마음챙김 등" },
                { label: "문화 & 사회", value: "culture", icon: "🎯", desc: "문화예술, 교육, 사회문제 등" },
                { label: "글로벌", value: "global", icon: "🎯", desc: "국제정세, 해외 시장 진출 등" },
              ].map(({ label, value, icon, desc }) => (
                <li key={value} className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedPcCategory(label)}>
                  <div className="bg-gray-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">{icon}</div>
                  <div className="flex flex-col text-sm">
                    <p className="font-bold">{label}</p>
                    <p className="text-slate-500">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PC 섭외비 섹션 */}
        <div
          className={`hidden group md:flex items-center justify-center  h-full  rounded-full px-4 py-4 transform duration-300 ease-out ${
            openPcMenu === "budget" || openPcMenu === null ? "bg-white" : "bg-zinc-200"
          }`}
        >
          <div
            className="relative flex flex-col text-start  flex-1 cursor-pointer rounded-full dropdown-trigger"
            onClick={(e) => {
              e.stopPropagation();
              togglePcMenu("budget");
            }}
          >
            <label className="text-sm font-bold">섭외비</label>
            <div className="h-7 flex items-center text-gray-700">{isBudget}</div>
          </div>
          {openPcMenu === "budget" && (
            <div className="hidden md:block absolute top-20 right-4 z-40 bg-white shadow-lg rounded-xl mt-4 w-full  max-w-[90%] dropdown-menu ">
              <ul className="my-4 mx-4">
                {[
                  { label: "~300만원", icon: "💸" },
                  { label: "300~500만원", icon: "💰" },
                  { label: "500~1000만원", icon: "🏆" },
                  { label: "1000만원 이상", icon: "👑" },
                ].map(({ label, icon }) => (
                  <li key={label} className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedPcBudget(label)}>
                    <div className="bg-gray-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">{icon}</div>
                    <div className="flex flex-col text-sm">
                      <p className="font-bold">{label}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-center items-center h-full  rounded-full ml-4">
            <button
              className="h-14 w-14 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              onClick={() => {
                handleSearch();
                handleClose();
              }}
            >
              <div className="flex justify-center items-center">
                <FaSearch />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
