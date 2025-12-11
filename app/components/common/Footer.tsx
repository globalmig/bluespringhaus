import Link from "next/link";
import React from "react";
import { FaMicrophoneAlt } from "react-icons/fa";
import Image from "next/image";
import Script from "next/script";

export default function Footer() {
  return (
    <>
      <div className="border-2 w-full  flex py-12 flex-col items-center justify-center text-center bg-zinc-100">
        <div className="flex flex-col w-full max-w-[1440px] px-4 mx-auto ">
          <div className="flex mb-4">
            {/* <Link href="/" className="text-sm font-bold">
            이용약관
          </Link>
          <Link href="/" className="text-sm font-bold ml-4">
            개인정보처리방침
          </Link> */}
          </div>

          <Link href="/" className="font-bold text-lg justify-center md:text-xl text-center w-full flex md:items-center md:gap-2 text-sky-700 ">
            {/* <FaMicrophoneAlt />
          MICIMPACT */}
            <Image src={"/micimpact_logo.png"} alt="마이크임팩트 로고" width={100} height={260} />
          </Link>
          <Link href="/manager" className="text-sm font-bold text-zinc-400 mb-4">
            관리자페이지
          </Link>
          <div className="text-sm font-light text-zinc-500">
            <p>대표자: 김수정 | 사업자등록: 219-86-01868</p>
            <p>전화: 050-7141-60749</p>

            <p>이메일: micimpact.info@gmail.com</p>
            {/* <p>전화번호: 000-000-000</p> */}
            <p>주소: 제주특별자치도 제주시 고마로 105, 5층 501호(일도이동)</p>
            <p className="mt-4">© 2025 마이크임팩트. All rights reserved. </p>
            <a href="https://m-mig.com/homepage-development" className="hover:text-blue-700">
              Designed & built by GlobalMig.
            </a>
          </div>
        </div>
      </div>
      <Script src="//wsa.mig-log.com/wsalog.js" type="text/javascript" strategy="beforeInteractive" />
      <Script
        id="wsa-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            wsa.inflow("www.micimpact.net");
            wsa_do(wsa);
          `,
        }}
      />
    </>
  );
}
