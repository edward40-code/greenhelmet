import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BASE_PATH, SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} · 산업안전·보건·환경 소식과 자료실`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, locale: "ko_KR", type: "website" },
  icons: { icon: `${BASE_PATH}/icon.svg` },
};

export const viewport: Viewport = { themeColor: "#16242b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        {/* 한글 전체 글리프를 가진 Pretendard (필요한 글자만 나눠 받는 dynamic subset) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body className="m-0 min-h-screen">{children}</body>
    </html>
  );
}
