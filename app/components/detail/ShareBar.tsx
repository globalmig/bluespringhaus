"use client";

import { useCallback } from "react";
import { FacebookShareButton, FacebookIcon, LineShareButton, LineIcon, TwitterShareButton, TwitterIcon, TelegramShareButton, TelegramIcon } from "next-share";

type Props = {
  url: string;
  title: string;
  summary?: string;
};

export default function ShareBar({ url, title, summary }: Props) {
  const nativeShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text: summary, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("링크를 복사했어요!");
      }
    } catch (e) {
      // 사용자가 취소하거나 지원 안 될 때: 클립보드 폴백
      try {
        await navigator.clipboard.writeText(url);
        alert("링크를 복사했어요!");
      } catch {}
    }
  }, [title, summary, url]);

  return (
    <div className="flex items-center gap-3">
      <button onClick={nativeShare} className="px-3 py-2 rounded border text-sm hover:bg-gray-50">
        공유
      </button>
      {/* 
      <FacebookShareButton url={url} quote={title}>
        <FacebookIcon size={36} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={36} round />
      </TwitterShareButton>

      <LineShareButton url={url} title={title}>
        <LineIcon size={36} round />
      </LineShareButton> */}
    </div>
  );
}
