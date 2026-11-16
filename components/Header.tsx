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

type Active = "cert" | "tools" | "about" | null;

const NAV: { key: Exclude<Active, null>; href: string; label: string }[] = [
  { key: "cert", href: "/cert/industrial-safety-engineer/", label: "자격증관" },
  { key: "tools", href: "/tools/", label: "도구" },
  { key: "about", href: "/about/", label: "소개" },
];

export default function Header({ active = null }: { active?: Active }) {
  return (
    <header className="bg-ink no-print">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5 sm:px-5">
        <Link href="/" className="flex min-h-[44px] items-center gap-2 text-[22px] font-extrabold tracking-[-0.5px] text-white hover:text-white hover:no-underline">
          <HelmetLogo />
          그린헬멧기사
        </Link>
        <nav aria-label="주 메뉴" className="flex flex-wrap gap-x-5 text-[15px]">
          {NAV.map((n) =>
            n.key === active ? (
              <Link key={n.key} href={n.href} aria-current="page" className="border-b-[3px] border-logo py-3 font-extrabold text-white hover:text-white">
                {n.label}
              </Link>
            ) : (
              <Link key={n.key} href={n.href} className="py-3 text-[#cfd8dc] hover:text-white">
                {n.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}
