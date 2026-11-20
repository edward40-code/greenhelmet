import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BASE_PATH, OG_IMAGES, SITE, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} · ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, locale: "ko_KR", type: "website", images: OG_IMAGES },
  twitter: { card: "summary_large_image", images: [OG_IMAGES[0].url] },
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
