"use client";

import { BubbleBackground } from "./bubble-background";
import { BubbleInterface } from "./bubble-interface";

export default function BubblePage() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0D0D1A]">
      <BubbleBackground />

      <header className="relative z-10 shrink-0 border-b border-[#EC4899]/10 bg-[#05050f]/40 px-8 py-6 backdrop-blur-xl sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/35 to-transparent"
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#EC4899]/80">
            Bubble
          </p>
          <h1 className="font-heading mt-1.5 text-[2rem] font-bold tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3rem]">
            Your buddy
          </h1>
          <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed tracking-[-0.016em] text-white/45 sm:text-base">
            Here to vibe, vent, or just talk
          </p>
        </div>
      </header>

      <BubbleInterface />
    </div>
  );
}
