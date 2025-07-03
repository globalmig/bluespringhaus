"use client";
import React from "react";
import { useParams } from "next/navigation";

export default function BookPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  return (
    <div className="mx-4 mt-10 pb-40 gap-10 flex flex-col">
      <h1 className="text-center text-3xl mb-2 font-bold">섭외하기</h1>
      <section className="w-full">
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const form = e.currentTarget;
            const userEmail = (form.elements.namedItem("userEmail") as HTMLInputElement | null)?.value;
            const message = (form.elements.namedItem("message") as HTMLTextAreaElement | null)?.value;

            if (!userEmail) return alert("이메일을 입력해주세요!");
            if (!message) return alert("메시지를 입력해주세요!");
            if (!id) return alert("잘못된 접근입니다. 강연자 정보가 없습니다.");

            try {
              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userEmail, message, speakerId: id }),
              });

              const result = await res.json();

              if (result.success) {
                alert("문의가 성공적으로 전송되었습니다!");
                form.reset();
              } else {
                alert(result.error || "문의 전송에 실패했습니다. 다시 시도해주세요.");
              }
            } catch (error) {
              console.error(error);
              alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
            }
          }}
          className="w-full flex flex-col justify-center max-w-[700px] mx-auto"
        >
          <label className="text-sm mb-2">이메일</label>
          <input name="userEmail" required placeholder="답변받으실 이메일을 입력해주세요" className="py-6 rounded-xl p-4 mb-10 border border-gray-300" />

          <label className="text-sm mb-2">상세내용</label>
          <textarea name="message" required placeholder="섭외날짜/원하시는 금액/상세 내용을 작성해주세요" className="py-4 rounded-xl min-h-[200px] resize-y p-4 border border-gray-300"></textarea>

          <button type="submit" className="bg-black text-white font-medium py-4 rounded-xl mt-10 hover:bg-gray-800 transition-colors">
            문의하기
          </button>
        </form>
      </section>
    </div>
  );
}
