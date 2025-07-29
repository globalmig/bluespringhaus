"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface LinkPreviewProps {
  url: string;
}

export default function LinkPreview({ url }: LinkPreviewProps) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) return;

    const fetchPreview = async () => {
      try {
        const res = await axios.get(`/api/link-preview?url=${encodeURIComponent(url)}`);
        setData(res.data);
      } catch (e: any) {
        console.error("❌ 미리보기 실패", e);
        setError("미리보기를 불러오지 못했습니다.");
      }
    };

    fetchPreview();
  }, [url]);

  //   if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (error) return <p className="text-sm text-red-400"></p>;
  if (!data) return <p className="text-sm text-gray-400 w-full text-center"></p>;

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="block w-full max-w-md border rounded-xl overflow-hidden shadow hover:shadow-lg transition mb-4">
      {data.images?.[0] && <img src={data.images[0]} alt="썸네일" className="w-full h-64 object-cover" />}
      <div className="p-4">
        <p className="font-bold text-lg">{data.title}</p>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{data.description}</p>
      </div>
    </a>
  );
}
