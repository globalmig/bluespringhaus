import React from "react";
import Link from "next/link";

export default function loginFinal() {
  return (
    <div className="flex flex-col justify-center items-center mt-10 ">
      <h2 className="text-3xl font-bold mb-2">회원가입 안내</h2>
      <p className="text-base text-slate-600">마지막 단계까지 완료해주세요!</p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-12 text-center shadow-sm w-full max-w-[1440px] my-10">
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg font-semibold text-slate-900">인증 메일이 발송되었습니다 📧</p>
          <p className="text-base text-slate-700 leading-relaxed">
            등록하신 <span className="font-medium text-blue-600">이메일</span>로 인증 메일을 보냈어요.
            <br /> 메일함에서 <span className="font-medium text-blue-600">인증 링크</span>를 클릭하면 회원가입이 완료됩니다!
          </p>
          <Link href="/" className="border px-6 py-2 rounded-lg bg-black text-white mt-10">
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
