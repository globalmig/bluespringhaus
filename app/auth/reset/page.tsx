import ResetPassword from "@/app/components/ResetPassword";
import React, { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-zinc-500">Loading…</div>}>
      <ResetPassword />
    </Suspense>
  );
}
