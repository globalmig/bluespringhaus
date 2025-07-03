import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Accordiond() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Q. 섭외는 얼마나 전에 문의해야 하나요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>A. 행사 일정 최소 2~4주 전에는 문의 주시는 것을 권장드립니다. 인기 강사의 경우 일정이 빠르게 마감되니 가능한 한 빠른 시점에 연락 주세요.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Q. 강연료는 어떻게 책정되나요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>A. 강연료는 강사의 경력, 강연 시간, 행사 규모, 장소 등에 따라 상이합니다. 문의 시 상세한 행사 정보를 알려주시면 정확한 견적을 안내드립니다.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Q. 연사와 사전 미팅이 가능한가요?</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>A. 대부분의 연사는 사전 미팅 또는 전화/화상 미팅을 통해 강연 내용과 방향성을 조율하고 있습니다. 일정 조율 후 미팅이 가능합니다.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
