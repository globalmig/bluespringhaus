import React from "react";

export default function page() {
  return (
    <div
      className="w-full max-w-[1440px] flex flex-col justify-start pt-40 items-center
    
    "
    >
      <h1 className="text-2xl">로그인</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="아이디" className="border p-2 rounded w-80" />
        <input type="password" placeholder="비밀번호" className="border p-2 rounded w-80" />
        <button type="submit" className="bg-black text-white p-2 rounded w-80 hover:bg-blue-600 transition-colors">
          로그인
        </button>
      </form>

      <p className="mt-14 mb-10">-------- or ----------</p>
      <div className="flex flex-col gap-4 mb-60">
        <div className="w-80 h-12 bg-black text-sm text-white flex justify-center items-center"> 간편로그인03</div>
      </div>
    </div>
  );
}
