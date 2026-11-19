import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import PageHero from "./PageHero";
import { AdSlot } from "./ui";

export default function ToolShell({ title, desc, width = 1240, children }: { title: string; desc: ReactNode; width?: number; children: ReactNode }) {
  return (
    <>
      <Header active="tools" />
      <PageHero theme="tools" title={title} desc={desc} />
      <div className="relative mx-auto -mt-4 flex flex-col gap-4 px-4 pb-10 sm:px-5" style={{ maxWidth: width }}>
        {children}
        <AdSlot slot="tool_bottom" />
      </div>
      <Footer />
    </>
  );
}
