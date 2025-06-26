import React from "react";
import Image from "next/image";

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  return (
    <>
      {/* 모바일 태블릿 버전 */}
      <div className="w-full max-w-[420px] h-[700px] rounded-2xl flex flex-col justify-start py-20 items-center bg-white md:relative lg:hidden ">
        <div className="w-full pb-10">
          <h3 className="text-3xl text-start w-full pl-16">성공적인 섭외,</h3>
          <h3 className="text-3xl text-start w-full pl-16 ">로그인으로 시작됩니다.</h3>
        </div>

        {/* m 닫기 버튼 */}
        <button className="w-10 h-10 absolute top-4 md:right-4 right-12 " onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/*m  로그인 form*/}
        <form className="flex flex-col gap-4">
          <input type="text" placeholder="아이디" className="border p-2 rounded w-80" />
          <input type="password" placeholder="비밀번호" className="border p-2 rounded w-80" />
          <button type="submit" className="bg-black text-white h-11 rounded w-80 hover:bg-blue-600 transition-colors">
            로그인
          </button>
          <div className="flex justify-center gap-10 mb-10">
            <button>회원가입</button>
            <button>아이디/비번찾기</button>
          </div>
        </form>

        <div className="flex flex-col gap-4 mb-60">
          <div className="w-80 bg-black text-sm text-white flex justify-center items-center h-11 rounded">간편로그인03</div>
        </div>
      </div>

      {/* pc버전 */}
      <div className="w-full max-w-[1400px] h-[760px] rounded-2xl lg:flex flex-col justify-start py-20 items-center bg-white  relative hidden ">
        <div className="bg-black w-[50%] h-full top-0 left-0 rounded-l-2xl absolute">
          <video src="/videos/login_pc_2.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover rounded-l-2xl" />
        </div>
        <div className="w-[50%] absolute top-0 right-0 h-full flex flex-col">
          <div className="w-full mt-8 py-10 px-20 ">
            <h3 className="text-4xl text-start w-full pl-16 mb-2">성공적인 섭외,</h3>
            <h3 className="text-4xl text-start w-full pl-16 ">로그인으로 시작됩니다.</h3>
          </div>

          {/* m 닫기 버튼 */}
          <button className="w-11 h-11 absolute top-4 md:right-4 right-12 " onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* pc 로그인 form */}
          <form className="flex flex-col gap-4 w-full justify-center items-center">
            <input type="text" placeholder="아이디" className="border p-2 rounded w-[60%]" />
            <input type="password" placeholder="비밀번호" className="border p-2 rounded w-[60%]" />
            <button type="submit" className="bg-black text-white h-11 rounded w-[60%] hover:bg-blue-600 transition-colors py-7 flex items-center justify-center">
              로그인
            </button>
            <div className="flex justify-center gap-10 mb-10">
              <button>회원가입</button>
              <button>아이디/비번찾기</button>
            </div>
          </form>
          <div className="flex flex-col w-full justify-center items-center gap-4 mb-60">
            <p>or</p>
            <div className="w-[60%] py-7 bg-black text-sm text-white flex justify-center items-center h-11 rounded">간편로그인03</div>
            <div className="w-[60%] py-7 bg-black text-sm text-white flex justify-center items-center h-11 rounded">간편로그인03</div>
          </div>
        </div>
      </div>
    </>
  );
}
