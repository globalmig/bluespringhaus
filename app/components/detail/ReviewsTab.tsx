import React from "react";

import { mockReviews } from "@/mock/mockReviews";

interface ReviewItemProps {
  reviews: any[]; // reviews 테이블 구조에 맞춰 타입 선언하는 게 이상적이지만, 우선 any로 작성
}

export default function ReviewsTab({ reviews }: ReviewItemProps) {
  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      {reviews.map((item) => (
        <div className="flex flex-col gap-2">
          <div className="w-full bg-white py-10 rounded-xl flex flex-col gap-4 px-8" key={item.id}>
            <p>별점 {item.rating}</p>
            <div>{item.comment}</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              {/* {item.tags.map((tag, idx) => (
              <p key={idx} className="bg-black text-white px-3 py-1 rounded-full">
                #{tag}
              </p>
            ))} */}
              <div></div>
            </div>
            <div className="flex  gap-4 mt-4">
              <p>{item.reviewer}</p>
              <p>{new Date(item.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
