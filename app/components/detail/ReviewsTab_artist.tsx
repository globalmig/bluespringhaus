"use client";
import React, { useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";

import { StarRatingInput } from "../common/StarRatingInput";
import { supabase } from "@/lib/supabase";

interface ReviewItemProps {
  reviews: Review[];
  artistId: string;
}

// TODO: 타입폴더에 정리 예정
export interface Review {
  id: number;
  artist_id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string; // ISO timestamp
}

export default function ReviewsTab_artist({ reviews, artistId }: ReviewItemProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewsState, setReviewsState] = useState<Review[]>(reviews);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      alert("별점을 선택해주세요!");
      return;
    }
    if (!comment.trim()) {
      alert("리뷰 내용을 입력해주세요!");
      return;
    }

    try {
      const res = await fetch("/api/review_artist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, artist_id: artistId }),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.error || "리뷰 작성 실패");
        return;
      }

      alert("리뷰가 등록되었습니다!");
      setRating(0);
      setComment("");
      setReviewsState(result.reviews);
    } catch (err) {
      console.error("리뷰 등록 에러:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };
  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      {/* 리뷰 작성 폼 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <StarRatingInput value={rating} onChange={setRating} />
        <div className="w-full flex gap-4">
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="리뷰를 작성해주세요" className="w-full border p-4 rounded-md resize-none h-40" />
          <button type="submit" className="bg-black py-8 rounded-xl text-white text-lg font-medium flex justify-center items-center gap-4 w-40">
            <FaPenToSquare />
            등록
          </button>
        </div>
      </form>

      {/* 리뷰 리스트 */}
      {reviewsState.map((item) => (
        <div key={item.id} className="w-full bg-white py-10 rounded-xl flex flex-col gap-4 px-8">
          <p>별점 {item.rating}</p>
          <div>{item.comment}</div>
          <div className="flex gap-2 mt-2 flex-wrap" />
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <p>{item.reviewer_name}</p>
            <p>{new Date(item.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
