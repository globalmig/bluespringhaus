import type { Metadata } from "next";
import "./globals.css";
import Gnb from "./components/common/Gnb";
import Footer from "./components/common/Footer";
import Providers from "./providers"; // ← 이게 클라이언트라면 유지
import "react-quill/dist/quill.snow.css";
import ChannelProvider from "./components/common/ChannelProvider";
import AuthSessionProvider from "./components/auth/AuthSessionProvider";
// ✅ 추가 (클라 래퍼)

export const metadata: Metadata = {
  metadataBase: new URL("https://www.micimpact.net"),
  title: {
    default: "마이크임팩트 | MICIMPACT",
    template: "%s | 마이크임팩트",
  },
  description: "국내 최고 수준의 스피커/아티스트 섭외 플랫폼. 강연, 공연, 이벤트를 한 곳에서 진행해보세요!",
  icons: { icon: "/favicon.ico" },
  keywords: ["마이크임팩트", "강연", "스피커", "아티스트", "섭외", "이벤트"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.micimpact.net",
    siteName: "마이크임팩트",
    title: "마이크임팩트 | MICIMPACT",
    description: "스피커/아티스트 섭외, 브랜드 이벤트까지 한 번에.",
    images: [{ url: "/micimpact_logo.png", width: 1200, height: 630 }],
    locale: "ko_KR",
  },
  other: {
    "naver-site-verification": "456553f7539f16a6b9f5ff2cd3eaa9e5503bdc74",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
        {/* <link rel="icon" href="/icon.png" sizes="any" type="image/png" /> */}
      </head>
      <body className="font-pretendard flex flex-col">
        {/* ✅ 서버 컴포넌트에서 클라이언트 Provider로 감싸기 */}
        <AuthSessionProvider>
          <Providers>
            <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
              <Gnb /> {/* ✅ Gnb는 "use client"여야 하고 여기 내부에서 렌더 */}
              <main className="flex-grow w-full mx-auto min-h-screen">
                {children}
                <ChannelProvider />
              </main>
              <Footer />
            </div>
          </Providers>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
