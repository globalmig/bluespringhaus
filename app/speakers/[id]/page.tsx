import React from "react";
import Image from "next/image";
import HeroSlider from "@/app/components/detail/HeroSlider";
import Book from "@/app/components/detail/Book";

export default function SpeakerDetail() {
  return (
    <div>
      <div className="gap-14 flex flex-col w-full max-w-[1440px] mx-auto">
        {/* <div className="bg-black w-full max-w-[1440px] h-[600px]"></div> */}
        <HeroSlider />
        <h1 className="text-4xl font-bold">Speaker 김이름</h1>
        <div className="w-full flex flex-col">
          <div className="miniContain flex">
            <div className="flex">
              <Image src="" alt="" width={10} height={10} className="bg-black" />
              <p>5.0</p>
              <p>(4)</p>
            </div>
            <div className="flex">
              <Image src="" alt="" width={10} height={10} className="bg-black" />
              <p>1</p>
            </div>
          </div>
          <p>전국가능 • 경력 10년</p>
        </div>

        <p>체육대회 • 결혼식사회자 • 관공서 행사 • 온라인 행사 • 홈쇼핑/라이브커머스 • 컨퍼런스/세미나 • 홍보/전시행사 • 모임행사 • 준공식/개소식 • 정기 공연/연주 • 모델 • 결혼식 사회자 • 결혼식</p>

        <section>
          <div className="flex w-full justify-between items-center">
            <button className="w-[50%] border-b-2 pb-4 text-lg">진행자정보</button>
            <button className="w-[50%] border-b-2 pb-4 text-lg">리뷰(4)</button>
          </div>
        </section>

        <section className="flex flex-col  p-10  bg-white">
          <div className="flex">
            <Image src="" alt="" width={10} height={10} className="bg-black" />
            <p>김이름님을 소개합니다</p>
          </div>
          {/* TODO: 리뷰 시각화 */}
        </section>

        <section className="flex flex-col  p-10 bg-white">
          <h2 className="font-bold text-2xl">소개영상</h2>
          <p>이용석님의 영상 포트폴리오입니다!</p>
          <div className="bg-black rounded-lg w-full h-[500px] mt-4"></div>
        </section>

        <section className="flex flex-col  p-10 bg-white">
          <h2 className="font-bold text-2xl">행사 진행 리뷰</h2>
          <p>고객분들의 만족도를 한눈에 봐요!</p>
          <div className="bg-black rounded-lg w-full h-[500px] mt-4"></div>
        </section>

        <section className="flex flex-col  p-10 bg-white">
          <h2 className="font-bold text-2xl">경력 및 수상 내역</h2>
          <p>활동기록을 확인해보세요!</p>
          <div className="mt-4">
            <p>
              sbs광주방송(kbc) 서울경제tv LG헬로비전 아나운서 한국철도방송(코레일) 아나운서 검찰방송 아나운서 국방TV 기자 BBS불교방송 기자 -2025코레일 레일스타 발대식 -2025 광주 중소기업대전 -2025
              한국 벤처캐피탈 대상 -2025 웰스 매니지먼트 어워즈 시상식 -2025 영산강 유역 환경청 물의 날 행사 -2025 GCOOP 킥오프 세미나 행사 -2025 리드 테이블 어워즈 시상식 -2024 현대모비스
              ESG아이디어톤 공유 -2024 동두천 락 페스티벌 -2024 코리아 스타트업 어워즈 -2024 서울 성동구 사랑의 열매 행사 -2024 춘천 장애인 복지관 소통콘서트 -2024 경북대학교 직무 마스터 발표회 -2024
              콘텐츠 스타트 성과 쇼케이스 -2024 용산구 주민자치회 성과발표회 -2024 아리수 팝업 행사 진행 -2024 울산시청 청렴 행사 -2024 울산시 교육청 mc -2024 경기도자비엔날레 시상식 -2024 종로구
              양성평등주간기념행사 -2024 오토컨퍼런스 진행 -2024 차이나 컨퍼런스 -2024 CFO 포럼 진행 -2024 중국 후난성 홍보 행사 -2024 강릉 경찰청 청렴 행사 -2024 영산강 유역 환경청 물의 날 행사 -2024
              벤처캐피털 대상 -2023 한국 하우톤 창립50주년 기념행사 -2023 예천군 예천희망키움센터 개관식 -2023 HD현대건설기계 MEX글로벌 런칭쇼{" "}
            </p>
          </div>
        </section>

        <section className="flex flex-col mb-10 md:mb-20  p-10 bg-white">
          <h2 className="font-bold text-2xl">자주묻는질문</h2>
          <p>전문가님께 자주묻는 질문을 모아놨어요!</p>
          <div className="mt-4">
            <p>
              sbs광주방송(kbc) 서울경제tv LG헬로비전 아나운서 한국철도방송(코레일) 아나운서 검찰방송 아나운서 국방TV 기자 BBS불교방송 기자 -2025코레일 레일스타 발대식 -2025 광주 중소기업대전 -2025
              한국 벤처캐피탈 대상 -2025 웰스 매니지먼트 어워즈 시상식 -2025 영산강 유역 환경청 물의 날 행사 -2025 GCOOP 킥오프 세미나 행사 -2025 리드 테이블 어워즈 시상식 -2024 현대모비스
              ESG아이디어톤 공유 -2024 동두천 락 페스티벌 -2024 코리아 스타트업 어워즈 -2024 서울 성동구 사랑의 열매 행사 -2024 춘천 장애인 복지관 소통콘서트 -2024 경북대학교 직무 마스터 발표회 -2024
              콘텐츠 스타트 성과 쇼케이스 -2024 용산구 주민자치회 성과발표회 -2024 아리수 팝업 행사 진행 -2024 울산시청 청렴 행사 -2024 울산시 교육청 mc -2024 경기도자비엔날레 시상식 -2024 종로구
              양성평등주간기념행사 -2024 오토컨퍼런스 진행 -2024 차이나 컨퍼런스 -2024 CFO 포럼 진행 -2024 중국 후난성 홍보 행사 -2024 강릉 경찰청 청렴 행사 -2024 영산강 유역 환경청 물의 날 행사 -2024
              벤처캐피털 대상 -2023 한국 하우톤 창립50주년 기념행사 -2023 예천군 예천희망키움센터 개관식 -2023 HD현대건설기계 MEX글로벌 런칭쇼
            </p>
          </div>
        </section>
      </div>
      <Book />
    </div>
  );
}
