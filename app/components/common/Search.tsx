"use client";
import { useState, useRef, useEffect } from "react";

export default function Search() {
  // 각 드롭다운 상태 관리
  const [isOpenMenuLocation, setOpenMenuLocation] = useState(false);
  const [isOpenMenuCategory, setOpenMenuCategory] = useState(false);
  const [isOpenMenuTime, setOpenMenuTime] = useState(false);

  // 각 입력값 상태 관리
  const [isLocation, setLocation] = useState<string>("추천리스트");
  const [isCategory, setCategory] = useState<string>("분야 선택");
  const [isTime, setTime] = useState<string>("시간 선택");

  // 각 드롭다운 ref
  const locationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  // 지역 드롭다운 토글
  const toggleMenuLocation = () => {
    setOpenMenuLocation(!isOpenMenuLocation);
    setOpenMenuCategory(false);
    setOpenMenuTime(false);
  };

  // 분야 드롭다운 토글
  const toggleMenuCategory = () => {
    setOpenMenuCategory(!isOpenMenuCategory);
    setOpenMenuLocation(false);
    setOpenMenuTime(false);
  };

  // 시간 드롭다운 토글
  const toggleMenuTime = () => {
    setOpenMenuTime(!isOpenMenuTime);
    setOpenMenuLocation(false);
    setOpenMenuCategory(false);
  };

  // 지역 선택
  const selectedLocation = (value: string) => {
    setLocation(value);
    setOpenMenuLocation(false);
  };

  // 분야 선택
  const selectedCategory = (value: string) => {
    setCategory(value);
    setOpenMenuCategory(false);
  };

  // 시간 선택
  const selectedTime = (value: string) => {
    setTime(value);
    setOpenMenuTime(false);
  };

  // 지역만 직접 입력 가능
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    setOpenMenuLocation(true);
    setOpenMenuCategory(false);
    setOpenMenuTime(false);
  };

  // 컴포넌트 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (locationRef.current && !locationRef.current.contains(target)) {
        setOpenMenuLocation(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setOpenMenuCategory(false);
      }
      if (timeRef.current && !timeRef.current.contains(target)) {
        setOpenMenuTime(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto shadow-xl rounded-full grid grid-cols-3 justify-center items-center bg-white relative">
      {/* 지역 */}
      <div ref={locationRef} className="relative group flex flex-col text-start gap-1 border-r pr-6 py-2 hover:bg-slate-300 bg-white rounded-full pl-10" onClick={toggleMenuLocation}>
        <label className="text-sm font-medium">지역</label>
        <input type="text" placeholder="검색하세요" value={isLocation} className="h-10 focus:outline-none group-hover:bg-slate-300" onChange={handleLocationChange} />
      </div>{" "}
      {/* 지역 선택 드롭다운 */}
      {isOpenMenuLocation && (
        <div className="absolute top-20 z-10 bg-white shadow-lg rounded-xl mt-2 w-full max-w-[380px]">
          <ul className="my-4 mx-4">
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedLocation("추천리스트")}>
              <div className="bg-black w-10 h-10 rounded"></div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">추천리스트</p>
                <p className="text-slate-500">전국에서 인기 있는 곳</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedLocation("서울")}>
              <div className="bg-blue-500 w-10 h-10 rounded"></div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">서울</p>
                <p className="text-slate-500">수도권 지역</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedLocation("부산")}>
              <div className="bg-green-500 w-10 h-10 rounded"></div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">부산</p>
                <p className="text-slate-500">해운대, 광안리 등</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedLocation("제주")}>
              <div className="bg-orange-500 w-10 h-10 rounded"></div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">제주</p>
                <p className="text-slate-500">제주도 전 지역</p>
              </div>
            </li>
          </ul>
        </div>
      )}
      {/* 분야 */}
      <div ref={categoryRef} className="relative group flex flex-col text-start gap-1 py-2 px-4 hover:bg-slate-300 rounded-full border-r pr-6 cursor-pointer" onClick={toggleMenuCategory}>
        <label className="text-sm font-medium">분야</label>
        <div className="h-10 flex items-center text-gray-700">{isCategory}</div>
      </div>
      {/* 분야 선택 드롭다운 */}
      {isOpenMenuCategory && (
        <div className="absolute top-20 z-10 bg-white shadow-lg rounded-xl mt-2 w-full max-w-[1440px] ">
          <ul className="my-4 mx-4">
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedCategory("맛집")}>
              <div className="bg-red-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">🍽️</div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">맛집</p>
                <p className="text-slate-500">레스토랑, 카페 등</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedCategory("관광지")}>
              <div className="bg-purple-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">🏛️</div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">관광지</p>
                <p className="text-slate-500">명소, 박물관 등</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedCategory("숙박")}>
              <div className="bg-indigo-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">🏨</div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">숙박</p>
                <p className="text-slate-500">호텔, 펜션 등</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedCategory("액티비티")}>
              <div className="bg-yellow-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">🎯</div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">액티비티</p>
                <p className="text-slate-500">체험, 레저 등</p>
              </div>
            </li>
          </ul>
        </div>
      )}
      {/* 시간 */} {/* 시간 선택 드롭다운 */}
      {isOpenMenuTime && (
        <div className="absolute top-20 z-10 bg-white shadow-lg rounded-xl mt-2 w-full ">
          <ul className="my-4 mx-4">
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedTime("오전 (09:00-12:00)")}>
              <div className="bg-yellow-400 w-10 h-10 rounded flex items-center justify-center text-white font-bold">🌅</div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">오전</p>
                <p className="text-slate-500">09:00 - 12:00</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedTime("점심 (12:00-14:00)")}>
              <div className="bg-orange-400 w-10 h-10 rounded flex items-center justify-center text-white font-bold">☀️</div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">점심</p>
                <p className="text-slate-500">12:00 - 14:00</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedTime("오후 (14:00-18:00)")}>
              <div className="bg-blue-400 w-10 h-10 rounded flex items-center justify-center text-white font-bold">🌤️</div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">오후</p>
                <p className="text-slate-500">14:00 - 18:00</p>
              </div>
            </li>
            <li className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md" onClick={() => selectedTime("저녁 (18:00-22:00)")}>
              <div className="bg-purple-400 w-10 h-10 rounded flex items-center justify-center text-white font-bold">🌆</div>
              <div className="flex flex-col text-sm">
                <p className="font-bold">저녁</p>
                <p className="text-slate-500">18:00 - 22:00</p>
              </div>
            </li>
          </ul>
        </div>
      )}
      <div className="group flex items-center justify-center h-full hover:bg-slate-300 rounded-full px-4">
        <div ref={timeRef} className="relative flex flex-col text-start gap-1 group-hover:bg-slate-300 group flex-1 cursor-pointer rounded-full" onClick={toggleMenuTime}>
          <label className="text-sm font-medium">시간</label>
          <div className="h-10 flex items-center text-gray-700">{isTime}</div>
        </div>{" "}
        {/* 필터 검색 기능 연결 */}
        {/* 검색 버튼 */}
        <div className="flex justify-center items-center h-full group-hover:bg-slate-300 group rounded-full ml-4">
          <button className="h-10 px-6 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">검색</button>
        </div>
      </div>
    </div>
  );
}
