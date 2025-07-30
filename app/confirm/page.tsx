import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const ConfirmPage = dynamic(() => import("../components/confirm/ConfirmPage"), {
  ssr: false,
});

export default function ConfirmWrapper() {
  return (
    <Suspense fallback={<p>로딩 중입니다...</p>}>
      <ConfirmPage />
    </Suspense>
  );
}
