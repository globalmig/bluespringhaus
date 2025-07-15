"use client";
import { supabase } from "@/lib/supabase";
import { Speaker } from "lucide-react";
import React, { useState } from "react";

// ✅ form 초기값 정의
const initialForm = {
  name: "",
  gallery_images: null as FileList | null,
  short_desc: "",
  full_desc: "",
  intro_video: "",
  career: "",
  tags: "",
  email: "",
  profile_image: null as FileList | null,
  is_recommended: [] as string[],
};

const RECOMMEND_SPEAKER_TAGS = [
  { label: "지금 인기있는 연사", value: "popularSpeaker" },
  { label: "탑 클래스 연사", value: "topClassSpeaker" },
  { label: "떠오르는 신규연사", value: "risingNewSpeaker" },
  { label: "트렌드 읽는 인사이트메이커", value: "trendInsightMaker" },
  { label: "마음과 삶을 변화시키는 마인드 전문가", value: "mindsetExpert" },
  { label: "영감을 주는 문화 예술 연사", value: "culturalArtSpeaker" },
  { label: "청춘에게 영감을 주는 연사", value: "youthInspiringSpeaker" },
  { label: "꿈에 더 가까워지는 자기계발연사", value: "selfImprovementSpeaker" },
  { label: "전 세계가 주목하는 글로벌 스피커", value: "globalSpeaker" },
  { label: "성장을 설계하는 비즈니스 전문가", value: "businessGrowthExpert" },
];

const RECOMMEND_ARTIST_TAGS = [
  { label: "지금 인기있는 아티스트", value: "trendingArtists" },
  { label: "탑 클래스 아티스트", value: "topClassArtists" },
  { label: "떠오르는 신예 아티스트", value: "risingNewArtists" },
  { label: "감성을 자극하는 아티스트", value: "emotionalArtists" },
  { label: "힙합 아티스트", value: "hiphopArtists" },
  { label: "밴드 아티스트", value: "bandArtists" },
  { label: "페스티벌 헤드라이너", value: "festivalHeadliners" },
  { label: "트로트 아티스트", value: "trotArtists" },
  { label: "인디 아티스트", value: "indieArtists" },
  { label: "글로벌 아이돌", value: "globalIdolArtists" },
  { label: "방송인", value: "broadcasters" },
  { label: "인기 유튜버", value: "topYoutubers" },
];
export default function Manager() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(true);

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handleRecommendedChange = (value: string) => {
    setForm((prev) => {
      const current = prev.is_recommended;
      return {
        ...prev,
        is_recommended: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthorized(true);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const [form, setForm] = useState(initialForm); // ✅ 초기값 사용
  const [type, setType] = useState<"artist" | "speaker">("artist");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, type } = target;

    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: (target as HTMLInputElement).files,
      }));
    } else if (type === "checkbox") {
      const checked = (target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      const value = (target as HTMLInputElement).value;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 파일 업로드 먼저
    let galleryUrls: string[] = [];
    let profileImageUrl = "";

    if (form.gallery_images) {
      const files = Array.from(form.gallery_images);
      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("gallery") // ← 너가 만든 bucket 이름
          .upload(`gallery/${Date.now()}_${file.name}`, file); // 고유 이름으로 업로드

        if (error) {
          console.error("갤러리 이미지 업로드 실패", error);
          alert("갤러리 이미지 업로드 실패");
          return;
        }

        const url = supabase.storage.from("gallery").getPublicUrl(data.path).data.publicUrl;

        galleryUrls.push(url);
      }
    }

    // if (form.profile_image && form.profile_image[0]) {
    //   const file = form.profile_image[0];
    //   const { data, error } = await supabase.storage.from("profile").upload(`profile/${Date.now()}_${file.name}`, file);

    //   if (error) {
    //     console.error("프로필 이미지 업로드 실패", error);
    //     alert("프로필 이미지 업로드 실패");
    //     return;
    //   }

    //   profileImageUrl = supabase.storage.from("profile").getPublicUrl(data.path).data.publicUrl;
    // }

    // 2. payload 준비
    const payload = {
      ...form,
      type,
      gallery_images: galleryUrls,
      profile_image: profileImageUrl,
      tags: form.tags.split(",").map((tag) => tag.trim()),
      intro_video: form.intro_video.split(",").map((v) => v.trim()),
    };

    try {
      const res = await fetch("/api/manager/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("등록 성공!");
        setForm(initialForm);
      } else {
        alert(result.error || "등록 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  return (
    <div className="flex flex-col mx-auto justify-start items-center min-h-screen mt-40 px-4">
      {!isAuthorized ? (
        <>
          <p className="text-2xl mb-10">관리자님 안녕하세요 :)</p>
          <form onSubmit={handlePasswordSubmit} className="flex items-center">
            <input type="password" className="px-4 py-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" />
            <button type="submit" className="bg-black text-white py-2 px-4 rounded-lg ml-4">
              확인
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">아티스트 등록</h1>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <label className="mb-4">
              등록 타입:
              <select value={type} onChange={(e) => setType(e.target.value as "artist" | "speaker")} className="ml-2 border p-1">
                <option value="artist">아티스트</option>
                <option value="speaker">연사</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              추천 태그 선택
              {type === "speaker" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {RECOMMEND_SPEAKER_TAGS.map((tag) => (
                      <label key={tag.value} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" value={tag.value} checked={form.is_recommended.includes(tag.value)} onChange={() => handleRecommendedChange(tag.value)} />
                        {tag.label}
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {RECOMMEND_ARTIST_TAGS.map((tag) => (
                      <label key={tag.value} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" value={tag.value} checked={form.is_recommended.includes(tag.value)} onChange={() => handleRecommendedChange(tag.value)} />
                        {tag.label}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </label>

            <label>
              이름
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label>
              갤러리 이미지 URL (쉼표로 구분)
              <input name="gallery_images" type="file" multiple onChange={(e) => setForm((prev) => ({ ...prev, gallery_images: e.target.files }))} className="border p-2 rounded w-full" />
            </label>

            <label>
              한 줄 소개
              <input name="short_desc" value={form.short_desc} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label>
              상세 설명
              <textarea name="full_desc" value={form.full_desc} onChange={handleChange} className="border p-2 rounded w-full h-32" />
            </label>

            <label>
              소개 영상 링크 (쉼표로 구분)
              <input name="intro_video" value={form.intro_video} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label>
              경력 사항
              <textarea name="career" value={form.career} onChange={handleChange} className="border p-2 rounded w-full h-24" />
            </label>

            <label>
              태그 (쉼표로 구분)
              <input name="tags" value={form.tags} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label>
              이메일
              <input type="email" name="email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label>
              프로필 이미지
              <input name="profile_image" type="file" onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <button type="submit" className="bg-black text-white py-2 rounded">
              등록하기
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
