import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Gnb from "./components/common/Gnb";
import Footer from "./components/common/Footer";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "마이크임팩트",
  description: "연사, 인플루언서를 손쉽게 연결해드리는 마이크임팩트 사이트입니다",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" />
      </head>
      <body className="font-pretendard">
        <Providers>
          <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
            {/* GNB */}
            <Gnb />

            {/* 콘텐츠 */}
            <main className="flex-grow w-full mx-auto">{children}</main>

            {/* Footer */}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
