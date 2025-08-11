"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import { SEARCH_OPTIONS } from "../search/searchOptions";

type MenuKey = "recommend" | "category" | "budget";
type SearchType = "artist" | "speaker";

type Props = {
  isMoOpen: boolean;
  setMoOpen: (v: boolean) => void;
  type: SearchType;
};

export default function SearchSearch({ isMoOpen, setMoOpen, target = "speaker" }: { isMoOpen: boolean; setMoOpen: (v: boolean) => void; target: "speaker" | "artist" }) {
  const router = useRouter();

  // 타입별 옵션 세트
  const { recommendOptions, categoryOptions, budgetOptions } = SEARCH_OPTIONS[target];

  // 열림 상태
  const [openPcMenu, setOpenPcMenu] = useState<MenuKey | null>(null);
  const [openMoMenu, setOpenMoMenu] = useState<MenuKey | null>(null);

  const togglePcMenu = useCallback((key: MenuKey | null) => {
    setOpenPcMenu((prev) => (prev === key ? null : key));
  }, []);
  const toggleMoMenu = useCallback((key: MenuKey | null) => {
    setOpenMoMenu((prev) => (prev === key ? null : key));
  }, []);

  // 검색 상태
  const [keyword, setKeyword] = useState("");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("분야 선택");
  const [selectedBudgetLabel, setSelectedBudgetLabel] = useState("섭외비 선택");

  const closeAll = useCallback(() => {
    setMoOpen(false);
    setOpenPcMenu(null);
    setOpenMoMenu(null);
  }, [setMoOpen]);

  const onOpenMobileBar = () => setMoOpen(!isMoOpen);

  // label -> value 매핑
  const categoryValue = useMemo(() => {
    const found = categoryOptions.find((c) => c.label === selectedCategoryLabel);
    return found?.value ?? "";
  }, [categoryOptions, selectedCategoryLabel]);

  // 검색 실행
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    params.set("location", keyword);
    params.set("category", categoryValue);
    params.set("budget", selectedBudgetLabel);
    params.set("target", target);

    router.push(`/s?${params.toString()}`);
  }, [keyword, categoryValue, selectedBudgetLabel, router]);

  // 바깥 클릭 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-menu") && !target.closest(".dropdown-trigger")) {
        setOpenPcMenu(null);
        setOpenMoMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="wrap">
      <div className="w-full z-40 bg-zinc-100 md:bg-transparent my-0 px-4 h-[72px] md:hidden ">
        {/* 모바일 상단 토글 버튼 */}
        <div className="wrap w-full max-w-[1440px] mx-auto mb-0 md:mb-2 rounded-full gap-4 justify-center items-center relative">
          <div className={`absolute w-full ${openMoMenu === "recommend" || openMoMenu === null ? "bg-red-300" : "bg-zinc-200"} transform duration-300 ease-out`} />
          <div className={`w-full flex ${isMoOpen ? "justify-end" : "justify-center"}`}>
            <button
              className={`relative flex h-14 md:hidden rounded-full justify-center items-center gap-4 border shadow-sm bg-white transition-all duration-500 ease-in-out ${
                isMoOpen ? "w-14 mb-10" : "w-full"
              }`}
              onClick={onOpenMobileBar}
            >
              <div className={`flex justify-center items-center transition-opacity duration-500 ${isMoOpen ? "opacity-0" : "opacity-100"}`}>
                <FaSearch />
              </div>
              <p className={`ml-2 whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out ${isMoOpen ? "w-0 opacity-0" : "w-auto opacity-100"}`}>검색을 시작해 보세요</p>
              <p className={`absolute left-1/2 -translate-x-1/2 text-center transition-opacity duration-500 ${isMoOpen ? "opacity-100" : "opacity-0"}`}>X</p>
            </button>
          </div>
        </div>
      </div>
      {/* ===== 모바일: 키워드 ===== */}
      <div
        className={`md:hidden relative group flex-col text-start border-r pr-6 py-4 rounded-full pl-10 cursor-pointer dropdown-trigger h-full justify-center ${
          openMoMenu === "recommend" || openMoMenu === null ? "bg-white" : "bg-zinc-200"
        } ${!isMoOpen ? "hidden" : "flex"} transform duration-300 ease-out`}
        onClick={(e) => {
          e.stopPropagation();
          toggleMoMenu("recommend");
        }}
      >
        <label className="text-sm font-bold">키워드 검색</label>
        <input
          type="text"
          placeholder="키워드를 입력하세요"
          value={keyword}
          className="h-7 focus:outline-none bg-transparent"
          onChange={(e) => {
            setKeyword(e.target.value);
            setOpenMoMenu("recommend");
          }}
          onClick={(e) => {
            toggleMoMenu("recommend");
            e.stopPropagation();
          }}
        />
      </div>
      {openMoMenu === "recommend" && (
        <div className="md:hidden block bg-white shadow-lg rounded-xl mt-4 w-full dropdown-menu">
          <ul className="my-4 mx-4">
            {recommendOptions.map((item, idx) => (
              <li key={idx} className="hover:bg-slate-300 cursor-pointer flex items-center py-4 px-4 rounded-md" onClick={() => setKeyword(item.title)}>
                <div className={`${item.bgClass} w-18 h-12 rounded p-2`}>{item.icon}</div>
                <div className="flex flex-col text-sm ml-4">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-slate-500">{item.subTitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== 모바일: 분야 ===== */}
      <div
        className={`md:hidden relative group flex-col text-start justify-center py-4 px-10 rounded-full border-r pr-6 cursor-pointer dropdown-trigger transform duration-300 ease-out my-4 ${
          openMoMenu === "category" || openMoMenu === null ? "bg-white" : "bg-zinc-200"
        } ${!isMoOpen ? "hidden" : "flex"}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleMoMenu("category");
        }}
      >
        <label className="text-sm font-bold">분야</label>
        <div className="h-7 flex items-center text-gray-700">{selectedCategoryLabel}</div>
      </div>
      {openMoMenu === "category" && (
        <div className="md:hidden block bg-white shadow-lg rounded-xl mt-4 w-full max-h-[400px] overflow-y-auto dropdown-menu">
          <ul className="my-4 mx-4">
            {categoryOptions.map((item, idx) => (
              <li
                key={idx}
                className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md"
                onClick={() => {
                  setSelectedCategoryLabel(item.label);
                  setOpenMoMenu(null);
                }}
              >
                <div className={`${item.bgClass} w-18 h-12 rounded p-2 flex items-center justify-center`}>{item.icon}</div>
                <div className="flex flex-col text-sm ml-4">
                  <p className="font-bold">{item.label}</p>
                  <p className="text-slate-500">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== 모바일: 섭외비 ===== */}
      <div
        className={`md:hidden group items-center justify-center rounded-full px-10 py-4 transform duration-300 ease-out ${
          openMoMenu === "budget" || openMoMenu === null ? "bg-white" : "bg-zinc-200"
        } ${!isMoOpen ? "hidden" : "flex"}`}
      >
        <div
          className="relative flex flex-col text-start flex-1 cursor-pointer rounded-full dropdown-trigger"
          onClick={(e) => {
            e.stopPropagation();
            toggleMoMenu("budget");
          }}
        >
          <label className="text-sm font-bold">섭외비</label>
          <div className="h-7 flex items-center text-gray-700">{selectedBudgetLabel}</div>
        </div>
      </div>
      {openMoMenu === "budget" && (
        <div className="md:hidden block bg-white shadow-lg rounded-xl mt-4 w-full dropdown-menu">
          <ul className="my-4 mx-4">
            {budgetOptions.map((item, idx) => (
              <li
                key={idx}
                className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md"
                onClick={() => {
                  setSelectedBudgetLabel(item.label);
                  setOpenMoMenu(null);
                }}
              >
                <div className="bg-gray-500 w-10 h-10 rounded flex items-center justify-center text-white font-bold">{item.icon}</div>
                <div className="flex flex-col text-sm">
                  <p className="font-bold">{item.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 모바일 검색 버튼 */}
      <div className="flex justify-center items-center h-full rounded-full mt-10 mb-0" style={{ margin: 0 }}>
        <button
          className={`justify-center items-center gap-4 h-14 w-full bg-blue-500 text-white rounded-full hover:bg-blue-600 transition ${!isMoOpen ? "hidden" : "md:hidden flex"}`}
          onClick={() => {
            handleSearch();
            closeAll();
          }}
        >
          <div className="flex justify-center items-center">
            <FaSearch />
          </div>
          검색
        </button>
      </div>

      {/* ===== PC 버전 ===== */}
      <div
        className={`w-full max-w-[1440px] mx-auto shadow-xl rounded-full md:grid md:grid-cols-3 justify-center items-center md:bg-white relative border hidden  ${
          openPcMenu === null ? "bg-white" : "bg-zinc-200 "
        }`}
      >
        {/* PC: 키워드 */}
        <div
          className={`hidden md:flex relative group flex-col text-start border-r pr-6 py-4 rounded-full pl-10 cursor-pointer dropdown-trigger h-full justify-center ${
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
            value={keyword}
            className="h-7 focus:outline-none bg-transparent"
            onChange={(e) => {
              setKeyword(e.target.value);
              setOpenPcMenu("recommend");
            }}
            onClick={(e) => {
              togglePcMenu("recommend");
              e.stopPropagation();
            }}
          />
        </div>
        {openPcMenu === "recommend" && (
          <div className="hidden md:block absolute left-2 top-20 z-10 bg-white shadow-lg rounded-xl mt-4 w-full max-w-[32%] dropdown-menu">
            <ul className="my-4 mx-4">
              {recommendOptions.map((item, idx) => (
                <li key={idx} className="hover:bg-slate-300 cursor-pointer flex items-center py-4 px-4 rounded-md" onClick={() => setKeyword(item.title)}>
                  <div className={`${item.bgClass} w-18 h-12 rounded p-2`}>{item.icon}</div>
                  <div className="flex flex-col text-sm ml-4">
                    <p className="font-bold">{item.title}</p>
                    <p className="text-slate-500">{item.subTitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PC: 분야 */}
        <div
          className={`hidden relative group md:flex flex-col text-start justify-center py-4 px-4 rounded-full border-r pr-6 cursor-pointer dropdown-trigger h-full transform duration-300 ease-out ${
            openPcMenu === "category" || openPcMenu === null ? "bg-white" : "bg-zinc-200"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            togglePcMenu("category");
          }}
        >
          <label className="text-sm font-bold">분야</label>
          <div className="h-7 flex items-center text-gray-700">{selectedCategoryLabel}</div>
        </div>
        {openPcMenu === "category" && (
          <div className="hidden md:block absolute top-20 z-10 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl mt-4 w-full max-w-[32%] max-h-[400px] overflow-y-auto dropdown-menu">
            <ul className="my-4 mx-4">
              {categoryOptions.map((item, idx) => (
                <li
                  key={idx}
                  className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md"
                  onClick={() => {
                    setSelectedCategoryLabel(item.label);
                    setOpenPcMenu(null);
                  }}
                >
                  <div className={`${item.bgClass} w-18 h-12 rounded p-2 flex items-center justify-center`}>{item.icon}</div>
                  <div className="flex flex-col text-sm ml-4">
                    <p className="font-bold">{item.label}</p>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PC: 섭외비 + 검색 버튼 */}
        <div
          className={`hidden group md:flex items-center justify-center h-full rounded-full px-4 py-4 transform duration-300 ease-out ${
            openPcMenu === "budget" || openPcMenu === null ? "bg-white" : "bg-zinc-200"
          }`}
        >
          <div
            className="relative flex flex-col text-start flex-1 cursor-pointer rounded-full dropdown-trigger"
            onClick={(e) => {
              e.stopPropagation();
              togglePcMenu("budget");
            }}
          >
            <label className="text-sm font-bold">섭외비</label>
            <div className="h-7 flex items-center text-gray-700">{selectedBudgetLabel}</div>
          </div>

          {openPcMenu === "budget" && (
            <div className="hidden md:block absolute top-20 right-4 z-40 bg-white shadow-lg rounded-xl mt-4 w-full max-w-[90%] dropdown-menu">
              <ul className="my-4 mx-4">
                {budgetOptions.map(({ label, icon, bgClass }) => (
                  <li
                    key={label}
                    className="hover:bg-slate-300 cursor-pointer flex items-center gap-2 py-4 px-4 rounded-md"
                    onClick={() => {
                      setSelectedBudgetLabel(label);
                      setOpenPcMenu(null);
                    }}
                  >
                    <div className={`${bgClass} w-10 h-10 p-2 rounded flex items-center justify-center text-white font-bold`}>{icon}</div>
                    <div className="flex flex-col text-sm">
                      <p className="font-bold">{label}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-center items-center h-full rounded-full ml-4">
            <button
              className="h-14 w-14 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
              onClick={() => {
                handleSearch();
                closeAll();
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
