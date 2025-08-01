"use client";
import React, { useState } from "react";
import { FaPenToSquare, FaTrash } from "react-icons/fa6";
import { useAuth } from "@/app/contexts/AuthContext";

import { StarRatingInput } from "../common/StarRatingInput";
import type { Reviews } from "@/types/Review";

interface ReviewItemProps {
  reviews: Reviews[];
  artistId: string;
}

export default function ReviewsTab_artist({ reviews, artistId }: ReviewItemProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewsState, setReviewsState] = useState<Reviews[]>(reviews);

  // ✅ 수정 모드 상태 관리
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

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
      const res = await fetch(`/api/artists/review`, {
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

  // ✅ 리뷰 수정 시작
  const handleEditStart = (review: Reviews) => {
    setEditingReviewId(Number(review.id));
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // ✅ 리뷰 수정 취소
  const handleEditCancel = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment("");
  };

  // ✅ 리뷰 수정 완료
  const handleEditSubmit = async (reviewId: number) => {
    if (!editRating) {
      alert("별점을 선택해주세요!");
      return;
    }
    if (!editComment.trim()) {
      alert("리뷰 내용을 입력해주세요!");
      return;
    }

    try {
      const res = await fetch(`/api/artists/review/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: editRating, comment: editComment }),
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.error || "리뷰 수정 실패");
        return;
      }

      alert("리뷰가 수정되었습니다!");
      setEditingReviewId(null);
      setEditRating(0);
      setEditComment("");
      setReviewsState(result.reviews);
    } catch (err) {
      console.error("리뷰 수정 에러:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  // ✅ 리뷰 삭제
  const handleDelete = async (reviewId: number) => {
    if (!confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const res = await fetch(`/api/artists/review/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        alert(result.error || "리뷰 삭제 실패");
        return;
      }

      alert("리뷰가 삭제되었습니다!");
      setReviewsState(result.reviews);
    } catch (err) {
      console.error("리뷰 삭제 에러:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-slate-100">
      <div className="w-full flex flex-col gap-4 pt-10 pb-32  px-4 max-w-[1440px] mx-auto">
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
            {/* ✅ 수정 모드인 경우 */}
            {editingReviewId === item.id ? (
              <div className="flex flex-col gap-4">
                <StarRatingInput value={editRating} onChange={setEditRating} />
                <textarea value={editComment} onChange={(e) => setEditComment(e.target.value)} className="w-full border p-4 rounded-md resize-none h-32" />
                <div className="flex gap-2">
                  <button onClick={() => handleEditSubmit(item.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    수정 완료
                  </button>
                  <button onClick={handleEditCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
                    취소
                  </button>
                </div>
              </div>
            ) : (
              // ✅ 일반 보기 모드
              <>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p>별점 {item.rating}</p>
                    <div className="mt-2">{item.comment}</div>
                  </div>

                  {/* ✅ 본인 리뷰인 경우에만 수정/삭제 버튼 표시 */}
                  {user && user.id === item.user_id && (
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleEditStart(item)} className="text-blue-500 hover:text-blue-700 p-2" title="수정">
                        <FaPenToSquare />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-2" title="삭제">
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                  <p>{item.name}</p>
                  <p>{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
