import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function DocShell({ title, active = null, children }: { title: string; active?: "about" | null; children: ReactNode }) {
  return (
    <>
      <Header active={active} />
      <div className="mx-auto max-w-[820px] px-4 pt-6 pb-12 sm:px-5">
        <article className="card prose-doc p-5 sm:p-8">
          <h1 className="m-0 mb-2 text-[26px] font-extrabold tracking-[-0.5px]">{title}</h1>
          {children}
        </article>
      </div>
      <Footer />
    </>
  );
}
