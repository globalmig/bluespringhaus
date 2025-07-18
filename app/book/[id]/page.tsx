"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import axios from "axios";

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const id = params?.id as string | undefined;

  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const checkEligibility = async () => {
      if (!id || !user) return;

      try {
        const res = await axios.get(`/api/inquiry/check?speakerId=${id}`);

        // ✅ API 응답 형식에 맞춘 처리
        if (res.data.canApply) {
          setIsAllowed(true);
          setErrorMessage("");
        } else {
          setIsAllowed(false);
          setErrorMessage(res.data.error || "이미 진행중인 문의가 있습니다.");
        }
      } catch (error: any) {
        console.error("🚫 문의 제한:", error);
        setIsAllowed(false);

        // ✅ 서버에서 반환된 에러 메시지 사용
        if (error.response?.data?.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("문의 권한을 확인할 수 없습니다.");
        }
      }
    };

    if (!loading && user) {
      checkEligibility();
    }
  }, [id, user, loading]);

  // ✅ 로딩 중이거나 로그인하지 않은 경우
  if (!id) {
    return <p className="text-center py-20 text-lg">잘못된 접근입니다. 페이지 ID가 없습니다.</p>;
  }

  if (loading || isAllowed === null) {
    return <p className="text-center py-20 text-lg">접근 가능 여부 확인 중...</p>;
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4">로그인 후 문의를 이용하실 수 있습니다.</p>
        <button onClick={() => router.push("/login")} className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          로그인하러 가기
        </button>
      </div>
    );
  }

  // ✅ 문의 불가능한 경우 (이미 처리 중인 문의가 있는 경우)
  if (isAllowed === false) {
    return (
      <div className="text-center py-20">
        <p className="text-lg mb-4">{errorMessage}</p>
        <button onClick={() => router.push(`/speakers/${id}`)} className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
          아티스트 페이지로 돌아가기
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const form = e.currentTarget;
    const userEmail = (form.elements.namedItem("userEmail") as HTMLInputElement | null)?.value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement | null)?.value;

    if (!userEmail) return alert("이메일을 입력해주세요!");
    if (!message) return alert("메시지를 입력해주세요!");

    setIsSubmitting(true);

    try {
      // ✅ 문의 전송 전 다시 한 번 권한 확인
      const checkRes = await axios.get(`/api/inquiry/check?speakerId=${id}`);

      if (!checkRes.data.canApply) {
        alert(checkRes.data.error || "이미 처리 중인 문의가 있습니다.");
        window.location.reload();
        return;
      }

      const res = await axios.post(
        "/api/contact",
        { userEmail, message, speakerId: id },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200 && res.data.success) {
        alert("문의가 성공적으로 전송되었습니다!");
        form.reset();

        router.push(`/speakers/${id}`);
      } else {
        alert(res.data.error || "문의 전송에 실패했습니다.");
      }
    } catch (error: any) {
      console.error("문의 전송 오류:", error);

      // ✅ 권한 체크 실패 시 특별 처리
      if (error.response?.status === 403) {
        alert("이미 처리 중인 문의가 있습니다. 페이지를 새로고침합니다.");
        window.location.reload();
      } else {
        alert("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
      
    }
  };

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
