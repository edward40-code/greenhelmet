"use client";

import { useEffect, useState } from "react";

/** 글 읽은 만큼 화면 위에 차오르는 막대 */
export default function ReadProgress({ color = "#6fd08c" }: { color?: string }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div aria-hidden="true" className="fixed top-0 left-0 z-50 h-[3px]" style={{ width: `${p * 100}%`, background: color }} />;
}
