import Link from "next/link";

export function HelmetLogo({ size = 30 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6fd08c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16a8 8 0 0 1 16 0" />
      <path d="M2 16h20v2H2z" />
      <path d="M10 8.3V5h4v3.3" />
    </svg>
  );
}

export type Active = "news" | "accidents" | "reports" | "library" | "market" | "tools" | "cert" | "about" | null;

const NAV: { key: Exclude<Active, null>; href: string; label: string }[] = [
  { key: "news", href: "/news/", label: "소식" },
  { key: "accidents", href: "/accidents/", label: "사고속보" },
  { key: "reports", href: "/reports/", label: "이슈리포트" },
  { key: "library", href: "/library/", label: "자료실" },
  { key: "market", href: "/market/", label: "안전장터" },
  { key: "tools", href: "/tools/", label: "도구" },
  { key: "cert", href: "/cert/industrial-safety-engineer/", label: "자격증" },
];

export default function Header({ active = null }: { active?: Active }) {
  return (
    <header className="no-print sticky top-0 z-40 bg-ink">
      <div className="mx-auto flex max-w-[1240px] items-center gap-x-6 px-4 sm:px-5">
        <Link href="/" className="flex min-h-[56px] shrink-0 items-center gap-2 text-[21px] font-extrabold tracking-[-0.5px] text-white hover:text-white hover:no-underline">
          <HelmetLogo />
          그린헬멧기사
        </Link>
        <nav aria-label="주 메뉴" className="no-scrollbar -mr-4 flex min-w-0 flex-1 gap-x-1 overflow-x-auto pr-4 text-[15px] [mask-image:linear-gradient(to_right,#000_82%,transparent)] sm:mr-0 sm:pr-0 sm:[mask-image:none]">
          {NAV.map((n) =>
            n.key === active ? (
              <Link key={n.key} href={n.href} aria-current="page" className="shrink-0 rounded-md bg-white/12 px-3.5 py-2 font-extrabold whitespace-nowrap text-white hover:text-white hover:no-underline">
                {n.label}
              </Link>
            ) : (
              <Link key={n.key} href={n.href} className="shrink-0 rounded-md px-3.5 py-2 whitespace-nowrap text-[#cfd8dc] hover:bg-white/8 hover:text-white hover:no-underline">
                
                {n.label}
              </Link>
            )
          )}
        </nav>
      </div>
      <div className="h-1" style={{ background: "repeating-linear-gradient(-45deg, #f5c518 0 12px, #16242b 12px 24px)" }} aria-hidden="true" />
    </header>
  );
}
