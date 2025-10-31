// app/book/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  const { status } = useSession();

  const sessionLoading = status === "loading";
  const isAuthed = !!user || status === "authenticated";

  const id = params?.id as string | undefined;

  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const checkEligibility = async () => {
      if (!id) return;
      if (authLoading || sessionLoading) return; // 판단 전 대기

      if (!isAuthed) {
        setIsAllowed(false);
        setErrorMessage("로그인 후 섭외를 이용하실 수 있습니다.");
        return;
      }

      try {
        const res = await axios.get(`/api/inquiry/check?speakerId=${id}`, {
          withCredentials: true,
        });
        if (res.data.canApply) {
          setIsAllowed(true);
          setErrorMessage("");
        } else {
          setIsAllowed(false);
          setErrorMessage(res.data.error || "이미 진행중인 섭외가 있습니다.");
        }
      } catch (error: any) {
        console.error("🚫 섭외 제한:", error);
        setIsAllowed(false);
        setErrorMessage(error.response?.data?.error || "섭외 권한을 확인할 수 없습니다.");
      }
    };

    checkEligibility();
  }, [id, isAuthed, authLoading, sessionLoading]);

  if (!id) return <p className="text-center py-20 text-lg">잘못된 접근입니다. 페이지 ID가 없습니다.</p>;
  if (authLoading || sessionLoading || isAllowed === null) return <p className="text-center py-20 text-lg">접근 가능 여부 확인 중...</p>;

  if (!isAuthed) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4">{errorMessage || "로그인이 필요합니다."}</p>
        <button onClick={() => router.push(`/login?next=/book/${id}`)} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          로그인하러 가기
        </button>
      </div>
    );
  }

  if (isAllowed === false) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4">{errorMessage}</p>
        <button onClick={() => router.push(`/speakers/${id}`)} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
          상세 페이지로 돌아가기
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget as HTMLFormElement;
    const userEmail = (form.elements.namedItem("userEmail") as HTMLInputElement)?.value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value;

    if (!userEmail) return alert("이메일을 입력해주세요!");
    if (!message) return alert("메시지를 입력해주세요!");

    setIsSubmitting(true);

    try {
      // 전송 직전 재확인 (동시성 방어)
      const checkRes = await axios.get(`/api/inquiry/check?speakerId=${id}`, {
        withCredentials: true,
      });
      if (!checkRes.data.canApply) {
        alert(checkRes.data.error || "이미 처리 중인 섭외가 있습니다.");
        window.location.reload();
        return;
      }

      const res = await axios.post(
        "/api/contact",
        {
          userEmail,
          message,
          speakerId: id,
          host: (form.elements.namedItem("host") as HTMLInputElement).value,
          manager_name: (form.elements.namedItem("manager_name") as HTMLInputElement).value,
          manager_phone: (form.elements.namedItem("manager_phone") as HTMLInputElement).value,
          event_title: (form.elements.namedItem("event_title") as HTMLInputElement).value,
          event_summary: (form.elements.namedItem("event_summary") as HTMLInputElement).value,
          event_date: (form.elements.namedItem("event_date") as HTMLInputElement).value,
          event_location: (form.elements.namedItem("event_location") as HTMLInputElement).value,
          audience_type: (form.elements.namedItem("audience_type") as HTMLInputElement).value,
          audience_count: (form.elements.namedItem("audience_count") as HTMLInputElement).value,
          requested_time: (form.elements.namedItem("requested_time") as HTMLInputElement).value,
          offer_fee: (form.elements.namedItem("offer_fee") as HTMLInputElement).value,
          additional_notes: (form.elements.namedItem("additional_notes") as HTMLTextAreaElement).value,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200 && res.data.success) {
        alert("섭외가 성공적으로 전송되었습니다!");
        form.reset();
        router.push(`/speakers/${id}`);
      } else {
        alert(res.data.error || "섭외 전송에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("섭외 전송 오류:", error);
      if (error.response?.status === 403) {
        alert("이미 처리 중인 섭외가 있습니다. 페이지를 새로고침합니다.");
        window.location.reload();
      } else {
        alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 폼 UI는 그대로
  return (
    /* ...현재 폼 그대로... */
    <div className="mx-4 mt-10 pb-40 flex flex-col items-center">
      <h1 className="text-3xl mb-6 font-bold text-center">섭외하기</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl grid gap-6">
        {[
          { name: "host", label: "주최", placeholder: "주최정보를 입력해주세요" },
          { name: "manager_name", label: "담당자 이름", placeholder: "주최 담당자 이름을 입력해주세요" },
          { name: "event_title", label: "행사명", placeholder: "행사명을 입력해주세요" },
          { name: "event_summary", label: "행사 한줄 설명", placeholder: "행사를 간략하게 설명해주세요." },
          { name: "event_location", label: "장소", placeholder: "행사 장소를 입력해주세요" },
          { name: "audience_type", label: "대상", placeholder: "행사 대상을 입력해주세요" },
          { name: "audience_count", label: "행사 인원수", placeholder: "행사에 참여하는 인원수를 입력해주세요" },
        ].map(({ name, label, placeholder }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm mb-1">
              {label}
            </label>
            <input id={name} name={name} required disabled={isSubmitting} placeholder={placeholder} className="py-4 px-4 rounded-xl border border-gray-300 disabled:opacity-50" />
          </div>
        ))}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="manager_phone" className="text-sm mb-1">
              전화번호
            </label>
            <input
              id="manager_phone"
              name="manager_phone"
              type="tel"
              required
              disabled={isSubmitting}
              placeholder="담당자 전화번호를 입력해주세요"
              className="py-4 px-4 rounded-xl border border-gray-300 disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="userEmail" className="text-sm mb-1">
              이메일
            </label>
            <input
              id="userEmail"
              name="userEmail"
              type="email"
              required
              disabled={isSubmitting}
              placeholder="답변받으실 이메일을 입력해주세요"
              className="py-4 px-4 rounded-xl border border-gray-300 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="event_date" className="text-sm mb-1">
            일자
          </label>
          <input
            id="event_date"
            name="event_date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            required
            disabled={isSubmitting}
            className="py-4 px-4 rounded-xl border border-gray-300 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="requested_time" className="text-sm mb-1">
            진행시간
          </label>
          <input
            id="requested_time"
            name="requested_time"
            required
            disabled={isSubmitting}
            placeholder="진행시간을 입력해주세요. 예) 오후 2시, 오전 5시"
            className="py-4 px-4 rounded-xl border border-gray-300 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="offer_fee" className="text-sm mb-1">
            섭외비
          </label>
          <div className="flex items-center">
            <input
              id="offer_fee"
              name="offer_fee"
              type="number"
              min={0}
              step={1}
              required
              disabled={isSubmitting}
              placeholder="섭외비를 입력해주세요."
              className="w-full p-4 rounded-l-xl border text-end border-r-0 border-gray-300 disabled:opacity-50"
            />
            <span className="px-3 w-20 h-full flex justify-center items-center py-1 border border-l-0 border-gray-300 rounded-r-xl  text-gray-600">만원</span>
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="message" className="text-sm mb-1">
            요청사항
          </label>
          <textarea
            id="message"
            name="message"
            required
            disabled={isSubmitting}
            placeholder="요청사항을 입력해주세요"
            className="min-h-[160px] resize-y p-4 rounded-xl border border-gray-300 disabled:opacity-50"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="additional_notes" className="text-sm mb-1">
            기타사항
          </label>
          <textarea
            id="additional_notes"
            name="additional_notes"
            required
            disabled={isSubmitting}
            placeholder="기타사항을 입력해주세요."
            className="min-h-[160px] resize-y p-4 rounded-xl border border-gray-300 disabled:opacity-50"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="bg-black text-white font-medium py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? "전송 중..." : "섭외하기"}
        </button>
      </form>
    </div>
  );
}
