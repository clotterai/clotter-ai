"use client";

import { useState } from "react";
import { ChatBackground } from "./chat-background";
import { ChatInterface } from "./chat-interface";

export type ChatModel = "Clotter Lite" | "Clotter Mini";

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState<ChatModel>("Clotter Lite");

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <ChatBackground />

      {/* Header */}
      <header className="relative z-10 shrink-0 border-b border-[#7C3AED]/10 bg-[#05050f]/40 px-8 py-6 backdrop-blur-xl sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/35 to-transparent"
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A855F7]/70">
              AI Chat
            </p>
            <h1 className="font-heading mt-1.5 text-[2rem] font-bold tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3rem]">
              Creative co-pilot
            </h1>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setSelectedModel("Clotter Lite")}
              className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[-0.01em] transition sm:px-5 sm:text-sm ${
                selectedModel === "Clotter Lite"
                  ? "border-[#A855F7]/50 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_24px_-6px_#A855F7]"
                  : "border-[#7C3AED]/20 bg-[#0D0D1A] text-white/55 hover:border-[#7C3AED]/35 hover:text-white/75"
              }`}
            >
              ⚡ Clotter Lite
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel("Clotter Mini")}
              className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-[-0.01em] transition sm:px-5 sm:text-sm ${
                selectedModel === "Clotter Mini"
                  ? "border-[#A855F7]/50 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-[0_0_24px_-6px_#A855F7]"
                  : "border-[#7C3AED]/20 bg-[#0D0D1A] text-white/55 hover:border-[#7C3AED]/35 hover:text-white/75"
              }`}
            >
              🧠 Clotter Mini
            </button>
          </div>
        </div>
      </header>

      <ChatInterface selectedModel={selectedModel} />
    </div>
  );
}
