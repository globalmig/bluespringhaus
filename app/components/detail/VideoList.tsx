import React from "react";

interface YoutubeEmbedProps {
  url: string; // 전체 URL
  title: string;
}

export default function VideoList({ url, title }: YoutubeEmbedProps) {
  let embedUrl = "";

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    embedUrl = url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/");
  } else {
    // 혹시 ID만 넘어올 경우
    embedUrl = `https://www.youtube.com/embed/${url}`;
  }

  return (
    <div className="aspect-w-16 aspect-h-9 h-[500px] w-full">
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full rounded-lg"
      ></iframe>
    </div>
  );
}
