import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <div className="border-2 w-full h-64 flex mt-20 flex-col items-center justify-center">
      <div className="flex flex-col w-full max-w-[1440px] mx-auto">
        <div className="flex mb-4">
          <Link href="/" className="text-sm font-bold">
            이용약관
          </Link>
          <Link href="/" className="text-sm font-bold ml-4">
            개인정보처리방침
          </Link>
        </div>
        <p className="text-2xl font-medium">회사이름</p>
        <p>대표자: 000</p>
        <p>전화번호: 000-000-000</p>
        <p>사업자등록: 000-000-000</p>
        <p>주소: 서울 특별시 성수동 성수구 협인E빌딩 805호</p>
        <p>© 2025 회사이름. All rights reserved. </p>
        <p>Designed & built by GlobalMig. </p>
      </div>
    </div>
  );
}
