"use client";

import { useState } from "react";
import Link from "next/link";
import type { ResultType } from "@/lib/safetyTest";
import { BASE_PATH } from "@/lib/site";

export default function ResultCard({ result, onRestart }: { result: ResultType; onRestart?: () => void }) {
  const [msg, setMsg] = useState("");

  const share = async () => {
    const url = `${window.location.origin}${BASE_PATH}/tools/test/result/${result.slug}/`;
    const text = `나는 '${result.name}' 유형의 그린헬멧기사`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "안전 성향 테스트", text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setMsg("결과 주소를 복사했습니다.");
    } catch {
      setMsg(url);
    }
  };

  return (
    <section className="flex flex-col items-center gap-3.5 rounded-[10px] border-2 border-accent bg-white p-6 text-center sm:p-8">
      <span className="text-[15px] text-muted">당신은</span>
      <h1 className="m-0 text-[30px] font-extrabold tracking-[-0.5px] text-accent sm:text-[34px]">{result.name}</h1>
      <p className="m-0 max-w-[520px] text-[17px] leading-[1.8]">{result.desc}</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[15px] text-muted">
        <span>잘 맞는 동료: {result.mate}</span>
        <span>추천 자격증: {result.cert}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap justify-center gap-2.5">
        <button type="button" onClick={share} className="min-h-[48px] rounded-md bg-accent px-[22px] text-[16px] font-bold text-white cursor-pointer">
          결과 공유
        </button>
        {onRestart ? (
          <button type="button" onClick={onRestart} className="min-h-[48px] rounded-md border border-field bg-white px-[22px] text-[16px] text-ink cursor-pointer">
            다시 하기
          </button>
        ) : (
          <Link href="/tools/test/" className="flex min-h-[48px] items-center rounded-md border border-field bg-white px-[22px] text-[16px] text-ink hover:no-underline">
            나도 해 보기
          </Link>
        )}
      </div>
      {msg && <p className="m-0 break-all text-[14px] text-muted" role="status">{msg}</p>}
    </section>
  );
}
