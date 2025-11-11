// app/manager/edit/[id]/page.tsx
"use client";

import { supabase } from "@/lib/supabase";
import axios from "axios";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Loader2, X, Plus } from "lucide-react";
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

  // 새로 추가된 미리보기 상태
  const [galleryPreviews, setGalleryPreviews] = useState<{ url: string; file?: File; isExisting?: boolean }[]>([]);
  const [profilePreview, setProfilePreview] = useState<string>("");

  const params = useParams();
  const searchParams = useSearchParams();

  const id = params?.id as string;
  const typeParam = searchParams?.get("type") as "artist" | "speaker" | null;

  const modules = {
    toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ color: [] }, { background: [] }], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"]],
  };

  const fetchedOnce = useRef(false);
  const reqSeq = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

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

      if (mySeq !== reqSeq.current) return;

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

      const existingGallery = Array.isArray(data.gallery_images) ? data.gallery_images : [];
      setExistingGalleryImages(existingGallery);
      setGalleryPreviews(existingGallery.map((url: string) => ({ url, isExisting: true })));

      const existingProfile = data.profile_image || "";
      setExistingProfileImage(existingProfile);
      setProfilePreview(existingProfile);
    } catch (err: any) {
      if (axios.isCancel?.(err) || err?.name === "CanceledError") return;
      if (mySeq !== reqSeq.current) return;
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

    if (type === "checkbox") {
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

  // 갤러리 이미지 추가
  const handleGalleryAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPreviews = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    setGalleryPreviews((prev) => [...prev, ...newPreviews]);

    // 기존 파일과 새 파일 합치기
    const existingFiles = form.gallery_images ? Array.from(form.gallery_images) : [];
    const dataTransfer = new DataTransfer();
    [...existingFiles, ...Array.from(files)].forEach((file) => dataTransfer.items.add(file));

    setForm((prev) => ({
      ...prev,
      gallery_images: dataTransfer.files,
    }));

    // 파일 입력 초기화
    if (galleryInputRef.current) {
      galleryInputRef.current.value = "";
    }
  };

  // 갤러리 이미지 삭제
  const handleGalleryRemove = (index: number) => {
    const preview = galleryPreviews[index];

    if (preview.isExisting) {
      // 기존 이미지 삭제
      setExistingGalleryImages((prev) => prev.filter((_, i) => i !== index));
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // 새로 추가한 이미지 삭제
      const newPreviews = galleryPreviews.filter((_, i) => i !== index);
      setGalleryPreviews(newPreviews);

      // FileList 재구성
      const remainingFiles = newPreviews.filter((p) => p.file).map((p) => p.file!);
      const dataTransfer = new DataTransfer();
      remainingFiles.forEach((file) => dataTransfer.items.add(file));

      setForm((prev) => ({
        ...prev,
        gallery_images: dataTransfer.files.length > 0 ? dataTransfer.files : null,
      }));

      // URL 정리
      URL.revokeObjectURL(preview.url);
    }
  };

  // 프로필 이미지 변경
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이전 미리보기 URL 정리
    if (profilePreview && !profilePreview.startsWith("http")) {
      URL.revokeObjectURL(profilePreview);
    }

    const previewUrl = URL.createObjectURL(file);
    setProfilePreview(previewUrl);
    setForm((prev) => ({
      ...prev,
      profile_image: e.target.files,
    }));
  };

  // 프로필 이미지 삭제
  const handleProfileRemove = () => {
    if (profilePreview && !profilePreview.startsWith("http")) {
      URL.revokeObjectURL(profilePreview);
    }
    setProfilePreview("");
    setExistingProfileImage("");
    setForm((prev) => ({
      ...prev,
      profile_image: null,
    }));
    if (profileInputRef.current) {
      profileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 현재 상태의 기존 이미지들만 사용
    let galleryUrls: string[] = galleryPreviews.filter((p) => p.isExisting).map((p) => p.url);
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

        galleryUrls = [...galleryUrls, ...newGalleryUrls];
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
        router.replace(`/manager?ts=${Date.now()}`);

        if (!isEditing) {
          setForm(initialForm);
          setExistingGalleryImages([]);
          setExistingProfileImage("");
          setGalleryPreviews([]);
          setProfilePreview("");
        }
      } else {
        alert(result.error || (isEditing ? "수정에 실패했습니다." : "등록에 실패했습니다."));
      }
    } catch (err) {
      console.error("서버 오류:", err);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 컴포넌트 언마운트 시 메모리 정리
  useEffect(() => {
    return () => {
      galleryPreviews.forEach((preview) => {
        if (!preview.isExisting && preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
      if (profilePreview && !profilePreview.startsWith("http")) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, []);

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

          {/* 갤러리 이미지 섹션 */}
          <div className="flex flex-col gap-2">
            <span className="font-medium">갤러리 이미지</span>

            {/* 미리보기 그리드 */}
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group">
                    <img src={preview.url} alt={`갤러리 ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleGalleryRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {preview.isExisting && <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">기존</span>}
                  </div>
                ))}
              </div>
            )}

            {/* 이미지 추가 버튼 */}
            <div className="flex items-center gap-2">
              <input ref={galleryInputRef} type="file" multiple accept="image/*" onChange={handleGalleryAdd} className="hidden" id="gallery-upload" />
              <label htmlFor="gallery-upload" className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <Plus className="w-5 h-5" />
                <span>이미지 추가</span>
              </label>
              <span className="text-sm text-gray-600">{galleryPreviews.length}개 이미지</span>
            </div>
          </div>

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

          {/* 프로필 이미지 섹션 */}
          <div className="flex flex-col gap-2">
            <span className="font-medium">프로필 이미지</span>

            {/* 프로필 미리보기 */}
            {profilePreview && (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200 group mb-2">
                <img src={profilePreview} alt="프로필" className="w-full h-full object-cover" />
                <button type="button" onClick={handleProfileRemove} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 프로필 이미지 업로드 */}
            <div className="flex items-center gap-2">
              <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileChange} className="hidden" id="profile-upload" />
              <label htmlFor="profile-upload" className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <Plus className="w-5 h-5" />
                <span>{profilePreview ? "프로필 이미지 변경" : "프로필 이미지 선택"}</span>
              </label>
            </div>
          </div>

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
