// app/manager/edit/[id]/page.tsx
"use client";

import { supabase } from "@/lib/supabase";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { Speaker, Artists } from "@/types/inquiry";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  pay: "",
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

const budgetOptions = [
  { label: "전체", value: "", bgClass: "bg-[#F3E8FF]" },
  { label: "~300만원", value: "0-300", bgClass: "bg-[#E6FAF5]" },
  { label: "300~500만원", value: "300-500", bgClass: "bg-[#e6f2fd]" },
  { label: "500~1000만원", value: "500-1000", bgClass: "bg-[#FFE4E1]" },
  { label: "1000만원 이상", value: "1000", bgClass: "bg-[#FFFDE6]" },
];

function EditInner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [type, setType] = useState<"artist" | "speaker">("artist");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [existingProfileImage, setExistingProfileImage] = useState<string>("");

  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.id as string;
  const typeParam = searchParams?.get("type") as "artist" | "speaker" | null;

  const modules = {
    toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ color: [] }, { background: [] }], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"]],
  };

  // 중복 호출/경쟁 상태 방지
  const fetchedOnce = useRef(false);
  const reqSeq = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  // 세션/권한 체크
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (!(session.user as any).manager) {
      alert("관리자 권한이 필요합니다.");
      router.push("/");
    }
  }, [session, status, router]);

  // typeParam 준비 후 단 1회 fetch
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!(session?.user as any)?.manager) return;
    if (!id) return;
    if (!typeParam) return;
    if (fetchedOnce.current) return;

    fetchedOnce.current = true;
    setIsEditing(true);
    setType(typeParam);
    fetchData(typeParam);
  }, [status, session, id, typeParam]);

  // 가장 마지막 요청만 반영
  const fetchData = async (t: "artist" | "speaker") => {
    if (!id) return;
    const mySeq = ++reqSeq.current;

    try {
      setLoading(true);

      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      const res = await axios.get(`/api/manager/detail`, {
        params: { id, type: t, _t: Date.now() },
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
        signal: controller.signal as any,
      });

      if (mySeq !== reqSeq.current) return; // 늦은 응답 무시

      const data = res.data;

      setForm({
        ...initialForm,
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
        intro_video: Array.isArray(data.intro_video) ? data.intro_video.join(", ") : data.intro_video || "",
        intro_book: Array.isArray(data.intro_book) ? data.intro_book.join(", ") : data.intro_book || "",
        is_recommended: data.is_recommended || [],
        pay: data.pay || "",
        full_desc: data.full_desc || "",
        gallery_images: null,
        profile_image: null,
      });

      setExistingGalleryImages(Array.isArray(data.gallery_images) ? data.gallery_images : []);
      setExistingProfileImage(data.profile_image || "");
    } catch (err: any) {
      if (axios.isCancel?.(err) || err?.name === "CanceledError") return;
      if (mySeq !== reqSeq.current) return; // 늦은 에러 무시
      console.error("데이터 로드 실패", err);
      alert("데이터를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      if (mySeq === reqSeq.current) setLoading(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const value = (target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let galleryUrls: string[] = [...existingGalleryImages];
    let profileImageUrl = existingProfileImage;
    const uploadFolder = `gallery/${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    try {
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

        galleryUrls = isEditing ? [...galleryUrls, ...newGalleryUrls] : newGalleryUrls;
      }

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
        intro_book: form.intro_book
          .split(",")
          .map((book) => book.trim())
          .filter((book) => book),
        is_recommended: form.is_recommended,
      };

      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/manager/post", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(isEditing ? "수정이 완료되었습니다!" : "등록이 완료되었습니다!");
        // 네비게이션은 한 번만 (쿼리버스터 포함)
        router.replace(`/manager?ts=${Date.now()}`);

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

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!session || !(session.user as any).manager) {
    return null;
  }

  return (
    <div className="flex flex-col mx-auto justify-start items-center min-h-screen mt-10 px-4 my-40">
      <div className="flex flex-col w-full max-w-2xl mb-20">
        <h1 className="text-2xl font-bold mb-6">{isEditing ? `${type === "artist" ? "아티스트" : "연사"} 수정` : `${type === "artist" ? "아티스트" : "연사"} 등록`}</h1>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <label className="mb-4">
            등록 타입:
            <select value={type} onChange={(e) => setType(e.target.value as "artist" | "speaker")} className="ml-2 border p-1 rounded" disabled={isEditing}>
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
            <ReactQuill theme="snow" value={form.full_desc} onChange={(content) => setForm((prev) => ({ ...prev, full_desc: content }))} modules={modules} className="h-80 mb-12" />
          </label>

          {type === "speaker" ? (
            <label className="flex flex-col gap-1">
              <span className="font-medium">책 URL (쉼표로 구분)</span>
              <input name="intro_book" value={form.intro_book} onChange={handleChange} className="border p-2 rounded w-full" />
            </label>
          ) : null}

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

          <label className="block">
            <span className="font-medium">섭외비용</span>
            <select name="pay" value={form.pay} onChange={handleChange} className="border p-2 rounded w-full mt-1">
              {budgetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors mt-5">
            {isEditing ? "수정하기" : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

// 기본 export: Suspense 경계로 감싸기 (useSearchParams 안전)
export default function EditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <EditInner />
    </Suspense>
  );
}
