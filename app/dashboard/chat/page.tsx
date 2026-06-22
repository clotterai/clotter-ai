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
        <div className="flex items-start justify-between gap-4 sm:items-center sm:gap-6">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A855F7]/70">
              AI Chat
            </p>
            <h1 className="font-heading mt-1.5 text-[2rem] font-bold tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3rem]">
              Creative co-pilot
            </h1>
          </div>
          <div className="chat-model-badge shrink-0">
            <span className="chat-model-badge-icon" aria-hidden>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-3 w-3 sm:h-3.5 sm:w-3.5"
              >
                <path
                  d="M8 1.5l1.1 3.4h3.6l-2.9 2.1 1.1 3.4L8 8.3l-2.9 2.1 1.1-3.4-2.9-2.1h3.6L8 1.5Z"
                  fill="currentColor"
                  className="text-white/95"
                />
                <path
                  d="M12.5 2.5l.4 1.2 1.2.4-1.2.4-.4 1.2-.4-1.2-1.2-.4 1.2-.4.4-1.2Z"
                  fill="currentColor"
                  className="text-white/70"
                />
              </svg>
            </span>
            <span className="chat-model-badge-text">GPT-4o Mini</span>
          </div>
        </div>
      </header>

      <ChatInterface />
    </div>
  );
}
