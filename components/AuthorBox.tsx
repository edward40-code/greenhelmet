import Link from "next/link";
import { AUTHOR } from "@/lib/author";

export default function AuthorBox({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-line-soft bg-white px-4 py-3 text-[14px] leading-relaxed">
      <p className="m-0">
        <span className="text-muted">{label}</span> <strong>{AUTHOR.name}</strong> <span className="text-muted">· {AUTHOR.role}</span>
      </p>
      <p className="m-0 text-muted">{AUTHOR.short}</p>
      <Link href="/about/#operator" className="text-[14px] font-bold">운영자 소개 →</Link>
    </div>
  );
}
