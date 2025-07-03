import React from "react";
import { mockReviews } from "@/mock/mockReviews";

export default function ReviewItem_mini() {
  return (
    <div className="flex flex-col md:flex-row gap-2 mt-4">
      {mockReviews.map((item) => (
        <div className="relative w-full md:w-80 border bg-white py-10 rounded-xl flex flex-col gap-4 px-8" key={item.id}>
          <div className="flex items-center gap-4">
            <p className="font-bold text-lg">별점 {item.rating}</p>
            <p className="border-l pl-4 text-sm text-zinc-400">{item.reviewer}</p>
          </div>

          <div>{item.comment}</div>
        </div>
      ))}
    </div>
  );
}
