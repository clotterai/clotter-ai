import { ChatBackground } from "./chat-background";
import { ChatInterface } from "./chat-interface";

export default function ChatPage() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <ChatBackground />

      {/* Header */}
      <header className="relative z-10 shrink-0 border-b border-[#7C3AED]/10 bg-[#05050f]/40 px-8 py-6 backdrop-blur-xl sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/35 to-transparent"
        />
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A855F7]/70">
              AI Chat
            </p>
            <h1 className="font-heading mt-1.5 text-[2.25rem] font-bold tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3rem]">
              Creative co-pilot
            </h1>
          </div>
          <div className="chat-model-badge hidden sm:inline-flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A855F7] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#A855F7]" />
            </span>
            GPT-4o Mini
          </div>
        </div>
      </header>

      <ChatInterface />
    </div>
  );
}
