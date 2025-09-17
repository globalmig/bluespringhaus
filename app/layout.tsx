import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Gnb from "./components/common/Gnb";
import Footer from "./components/common/Footer";
import Providers from "./providers";
import "react-quill/dist/quill.snow.css";
import ChannelProvider from "./components/common/ChannelProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.micimpact.net"),
  title: {
    default: "마이크임팩트 | MICIMPACT",
    template: "%s | 마이크임팩트",
  },
  description: "국내 최고 수준의 스피커/아티스트 섭외 플랫폼. 강연, 공연, 이벤트를 한 곳에서 진행해보세요!",
  icons: {
    icon: "/icon.png",
  },
  keywords: ["마이크임팩트", "강연", "스피커", "아티스트", "섭외", "이벤트"],
  alternates: {
    canonical: "/",
  },
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
    // "google-site-verification": "구글_콘솔에서_받은_코드", // e.g. abcdefg...
    "naver-site-verification": "456553f7539f16a6b9f5ff2cd3eaa9e5503bdc74", // e.g. 1234567...
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
        <link rel="icon" href="/icon.png" sizes="any" type="image/png" />
      </head>
      <body className="font-pretendard flex flex-col">
        <Providers>
          <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
            {/* GNB */}
            <Gnb />

            {/* 콘텐츠 */}
            <main className="flex-grow w-full mx-auto min-h-[1200px]">
              {children}
              <ChannelProvider />
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
