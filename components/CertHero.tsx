import Link from "next/link";
import { CERT_TABS, type Cert } from "@/lib/certs";

export default function CertHero({ cert, tab }: { cert: Cert; tab: string }) {
  const base = `/cert/${cert.slug}`;
  return (
    <section className="bg-accent text-white">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-4 pt-6 sm:px-5">
        <div className="text-[14px] text-[#dff0e4]">
          <Link href="/" className="text-[#dff0e4] hover:text-white">자격증</Link> › {cert.name}
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px] sm:text-[32px]">
            {cert.name}
            {tab === "types" && <span className="ml-2 text-[20px] font-bold text-[#dff0e4] sm:text-[22px]">출제 유형</span>}
          </h1>
          <p className="m-0 text-[15px] text-[#dff0e4]">{cert.level} · 시행 {cert.organizer}</p>
        </div>
        <nav aria-label="종목 메뉴" className="mt-2 flex flex-wrap gap-x-1">
          {/* 아직 열지 않은 탭(공략·합격 후기·질문·답변)은 정식 공개 화면에서 숨긴다 */}
          {CERT_TABS.filter((t) => t.open).map((t) => {
            const on = t.key === tab;
            if (on)
              return (
                <span key={t.label} aria-current="page" className="flex min-h-[48px] items-center rounded-t-md bg-bg px-[18px] text-[15px] font-extrabold text-ink">
                  {t.label}
                </span>
              );
            return (
              <Link key={t.label} href={t.key ? `${base}/${t.key}/` : `${base}/`} className="flex min-h-[48px] items-center px-[18px] text-[15px] text-white hover:text-white">
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
