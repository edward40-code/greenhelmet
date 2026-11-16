import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="no-print border-t border-line bg-white">
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-6 gap-y-2 px-4 py-6 text-[13px] text-muted sm:px-5">
        <span>{SITE.operator ? `${SITE.name} · ${SITE.operator}` : SITE.name}</span>
        <Link href="/about/" className="text-muted">소개</Link>
        <Link href="/terms/" className="text-muted">이용약관</Link>
        <Link href="/privacy/" className="font-bold text-muted">개인정보처리방침</Link>
        {SITE.contactEmail && (
          <a href={`mailto:${SITE.contactEmail}`} className="text-muted">문의</a>
        )}
      </div>
    </footer>
  );
}
