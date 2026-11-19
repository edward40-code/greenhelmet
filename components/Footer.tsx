import Link from "next/link";
import { SITE } from "@/lib/site";
import { HelmetLogo } from "./Header";

const COLS: { h: string; links: [string, string][] }[] = [
  { h: "읽을거리", links: [["/news/", "소식"], ["/accidents/", "사고속보"], ["/reports/", "이슈리포트"]] },
  { h: "자료·도구", links: [["/library/", "자료실"], ["/tools/tbm/", "TBM 생성기"], ["/tools/calc/", "단위환산·안전계산"], ["/tools/test/", "안전 성향 테스트"]] },
  { h: "자격증", links: [["/cert/industrial-safety-engineer/", "산업안전기사"]] },
  { h: "사이트", links: [["/about/", "소개"], ["/terms/", "이용약관"], ["/privacy/", "개인정보처리방침"]] },
];

export default function Footer() {
  return (
    <footer className="no-print mt-6 bg-ink text-[#b8c4ca]">
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-10 gap-y-8 px-4 pt-10 pb-8 sm:px-5">
        <div className="flex min-w-[240px] flex-[1_1_280px] flex-col gap-3">
          <span className="flex items-center gap-2 text-[20px] font-extrabold text-white"><HelmetLogo size={26} />{SITE.name}</span>
          <p className="m-0 max-w-[360px] text-[14px] leading-relaxed">안전·보건·환경 소식과 법정 점검표·서식</p>
          {SITE.contactEmail && <a href={`mailto:${SITE.contactEmail}`} className="text-[14px] text-[#6fd08c]">문의하기</a>}
        </div>
        {COLS.map((c) => (
          <div key={c.h} className="flex min-w-[120px] flex-col gap-2 text-[14px]">
            <span className="font-bold text-white">{c.h}</span>
            {c.links.map(([href, label]) => (
              <Link key={href} href={href} className={`text-[#b8c4ca] hover:text-white ${label === "개인정보처리방침" ? "font-bold" : ""}`}>{label}</Link>
            ))}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto m-0 max-w-[1240px] px-4 py-4 text-[13px] text-[#8b9aa2] sm:px-5">
          © {new Date().getFullYear()} {SITE.operator ? `${SITE.name} · ${SITE.operator}` : SITE.name}. 법령 기준은 국가법령정보센터 현행 원문 확인.
        </p>
      </div>
    </footer>
  );
}
