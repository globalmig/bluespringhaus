"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const id = params?.id as string | undefined;

  if (!id) {
    return <p className="text-center py-20 text-lg">잘못된 접근입니다. 페이지 ID가 없습니다.</p>;
  }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) {
      alert("로그인 상태를 확인 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!user) {
      alert("로그인 후 문의하실 수 있습니다!");
      return;
    }

    if (isSubmitting) return; // 중복 제출 방지

    const form = e.currentTarget;
    const userEmail = (form.elements.namedItem("userEmail") as HTMLInputElement | null)?.value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement | null)?.value;

    if (!userEmail) return alert("이메일을 입력해주세요!");
    if (!message) return alert("메시지를 입력해주세요!");
    if (!id) return alert("잘못된 접근입니다. 강연자 정보가 없습니다.");

    setIsSubmitting(true);

    try {
      console.log("보내는 값 확인:", {
        userEmail,
        message,
        artistId: id,
        user_id: user?.id,
      });
      const res = await fetch("/api/contact_artist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userEmail,
          message,
          artistId: id,
          user_id: user.id, // 안전하게 접근 가능
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("서버에서 올바르지 않은 응답을 받았습니다.");
      }

      const result = await res.json();

      if (res.ok && result.success) {
        alert("문의가 성공적으로 전송되었습니다!");
        form.reset();
        router.push(`/artists/${id}`);
      } else {
        alert(result.error || "문의 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("문의 전송 오류:", error);
      alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 렌더링 단계에서 로그인 상태 체크
  if (loading) {
    return <p className="text-center py-20 text-lg">로그인 상태를 확인 중입니다...</p>;
  }

  if (!user) {
    return <p className="text-center py-20 text-lg">로그인 후 문의를 이용하실 수 있습니다.</p>;
  }

  return (
    <div className="mx-4 mt-10 pb-40 gap-10 flex flex-col">
      <h1 className="text-center text-3xl mb-2 font-bold">섭외하기</h1>
      <section className="w-full">
        <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center max-w-[700px] mx-auto">
          <label className="text-sm mb-2">이메일</label>
          <input
            name="userEmail"
            type="email"
            required
            disabled={isSubmitting}
            placeholder="답변받으실 이메일을 입력해주세요"
            className="py-6 rounded-xl p-4 mb-10 border border-gray-300 disabled:opacity-50"
          />

          <label className="text-sm mb-2">상세내용</label>
          <textarea
            name="message"
            required
            disabled={isSubmitting}
            placeholder="섭외날짜/원하시는 금액/상세 내용을 작성해주세요"
            className="py-4 rounded-xl min-h-[200px] resize-y p-4 border border-gray-300 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-medium py-4 rounded-xl mt-10 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "전송 중..." : "문의하기"}
          </button>
        </form>
      </section>
    </div>
  );
}
