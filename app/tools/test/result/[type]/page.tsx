import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TYPES, typeBySlug } from "@/lib/safetyTest";
import ResultCard from "../../ResultCard";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(TYPES).map((t) => ({ type: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const t = typeBySlug((await params).type);
  if (!t) return {};
  return {
    title: `${t.name} · 안전 성향 테스트 결과`,
    description: `${t.desc} 잘 맞는 동료: ${t.mate}. 추천 자격증: ${t.cert}.`,
    alternates: { canonical: `/tools/test/result/${t.slug}/` },
    openGraph: { title: `나는 ${t.name}`, description: t.desc },
  };
}

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const t = typeBySlug((await params).type);
  if (!t) notFound();
  return (
    <>
      <Header active="tools" />
      <div className="mx-auto flex max-w-[760px] flex-col gap-5 px-4 pt-8 pb-12 sm:px-5">
        <ResultCard result={t} />
        <section className="card flex flex-col gap-2 p-5">
          <h2 className="m-0 text-[17px] font-extrabold">다른 유형</h2>
          <ul className="m-0 flex flex-wrap gap-2 p-0">
            {Object.values(TYPES).filter((x) => x.slug !== t.slug).map((x) => (
              <li key={x.slug} className="list-none">
                <Link href={`/tools/test/result/${x.slug}/`} className="inline-flex min-h-[44px] items-center rounded-full border border-line px-4 text-[15px]">{x.name}</Link>
              </li>
            ))}
          </ul>
        </section>
        <p className="m-0 text-center text-[14px] text-muted">재미로 보는 테스트입니다. 심리검사가 아닙니다.</p>
      </div>
      <Footer />
    </>
  );
}
