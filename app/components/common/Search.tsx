"use client";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Search() {
  const router = useRouter();

  const [isOpenMenuLocation, setOpenMenuLocation] = useState(false);
  const [isOpenMenuCategory, setOpenMenuCategory] = useState(false);
  const [isOpenMenuBudget, setOpenMenuBudget] = useState(false);

  const [isLocation, setLocation] = useState<string>("추천리스트");
  const [isCategory, setCategory] = useState<string>("분야 선택");
  const [isBudget, setBudget] = useState<string>("섭외비 선택");

  const locationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  const toggleMenuLocation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpenMenuLocation((prev) => !prev);
    setOpenMenuCategory(false);
    setOpenMenuBudget(false);
  };

  const toggleMenuCategory = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpenMenuCategory((prev) => !prev);
    setOpenMenuLocation(false);
    setOpenMenuBudget(false);
  };

  const toggleMenuBudget = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpenMenuBudget((prev) => !prev);
    setOpenMenuLocation(false);
    setOpenMenuCategory(false);
  };

  const selectedLocation = (value: string) => {
    setLocation(value);
    setOpenMenuLocation(false);
  };

  const selectedCategory = (value: string) => {
    setCategory(value);
    setOpenMenuCategory(false);
  };

  const selectedBudget = (value: string) => {
    setBudget(value);
    setOpenMenuBudget(false);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setOpenMenuLocation(true);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    // 🔥 label → value로 변환
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
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (locationRef.current && !locationRef.current.contains(target)) {
        setOpenMenuLocation(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setOpenMenuCategory(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(target)) {
        setOpenMenuBudget(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="w-full max-w-[1440px] mx-auto mb-8 shadow-xl rounded-full md:grid grid-cols-3 justify-center items-center bg-white relative border hidden fade-out-slide">
        {/* 추천 키워드 */}
        <div ref={locationRef} className="relative group flex flex-col text-start gap-1 border-r pr-6 py-2 hover:bg-slate-300 bg-white rounded-full pl-10" onClick={toggleMenuLocation}>
          <label className="text-sm font-medium">키워드 검색</label>
          <input
            type="text"
            placeholder="키워드를 입력하세요"
            value={isLocation}
            className="h-10 focus:outline-none group-hover:bg-slate-300"
            onChange={handleLocationChange}
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuLocation(true);
            }}
          />
        </div>
        {isOpenMenuLocation && (
          <div className="absolute left-2 top-20 z-10 bg-white shadow-lg rounded-xl mt-2 w-full max-w-[32%]">
            <ul className="my-4 mx-4">
              {/* TODO: 미리보는 추천 키워드 수정해야함 */}
              {["", "서울", "부산", "제주"].map((loc) => (
                <li key={loc} className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedLocation(loc)}>
                  <div className="bg-black w-10 h-10 rounded"></div>
                  <div className="flex flex-col text-sm">
                    <p className="font-bold">{loc}</p>
                    <p className="text-slate-500">{loc === "추천리스트" ? "전국 인기 장소" : `${loc} 지역`}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 대상 */}
        <div ref={categoryRef} className="relative group flex flex-col text-start gap-1 py-2 px-4 hover:bg-slate-300 rounded-full border-r pr-6 cursor-pointer" onClick={toggleMenuCategory}>
          <label className="text-sm font-medium">대상</label>
          <div className="h-10 flex items-center text-gray-700">{isCategory}</div>
        </div>
        {isOpenMenuCategory && (
          <div className="absolute top-20 z-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl mt-2 w-full max-w-[32%] max-h-[400px] overflow-y-auto">
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
                <li
                  key={value}
                  className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md"
                  onClick={() => {
                    setCategory(label); // 사용자에게는 label만 저장
                    setOpenMenuCategory(false);
                  }}
                >
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

        {/* 섭외비 */}
        <div className="group flex items-center justify-center h-full hover:bg-slate-300 rounded-full px-4">
          <div ref={budgetRef} className="relative flex flex-col text-start gap-1 group-hover:bg-slate-300 flex-1 cursor-pointer rounded-full" onClick={toggleMenuBudget}>
            <label className="text-sm font-medium">섭외비</label>
            <div className="h-10 flex items-center text-gray-700">{isBudget}</div>
          </div>
          {isOpenMenuBudget && (
            <div className="absolute top-20 right-4 z-10 bg-white shadow-lg rounded-xl mt-2 w-full max-w-[33%]">
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
          <div className="flex justify-center items-center h-full group-hover:bg-slate-300 rounded-full ml-4">
            <button className="h-10 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
