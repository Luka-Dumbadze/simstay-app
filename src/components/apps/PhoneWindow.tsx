"use client";

import { useEffect, useRef, useState } from "react";

const PHONE_W = 390;
const PHONE_H = 780;

// Embedded housekeeping phone: the very same /m/hk page a real phone opens over the hotspot.
export default function PhoneWindow() {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const pad = 16;
      setScale(Math.min((el.clientWidth - pad) / (PHONE_W + 16), (el.clientHeight - pad) / (PHONE_H + 16), 1.2));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className="relative h-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
      <div
        className="absolute left-1/2 top-1/2 rounded-[44px] border-[8px] border-slate-700 bg-black shadow-2xl"
        style={{ width: PHONE_W + 16, height: PHONE_H + 16, transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: "center" }}
      >
        <iframe
          data-testid="phone-frame"
          src="/m/hk?embedded=1"
          title="Housekeeping phone"
          className="h-full w-full rounded-[36px] bg-white"
          style={{ width: PHONE_W, height: PHONE_H }}
        />
      </div>
    </div>
  );
}
