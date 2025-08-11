import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Accordiond() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm md:text-xl">Q. 섭외는 얼마나 전에 문의해야 하나요?</AccordionTrigger>
          <AccordionContent className="flex flex-col text-balance">
            <p className="">
              A. 행사 일정 최소 2~4주 전에는 문의 주시는 것을 권장드립니다.
              <br /> 인기 연사의 경우 일찍 마감될 수 있으니, 가능한 한 빠른 시점에 문의 주세요.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-sm md:text-xl">Q. 섭외료는 어떻게 책정되나요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              A. 섭외료는 연사의 경력, 강연 주제, 행사 규모, 지역, 시간 등에 따라 다르며, 기본적으로는 연사의 기준 강연료를 기준으로 협의하게 됩니다. 예산이 정해져 있다면 미리 알려주시면 그에 맞는
              연사를 추천해드립니다.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-sm md:text-xl">Q. 연사사전 미팅이 가능한가요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>A. 대부분의 출연자는 행사 취지와 내용을 미리 공유받는 것을 선호합니다. 일정에 따라 조율이 필요할 수 있으니 미팅 가능 여부는 별도로 안내드립니다.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-sm md:text-xl">Q. 섭외 확정 후 취소 시 위약금이 발생하나요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              A. 섭외 확정 후 취소 시, 일정에 따라 위약금이 발생할 수 있습니다. 섭외 확정후 취소시 20% 위약금, 행사 14일 전 이후 취소 시 50%, 행사 7일 전 이후에는 전액이 청구될 수 있으니 일정 확정 후
              진행 부탁드립니다
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-sm md:text-xl">Q. 강연 외에 Q&A나 토크콘서트 등 다른 형식도 가능한가요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>A. 네! 대부분의 연사님들은 강연 외에도 대담, 패널 토크, Q&A 등 다양한 형식에 참여가 가능합니다. 원하시는 형식을 미리 알려주시면 가장 적합한 연사를 추천해드립니다.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-sm md:text-xl">Q. 지방/해외 강연도 가능한가요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>A. 네, 가능합니다. 단, 연사의 일정과 교통/숙박 등의 추가 비용이 발생할 수 있으므로 별도 협의가 필요합니다.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-7">
          <AccordionTrigger className="text-sm md:text-xl">Q. 섭외 진행은 어떤 절차로 이루어지나요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>
              A.
              <br /> 섭외 요청 접수
              <br />
              <br /> 출연자와 일정 및 조건 조율
              <br />
              <br /> 계약서 작성 및 확정
              <br />
              <br /> 행사 전 사전 논의
              <br />
              <br /> 행사 진행 강연 후 피드백 및 정산
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
