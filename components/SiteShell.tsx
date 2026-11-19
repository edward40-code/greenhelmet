import type { ReactNode } from "react";
import Header, { type Active } from "./Header";
import Footer from "./Footer";
import PageHero from "./PageHero";

export default function SiteShell({ active, title, desc, width = 1240, children }: { active: Active; title: string; desc?: ReactNode; width?: number; children: ReactNode }) {
  return (
    <>
      <Header active={active} />
      <PageHero theme={active ?? "about"} title={title} desc={desc} />
      <div className="relative mx-auto -mt-4 flex flex-col gap-4 px-4 pb-10 sm:px-5" style={{ maxWidth: width }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
