import React from "react";
import Link from "next/link";

export default function loginFinal() {
  return (
    <div className="flex flex-col justify-center items-center mt-10 px-4">
      <h2 className="text-3xl font-bold mb-2">회원가입</h2>
      <div className=" rounded-xl px-6 py-12 text-center shadow-sm w-full max-w-[1440px] my-10 border-2">
        <div className="flex flex-col items-center gap-3 ">
          <p className="text-lg font-semibold text-slate-900">회원가입을 축하드립니다.</p>
          <p className="text-lg font-semibold text-slate-900">🎤 지금 바로 섭외를 시작해보세요!✨</p>
          {/* <p className="text-base text-slate-700 leading-relaxed">
            등록하신 <span className="font-medium text-blue-600">이메일</span>로 인증 메일을 보냈어요.
            <br /> 메일함에서 <span className="font-medium text-blue-600">인증 링크</span>를 클릭하면 회원가입이 완료됩니다!
          </p> */}
          <Link href="/" className="border px-6 py-2 rounded-lg bg-black text-white mt-10">
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
