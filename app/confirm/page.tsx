"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const inquiryId = searchParams?.get("inquiryId");
  const action = searchParams?.get("action");
  const token = searchParams?.get("token");

  const [status, setStatus] = useState<"pending" | "success" | "fail" | "form">("pending");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!inquiryId || !action || !token) {
      setStatus("fail");
      return;
    }

    if (action === "accept") {
      // 수락은 즉시 처리
      const accept = async () => {
        try {
          const res = await axios.get(`/api/inquiry/handle?inquiryId=${inquiryId}&action=${action}&token=${token}`);
          setStatus(res.data.success ? "success" : "fail");
        } catch {
          setStatus("fail");
        }
      };
      accept();
    } else if (action === "reject") {
      // 거절은 사유 입력을 위해 form 상태로 대기
      setStatus("form");
    }
  }, [inquiryId, action, token]);

  const handleReject = async () => {
    try {
      const res = await axios.post("/api/inquiry/handle", {
        inquiryId,
        action: "reject",
        token,
        reason,
      });

      setStatus(res.data.success ? "success" : "fail");
    } catch {
      setStatus("fail");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
      {status === "pending" && <p>처리 중입니다...</p>}

      {status === "form" && (
        <div className="max-w-md w-full bg-white shadow p-6 rounded-lg">
          <h2 className="text-lg font-bold mb-4">거절 사유를 입력해주세요</h2>
          <textarea rows={4} className="w-full border rounded p-2" placeholder="거절 사유를 입력하세요" value={reason} onChange={(e) => setReason(e.target.value)} />
          <button onClick={handleReject} className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition" disabled={!reason.trim()}>
            거절 처리하기
          </button>
        </div>
      )}

      {status === "success" && <p className="text-green-600 font-bold text-xl mt-4">정상적으로 처리되었습니다.</p>}
      {status === "fail" && <p className="text-red-600 font-bold text-xl mt-4">유효하지 않거나 처리에 실패했습니다.</p>}
    </div>
  );
}
