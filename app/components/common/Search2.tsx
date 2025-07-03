"use client";

import { useState } from "react";

interface Item {
  id: number;
  title: string;
  description: string;
}

const SearchComponent = () => {
  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 더미 데이터 (실제로는 API에서 가져올 수 있음)
  const [items] = useState<Item[]>([
    { id: 1, title: "리액트 배우기", description: "리액트 기초부터 고급까지" },
    { id: 2, title: "타입스크립트 마스터", description: "타입스크립트 완전 정복" },
    { id: 3, title: "Next.js 가이드", description: "Next.js로 풀스택 개발하기" },
    { id: 4, title: "자바스크립트 심화", description: "JS 고급 개념들" },
    { id: 5, title: "웹 개발 트렌드", description: "2024년 웹 개발 동향" },
  ]);

  // 검색 결과 필터링
  const filteredItems = items.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase()));

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">검색 기능 예제</h1>

      {/* 검색 입력창 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 검색 결과 */}
      <div>
        <p className="text-sm text-gray-600 mb-4">{searchTerm ? `"${searchTerm}"에 대한 검색 결과 (${filteredItems.length}개)` : `전체 결과 (${items.length}개)`}</p>

        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-blue-600">{item.title}</h3>
                <p className="text-gray-700 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
