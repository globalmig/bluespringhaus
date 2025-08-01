import React from "react";

export default function Test() {
  return (
    <div className="flex flex-col w-full max-w-full">
      <h3>안녕하세요. 마이크임팩트입니다. </h3>
      <p>고객분께서 강연 일정을 문의하셨습니다.</p>
      <p>아래와 같이 섭외 문의드립니다</p>
      <p>개최: </p>
      <p>담당자 이름:</p>
      <p>담당자 전화번호:</p>
      <p>담당자 이메일:</p>
      <br />
      <p>행사 명:</p>
      <p>행사 한줄 설명:</p>
      <p>일자:</p>
      <p>장소:</p>
      <p>대상:</p>
      <p>대상 인원수:</p>
      <p>요청사항:</p>
      <p>요청 시간:</p>
      <p>섭외비:</p>
      <p>기타사항:</p>
      <p></p>
      <br />
      <p>
        // TODO: 도메인 명으로 변경해야함
        <a href="https://bluespringhaus-rbt5.vercel.app/api/inquiry_artist/handle?inquiryId=${inquiryId}&action=accept&token=${token}">수락</a>
        <a href="https://bluespringhaus-rbt5.vercel.app/api/inquiry_artist/handle?inquiryId=${inquiryId}&action=reject&token=${token}">거절</a>
      </p>
    </div>
  );
}
