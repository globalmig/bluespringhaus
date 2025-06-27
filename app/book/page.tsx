import { div } from "framer-motion/client";
import React from "react";

export default function book() {
  return (
    <div className="mx-4 mt-10 pb-40 gap-14 flex flex-col">
      <h1 className="text-center text-3xl mb-2 font-bold">문의하기</h1>
      <section>
        <form>
          <p>일정</p>
          <input type="text" required />
          <p>연락처</p>
          <input type="text" required />
          <p>장소</p>
          <input type="text" required />
        </form>
      </section>
    </div>
  );
}
