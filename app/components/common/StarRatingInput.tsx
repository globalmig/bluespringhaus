"use client";

import { useState } from "react";

interface StarRatingInputProps {
  max?: number;
  value?: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ max = 5, value = 0, onChange }: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (val: number) => onChange(val);
  const handleMouseEnter = (val: number) => setHovered(val);
  const handleMouseLeave = () => setHovered(null);

  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = hovered !== null ? starValue <= hovered : starValue <= value;

        return (
          <span
            key={i}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={`cursor-pointer text-6xl transition-colors ${isFilled ? "text-yellow-400" : "text-gray-300"}`}
            role="button"
            aria-label={`${starValue}점`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
