// mock/mockReviews.ts
export interface Review {
  id: string;
  reviewer: string;
  rating: number;
  comment: string;
  tags: string[];
  created_at: string;
}

export const mockReviews: Review[] = [
  {
    id: "1",
    reviewer: "홍길동",
    rating: 5,
    comment: "강연이 정말 유익하고 재미있었어요! 바로 적용할 수 있는 팁도 많이 배웠습니다.",
    tags: ["깔끔한 이미지", "발성", "만족도", "구성력"],
    created_at: "2025-06-30T14:23:00",
  },
  {
    id: "2",
    reviewer: "김철수",
    rating: 4,
    comment: "깔끔한 자료와 풍부한 사례로 이해하기 쉬웠어요. 조금 더 활동적인 시간이 있었으면 좋았을 것 같아요.",
    tags: ["깔끔한 이미지", "발성", "만족도", "구성력"],
    created_at: "2025-06-29T09:45:00",
  },
  {
    id: "3",
    reviewer: "이영희",
    rating: 5,
    comment: "강사님의 열정이 느껴져서 집중이 잘 됐습니다. 조직에 꼭 필요한 내용이었어요.",
    tags: ["깔끔한 이미지", "발성", "만족도", "구성력"],
    created_at: "2025-06-28T16:10:00",
  },
  {
    id: "4",
    reviewer: "박민수",
    rating: 5,
    comment: "재미와 감동이 함께한 강의였어요. 직원들이 모두 만족했습니다!",
    tags: ["깔끔한 이미지", "발성", "만족도", "구성력"],
    created_at: "2025-06-27T11:30:00",
  },
  {
    id: "5",
    reviewer: "최수정",
    rating: 4,
    comment: "실제 사례 중심으로 설명해주셔서 실무에 도움이 많이 됐어요. 감사합니다.",
    tags: ["깔끔한 이미지", "발성", "만족도", "구성력"],
    created_at: "2025-06-26T08:55:00",
  },
];
