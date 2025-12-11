import React from "react";
import Image from "next/image";

export default function KakaoTalk() {
  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end">
      <Image src={"/image/text.png"} alt="문의주세요" width={160} height={80} className="h-auto" />
      <a href="https://open.kakao.com/o/slx9vI5h" className="md:block hidden">
        <Image src="/image/kakao_btn.png" alt="카카오톡 문의" width={130} height={130} className="h-auto" />
      </a>
      <a href="https://open.kakao.com/o/slx9vI5h" className="md:hidden block">
        <Image src="/image/kakao_btn.png" alt="카카오톡 문의" width={90} height={90} className="h-auto" />
      </a>
    </div>
  );
}
