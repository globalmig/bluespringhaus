import React from "react";
import Image from "next/image";

export default function KakaoTalk() {
  return (
    <div className="fixed bottom-20 right-4 z-50">
      <a href="https://open.kakao.com/o/slx9vI5h" className="shadow-lg md:block hidden">
        <Image src="/image/kakao_btn.png" alt="카카오톡 문의" width={130} height={130} />
      </a>
      <a href="https://open.kakao.com/o/slx9vI5h" className="shadow-lg md:hidden block">
        <Image src="/image/kakao_btn.png" alt="카카오톡 문의" width={90} height={90} />
      </a>
    </div>
  );
}
