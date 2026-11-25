import { COMPARE, COMPARE_HEAD, GUIDE_NOTE, GUIDE_STEPS, SCALE } from "@/lib/riskGuide";

const th = "border border-line bg-[#f1f4f5] px-3 py-2 text-left align-top font-bold";
const td = "whitespace-pre-line border border-line px-3 py-2 align-top";

export default function Guide() {
  return (
    <section id="guide" aria-label="작성 설명서" className="card no-print flex flex-col gap-5 px-5 py-[18px] sm:px-6">
      <h2 className="m-0 text-[18px] font-extrabold">작성 설명서</h2>

      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-[16px] font-extrabold">판단 방법 비교</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-[15px] leading-relaxed">
            <thead>
              <tr>{COMPARE_HEAD.map((h, i) => <th key={i} className={`${th} ${i === 0 ? "w-[150px]" : ""}`}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {COMPARE.map((r) => (
                <tr key={r[0]}>
                  <th className={th}>{r[0]}</th>
                  <td className={td}>{r[1]}</td>
                  <td className={td}>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="m-0 text-[14px] text-muted">{GUIDE_NOTE}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-[16px] font-extrabold">판단 기준 예시 (현장 권장)</h3>
        <dl className="m-0 flex flex-col text-[15px] leading-relaxed">
          {SCALE.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5 border-t border-line-soft py-2 first:border-t-0 sm:flex-row sm:gap-4">
              <dt className="shrink-0 font-bold sm:w-[150px]">{k}</dt>
              <dd className="m-0">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="m-0 text-[16px] font-extrabold">작성 순서</h3>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {GUIDE_STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3 border-t border-line-soft pt-3 first:border-t-0 first:pt-0">
              <span className="w-[22px] shrink-0 text-[16px] font-extrabold text-accent">{i + 1}</span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[16px] font-bold">{s.title}</span>
                <ul className="m-0 list-disc pl-5 text-[15px] leading-relaxed">
                  {s.items.map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
