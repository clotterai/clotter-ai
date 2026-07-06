"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatBackground } from "./chat-background";
import { ChatInterface } from "./chat-interface";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <ChatBackground />

      <header className="relative z-10 max-h-[60px] shrink-0 overflow-hidden border-b border-[#7C3AED]/10 bg-[#05050f]/40 px-4 py-3 backdrop-blur-xl md:max-h-none md:px-8 md:py-6 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/35 to-transparent"
        />
        <div className="flex items-center justify-between gap-3 md:gap-6">
          <div className="min-w-0 flex-1">
            <p className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-[#A855F7]/70 md:block">
              AI Chat
            </p>
            <h1 className="font-heading truncate text-xl font-bold tracking-[-0.02em] text-white md:mt-1.5 md:text-4xl lg:text-[3rem]">
              Creative co-pilot
            </h1>
          </div>
          <span className="shrink-0 rounded-full border border-[#A855F7]/50 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-3 py-1 text-[10px] font-semibold tracking-[-0.01em] text-white shadow-[0_0_24px_-6px_#A855F7] md:px-4 md:py-2 md:text-xs sm:px-5 sm:text-sm">
            ⚡ Clotter Lite
          </span>
        </div>
      </header>

      <ChatInterface selectedModel="Clotter Lite" sessionId={sessionId} />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-sm text-white/40">Loading chat...</p>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
