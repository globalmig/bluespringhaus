import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Gnb from "./components/common/Gnb";
import Footer from "./components/common/Footer";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "마이크임팩트",
  description: "연사, 인플루언서를 손쉽게 연결해드리는 마이크임팩트 사이트입니다",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="w-full mx-auto bg-[#FDFDFD]">
            <Gnb />
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
