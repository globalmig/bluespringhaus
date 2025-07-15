"use client";
import React, { useState } from "react";
export default function Manager() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthorized(true);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  // 게시글 등록 변수값
  const [form, setForm] = useState({
    name: "",
    gallery_images: "",
    short_desc: "",
    full_desc: "",
    intro_video: "",
    career: "",
    tags: "",
    email: "",
    profile_image: "",
    is_recommended: false,
  });

  const [type, setType] = useState<"artist" | "speaker">("artist");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // TODO:API 경로 수정해야함
      const res = await fetch(`/api/admin/create-${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("아티스트가 성공적으로 등록되었습니다.");
        setForm({
          name: "",
          gallery_images: "",
          short_desc: "",
          full_desc: "",
          intro_video: "",
          career: "",
          tags: "",
          email: "",
          profile_image: "",
          is_recommended: false,
        });
      } else {
        alert(result.error || "등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("등록 중 오류:", err);
      alert("서버 오류가 발생했습니다.");
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

            <label className="flex items-center gap-2">
              추천 아티스트로 등록
              <label>
                <input type="checkbox" name="is_recommended" checked={form.is_recommended} onChange={handleChange} />{" "}
              </label>
            </label>

            <label>
              이름
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label>
              갤러리 이미지 URL (쉼표로 구분)
              <input name="gallery_images" type="file" multiple value={form.gallery_images} onChange={handleChange} className="border p-2 rounded w-full" />
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
              <input name="profile_image" type="file" value={form.profile_image} onChange={handleChange} className="border p-2 rounded w-full" />
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
