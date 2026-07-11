"use client";

import { Zap } from "lucide-react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatBackground } from "./chat-background";
import { ChatInterface } from "./chat-interface";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const promptKey = searchParams.get("prompt");

  return (
    <div className="relative flex h-[calc(100dvh-3.5rem)] min-h-0 flex-col overflow-hidden md:h-screen">
      <style>{`
        @keyframes electricPulse {
          0%, 100% {
            box-shadow: 0 0 6px -2px rgba(236,72,153,0.3);
          }
          50% {
            box-shadow: 0 0 12px -2px rgba(236,72,153,0.5);
          }
        }
      `}</style>
      <ChatBackground />

      <header className="relative z-10 shrink-0 overflow-hidden border-b border-[#EC4899]/10 bg-[#05050f]/40 px-4 py-2 backdrop-blur-xl md:px-8 md:py-4 sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/35 to-transparent"
        />
        <div className="flex items-center justify-between gap-3 md:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="font-heading truncate text-lg font-bold tracking-[-0.02em] text-white md:text-3xl lg:text-[3rem]">
              Creative co-pilot
            </h1>
          </div>
          <span
            className="hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-white md:inline-flex"
            style={{
              background: "linear-gradient(135deg, #EC4899, #F97316)",
              animation: "electricPulse 2s ease-in-out infinite",
            }}
          >
            <Zap size={12} fill="white" />
            Clotter 2.5
          </span>
        </div>
      </header>

      <ChatInterface
        selectedModel="Clotter Lite"
        sessionId={sessionId}
        initialPromptKey={promptKey}
      />
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
