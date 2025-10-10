"use client";
import { supabase } from "@/lib/supabase";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Speaker, Artists } from "@/types/inquiry";

const initialForm = {
  name: "",
  gallery_images: null as FileList | null,
  short_desc: "",
  full_desc: "",
  intro_video: "",
  intro_book: "",
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

export default function Edit() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [type, setType] = useState<"artist" | "speaker">("artist");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [existingProfileImage, setExistingProfileImage] = useState<string>("");

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params?.id as string;
  const typeParam = searchParams?.get("type") as "artist" | "speaker" | null;

  // 타입 설정
  useEffect(() => {
    if (typeParam) {
      setType(typeParam);
    }
  }, [typeParam]);

  // 데이터 로딩
  useEffect(() => {
    if (id && type) {
      setIsEditing(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id, type]);

  const fetchData = async () => {
    if (!id || !type) return;

    try {
      setLoading(true);
      console.log(`API 호출: /api/manager/detail?id=${id}&type=${type}`);

      // type 파라미터를 포함하여 API 호출
      const res = await axios.get(`/api/manager/detail?id=${id}&type=${type}`);
      const data = res.data;

      console.log("받은 데이터:", data);

      // 폼 데이터 설정
      setForm({
        ...initialForm,
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
        intro_video: Array.isArray(data.intro_video) ? data.intro_video.join(", ") : data.intro_video || "",
        is_recommended: data.is_recommended || [],
        // 파일 필드는 초기화 (기존 파일을 직접 설정할 수 없음)
        gallery_images: null,
        profile_image: null,
      });

      // 기존 이미지 URL들을 별도로 저장
      setExistingGalleryImages(Array.isArray(data.gallery_images) ? data.gallery_images : []);
      setExistingProfileImage(data.profile_image || "");
    } catch (err) {
      console.error("데이터 로드 실패", err);
      alert("데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendedChange = (value: string) => {
    setForm((prev) => {
      const current = prev.is_recommended;
      return {
        ...prev,
        is_recommended: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setIsAuthorized(true);
    } else {
      alert("비밀번호가 틀렸습니다.");
    }
  };

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

    // 기존 이미지를 기본값으로 설정
    let galleryUrls: string[] = [...existingGalleryImages];
    let profileImageUrl = existingProfileImage;
    const uploadFolder = `gallery/${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
      // 새로운 갤러리 이미지 업로드
      if (form.gallery_images && form.gallery_images.length > 0) {
        const files = Array.from(form.gallery_images);
        const newGalleryUrls: string[] = [];

        for (const file of files) {
          const ext = file.name.split(".").pop();
          const safeFileName = `${uploadFolder}/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

          const { data, error } = await supabase.storage.from("gallery").upload(safeFileName, file, { upsert: true });

          if (error) {
            console.error("갤러리 이미지 업로드 실패", error);
            alert("갤러리 이미지 업로드에 실패했습니다.");
            return;
          }

          const url = supabase.storage.from("gallery").getPublicUrl(data.path).data.publicUrl;
          newGalleryUrls.push(url);
        }

        // 수정 모드에서는 기존 이미지에 추가, 새 등록에서는 새 이미지만
        galleryUrls = isEditing ? [...galleryUrls, ...newGalleryUrls] : newGalleryUrls;
      }

      // 새로운 프로필 이미지 업로드
      if (form.profile_image && form.profile_image[0]) {
        const file = form.profile_image[0];
        const ext = file.name.split(".").pop();
        const safeFileName = `${uploadFolder}/profile_${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

        const { data, error } = await supabase.storage.from("gallery").upload(safeFileName, file, { upsert: true });

        if (error) {
          console.error("프로필 이미지 업로드 실패", error);
          alert("프로필 이미지 업로드에 실패했습니다.");
          return;
        }

        profileImageUrl = supabase.storage.from("gallery").getPublicUrl(data.path).data.publicUrl;
      }

      // API 요청 데이터 준비
      const payload = {
        ...form,
        id: isEditing ? id : undefined,
        type,
        gallery_images: galleryUrls,
        profile_image: profileImageUrl,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        intro_video: form.intro_video
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v),
        is_recommended: form.is_recommended,
      };

      console.log("전송할 데이터:", payload);

      // 수정인지 새 등록인지에 따라 HTTP 메서드 결정
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/manager/post", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(isEditing ? "수정이 완료되었습니다!" : "등록이 완료되었습니다!");
        router.push("/manager");
        if (!isEditing) {
          setForm(initialForm);
          setExistingGalleryImages([]);
          setExistingProfileImage("");
        }
      } else {
        alert(result.error || (isEditing ? "수정에 실패했습니다." : "등록에 실패했습니다."));
      }
    } catch (err) {
      console.error("서버 오류:", err);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 로딩 화면
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-medium">{isEditing ? "데이터를 불러오는 중..." : "준비 중..."}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto justify-start items-center min-h-screen mt-10 px-4 my-40">
      {!isAuthorized ? (
        <>
          <p className="text-2xl mb-10 mt-40">관리자님 안녕하세요 :)</p>
          <form onSubmit={handlePasswordSubmit} className="flex items-center">
            <input type="password" className="px-4 py-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" />
            <button type="submit" className="bg-black text-white py-2 px-4 rounded-lg ml-4">
              확인
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6">{isEditing ? `${type === "artist" ? "아티스트" : "연사"} 수정` : `${type === "artist" ? "아티스트" : "연사"} 등록`}</h1>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <label className="mb-4">
              등록 타입:
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "artist" | "speaker")}
                className="ml-2 border p-1 rounded"
                disabled={isEditing} // 수정 모드에서는 타입 변경 불가
              >
                <option value="artist">아티스트</option>
                <option value="speaker">연사</option>
              </select>
              {isEditing && <span className="text-sm text-gray-600 ml-2">(수정 시 타입 변경 불가)</span>}
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-medium">추천 태그 선택</span>
              {type === "speaker" ? (
                <div className="grid grid-cols-2 gap-2">
                  {RECOMMEND_SPEAKER_TAGS.map((tag) => (
                    <label key={tag.value} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" value={tag.value} checked={form.is_recommended.includes(tag.value)} onChange={() => handleRecommendedChange(tag.value)} />
                      {tag.label}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {RECOMMEND_ARTIST_TAGS.map((tag) => (
                    <label key={tag.value} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" value={tag.value} checked={form.is_recommended.includes(tag.value)} onChange={() => handleRecommendedChange(tag.value)} />
                      {tag.label}
                    </label>
                  ))}
                </div>
              )}
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">이름 *</span>
              <input name="name" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" required />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">
                갤러리 이미지
                {isEditing && existingGalleryImages.length > 0 && <span className="text-sm text-gray-600">{` (현재 ${existingGalleryImages.length}개 이미지)`}</span>}
              </span>
              <input
                name="gallery_images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setForm((prev) => ({ ...prev, gallery_images: e.target.files }))}
                className="border p-2 rounded w-full"
              />
              {isEditing && existingGalleryImages.length > 0 && <div className="text-sm text-gray-600">새 이미지를 선택하면 기존 이미지에 추가됩니다.</div>}
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">한 줄 소개</span>
              <input name="short_desc" value={form.short_desc} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">상세 설명</span>
              <textarea name="full_desc" value={form.full_desc} onChange={handleChange} className="border p-2 rounded w-full h-32" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">책 (쉼표로 구분)</span>
              <input name="intro_book" value={form.intro_book} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">소개 영상 링크 (쉼표로 구분)</span>
              <input name="intro_video" value={form.intro_video} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">경력 사항</span>
              <textarea name="career" value={form.career} onChange={handleChange} className="border p-2 rounded w-full h-24" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">태그 (쉼표로 구분)</span>
              <input name="tags" value={form.tags} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">이메일</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-medium">
                프로필 이미지
                {isEditing && existingProfileImage && <span className="text-sm text-gray-600"> (현재 이미지 있음)</span>}
              </span>
              <input name="profile_image" type="file" accept="image/*" onChange={handleChange} className="border p-2 rounded w-full" />
            </label>

            <button type="submit" className="bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors">
              {isEditing ? "수정하기" : "등록하기"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
