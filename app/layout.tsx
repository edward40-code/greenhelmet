import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { BASE_PATH, SITE, SITE_URL } from "@/lib/site";

const noto = Noto_Sans_KR({
  weight: ["400", "500", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE.name} · EHS 자격증·실무 커뮤니티`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { siteName: SITE.name, locale: "ko_KR", type: "website" },
  icons: { icon: `${BASE_PATH}/icon.svg` },
};

export const viewport: Viewport = { themeColor: "#16242b", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={noto.variable}>
      <body className="m-0 min-h-screen">{children}</body>
    </html>
  );
}
