// app/artists/book/[id]/page.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function BookPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  // Supabase + NextAuth(Kakao)
  const { user, loading: authLoading } = useAuth();
  const { status } = useSession();
  const sessionLoading = status === "loading";
  const isAuthed = !!user || status === "authenticated";

  const id = params?.id;

  // true = 가능 / false = 불가 / null = 판단불가(비로그인/오류) / undefined = 초기
  const [isAllowed, setIsAllowed] = useState<boolean | null | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!id) {
        setIsAllowed(null);
        setErrorMessage("잘못된 접근입니다. 페이지 ID가 없습니다.");
        return;
      }
      if (authLoading || sessionLoading) return;

      if (!isAuthed) {
        setIsAllowed(null);
        setErrorMessage("로그인 후 섭외를 이용하실 수 있습니다.");
        return;
      }

      try {
        const res = await axios.get("/api/inquiry/check_artist", {
          params: { artistId: id, _t: Date.now() }, // 캐시 버스터
          withCredentials: true,
          headers: { "Cache-Control": "no-cache" },
        });
        if (!mounted.current) return;
        setIsAllowed(res.data?.canApply === true);
        setErrorMessage("");
      } catch (error: any) {
        if (!mounted.current) return;
        const status = error?.response?.status;
        const data = error?.response?.data;

        // 409 → 프로필 동기화 후 재시도
        if (status === 409 || data?.requiresSync) {
          try {
            await axios.post("/api/user/sync", {}, { withCredentials: true });
            const r2 = await axios.get("/api/inquiry/check_artist", {
              params: { artistId: id, _t: Date.now() },
              withCredentials: true,
              headers: { "Cache-Control": "no-cache" },
            });
            setIsAllowed(r2.data?.canApply === true);
            setErrorMessage(r2.data?.canApply ? "" : r2.data?.reason || "섭외 권한을 확인할 수 없습니다.");
          } catch (e2: any) {
            setIsAllowed(null);
            setErrorMessage(e2?.response?.data?.error || "섭외 권한을 확인할 수 없습니다.");
          }
          return;
        }

        if (status === 403) {
          setIsAllowed(false);
          setErrorMessage(data?.reason || "이미 진행중인 섭외가 있습니다.");
          return;
        }

        if (status === 401) {
          setIsAllowed(null);
          setErrorMessage("로그인이 필요합니다.");
          return;
        }

        setIsAllowed(null);
        setErrorMessage(data?.error || "섭외 권한을 확인할 수 없습니다.");
      }
    };

    checkEligibility();
  }, [id, isAuthed, authLoading, sessionLoading]);

  // ─ UI 분기 ─
  if (!id) return <p className="text-center py-20 text-lg">잘못된 접근입니다. 페이지 ID가 없습니다.</p>;

  if (authLoading || sessionLoading || isAllowed === undefined) {
    return <p className="text-center py-20 text-lg">접근 가능 여부 확인 중...</p>;
  }

  if (!isAuthed) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4">{errorMessage || "로그인 후 섭외를 이용하실 수 있습니다."}</p>
        <button onClick={() => router.push(`/login?next=/artists/book/${id}`)} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          로그인하러 가기
        </button>
      </div>
    );
  }

  if (isAllowed === false) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4">{errorMessage || "이미 진행중인 섭외가 있습니다."}</p>
        <button onClick={() => router.push(`/artists/${id}`)} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
          아티스트 페이지로 돌아가기
        </button>
      </div>
    );
  }

  // ─ 제출 ─
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget as HTMLFormElement & {
      host: HTMLInputElement;
      manager_name: HTMLInputElement;
      manager_phone: HTMLInputElement;
      event_title: HTMLInputElement;
      event_summary: HTMLInputElement;
      event_date: HTMLInputElement;
      event_location: HTMLInputElement;
      audience_type: HTMLInputElement;
      audience_count: HTMLInputElement;
      requested_time: HTMLInputElement;
      offer_fee: HTMLInputElement;
      additional_notes: HTMLTextAreaElement;
      userEmail: HTMLInputElement;
      message: HTMLTextAreaElement;
    };

    const userEmail = form.userEmail?.value;
    const message = form.message?.value;

    if (!userEmail) return alert("이메일을 입력해주세요!");
    if (!message) return alert("메시지를 입력해주세요!");

    setIsSubmitting(true);

    try {
      // 전송 직전 재확인 (캐시 버스터)
      const checkRes = await axios.get("/api/inquiry/check_artist", {
        params: { artistId: id, _t: Date.now() },
        withCredentials: true,
        headers: { "Cache-Control": "no-cache" },
      });
      if (!checkRes.data?.canApply) {
        alert(checkRes.data?.reason || "이미 처리 중인 섭외가 있습니다.");
        window.location.reload();
        return;
      }

      const res = await axios.post(
        "/api/contact_artist",
        {
          userEmail,
          message,
          artistId: id,
          host: form.host.value,
          manager_name: form.manager_name.value,
          manager_phone: form.manager_phone.value,
          event_title: form.event_title.value,
          event_summary: form.event_summary.value,
          event_date: form.event_date.value,
          event_location: form.event_location.value,
          audience_type: form.audience_type.value,
          audience_count: form.audience_count.value,
          requested_time: form.requested_time.value,
          offer_fee: form.offer_fee.value,
          additional_notes: form.additional_notes.value,
        },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );

      if (res.status === 200 && res.data?.success) {
        alert("섭외가 성공적으로 전송되었습니다!");
        form.reset();
        router.push(`/artists/${id}`);
      } else {
        alert(res.data?.error || "섭외 전송에 실패했습니다.");
      }
    } catch (error: any) {
      if (error?.response?.status === 409 || error?.response?.data?.requiresSync) {
        // 동기화 후 재시도 안내
        try {
          await axios.post("/api/user/sync", {}, { withCredentials: true });
          alert("프로필이 동기화되었습니다. 다시 시도해 주세요.");
        } catch {
          alert("프로필 동기화에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
      } else if (error?.response?.status === 403) {
        alert("이미 처리 중인 섭외가 있습니다. 페이지를 새로고침합니다.");
        window.location.reload();
      } else if (error?.response?.status === 401) {
        alert("로그인이 필요합니다.");
        router.push(`/login?next=/artists/book/${id}`);
      } else {
        console.error("섭외 전송 오류:", error);
        alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─ 폼 UI ─
  return (
    <div className="mx-auto px-4 mt-10 pb-40 gap-10 flex flex-col justify-center items-center">
      <h1 className="text-center text-3xl mb-2 font-bold">섭외하기</h1>
      <section className="w-full flex justify-center">
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
            <input id="requested_time" name="requested_time" type="time" required disabled={isSubmitting} className="py-4 px-4 rounded-xl border border-gray-300 disabled:opacity-50" />
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
              <span className="px-3 w-20 h-full flex justify-center items-center py-1 border border-l-0 border-gray-300 rounded-r-xl text-gray-600">만원</span>
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white font-medium py-4 rounded-xl mt-10 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "전송 중..." : "섭외하기"}
          </button>
        </form>
      </section>
    </div>
  );
}
