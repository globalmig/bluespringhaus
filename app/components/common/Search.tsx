"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export default function Search() {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<"recommend" | "category" | "budget" | null>(null);
  const toggleMenu = (type: "recommend" | "category" | "budget" | null) => {
    setOpenMenu((prev) => (prev === type ? null : type));
  };

  const DEFAULT_LOCATION = "";
  const DEFAULT_CATEGORY = "분야 선택";
  const DEFAULT_BUDGET = "섭외비 선택";

  const [isLocation, setLocation] = useState(DEFAULT_LOCATION);
  const [isCategory, setCategory] = useState(DEFAULT_CATEGORY);
  const [isBudget, setBudget] = useState(DEFAULT_BUDGET);

  const selectedCategory = (value: string) => {
    setCategory(value);
    setOpenMenu(null);
  };

  const selectedBudget = (value: string) => {
    setBudget(value);
    setOpenMenu(null);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setOpenMenu("recommend");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    const categoryOptions = [
      { label: "인문 & 철학", value: "humanities" },
      { label: "경제 & 경영", value: "economy" },
      { label: "비즈니스 & 커리어", value: "business" },
      { label: "트렌드 & 미래", value: "trend" },
      { label: "자기계발 & 마인드셋", value: "mindset" },
      { label: "라이프 & 웰빙", value: "wellbeing" },
      { label: "문화 & 사회", value: "culture" },
      { label: "글로벌", value: "global" },
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
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-zinc-100 w-full border-b z-50">
      <div
        className={`w-full max-w-[1440px] mx-auto mb-8 shadow-xl rounded-full md:grid grid-cols-3 justify-center items-center bg-white relative border hidden fade-out-slide ${
          openMenu === null ? "bg-white" : "bg-zinc-200"
        }`}
      >
        <div className={`absolute w-full ${openMenu === "recommend" || openMenu === null ? "bg-red-300" : "bg-zinc-200"} transform duration-300 ease-out`}></div>
        <div
          className={`relative group flex flex-col text-start border-r pr-6 py-4  rounded-full pl-10 cursor-pointer dropdown-trigger h-full justify-center ${
            openMenu === "recommend" || openMenu === null ? "bg-white" : "bg-zinc-200"
          } transform duration-300 ease-out`}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu("recommend");
          }}
        >
          <label className="text-sm font-bold">키워드 검색</label>
          <input
            type="text"
            placeholder="키워드를 입력하세요"
            value={isLocation}
            className="h-7 focus:outline-none bg-transparent"
            onChange={handleLocationChange}
            onClick={(e) => {
              toggleMenu("recommend");
              e.stopPropagation();
            }}
          />
        </div>
        {openMenu === "recommend" && (
          <div className="absolute left-2 top-20 z-10 bg-white shadow-lg rounded-xl mt-4 w-full max-w-[32%] dropdown-menu">
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
        <div
          className={`relative group flex flex-col text-start justify-center py-4 px-4  rounded-full border-r pr-6 cursor-pointer dropdown-trigger h-full transform duration-300 ease-out ${
            openMenu === "category" || openMenu === null ? "bg-white" : "bg-zinc-200"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu("category");
          }}
        >
          <label className="text-sm font-bold">대상</label>
          <div className="h-7 flex items-center text-gray-700">{isCategory}</div>
        </div>
        {openMenu === "category" && (
          <div className="absolute top-20 z-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl mt-4 w-full max-w-[32%] max-h-[400px] overflow-y-auto dropdown-menu">
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
                <li key={value} className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedCategory(label)}>
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
        <div
          className={`group flex items-center justify-center  h-full  rounded-full px-4 py-4 transform duration-300 ease-out ${
            openMenu === "budget" || openMenu === null ? "bg-white" : "bg-zinc-200"
          }`}
        >
          <div
            className="relative flex flex-col text-start  flex-1 cursor-pointer rounded-full dropdown-trigger"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu("budget");
            }}
          >
            <label className="text-sm font-bold">섭외비</label>
            <div className="h-7 flex items-center text-gray-700">{isBudget}</div>
          </div>
          {openMenu === "budget" && (
            <div className="absolute top-20 right-4 z-50 bg-white shadow-lg rounded-xl mt-4 w-full  max-w-[90%] dropdown-menu ">
              <ul className="my-4 mx-4">
                {[
                  { label: "~300만원", icon: "💸" },
                  { label: "300~500만원", icon: "💰" },
                  { label: "500~1000만원", icon: "🏆" },
                  { label: "1000만원 이상", icon: "👑" },
                ].map(({ label, icon }) => (
                  <li key={label} className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedBudget(label)}>
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
            <button className="h-14 w-14 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition" onClick={handleSearch}>
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
