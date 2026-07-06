"use client";

import { useCallback, useEffect, useState } from "react";
import { ChatBackground } from "./chat-background";
import {
  ChatHistorySidebar,
  type ChatSessionSummary,
} from "./chat-history-sidebar";
import { ChatInterface } from "./chat-interface";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const response = await fetch("/api/chat-sessions");
      if (!response.ok) return;

      const data = (await response.json()) as {
        sessions?: ChatSessionSummary[];
      };

      setSessions(data.sessions ?? []);
    } catch {
      // Sessions load silently in the background.
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  function handleNewChat() {
    setActiveSessionId(null);
    setHistoryOpen(false);
  }

  function handleSelectSession(id: string) {
    setActiveSessionId(id);
    setHistoryOpen(false);
  }

  function handleSessionCreate(id: string, title: string) {
    const now = new Date().toISOString();
    const newSession: ChatSessionSummary = {
      id,
      title,
      created_at: now,
      updated_at: now,
    };

    setSessions((current) => [
      newSession,
      ...current.filter((session) => session.id !== id),
    ]);
    setActiveSessionId(id);
  }

  function handleMessagesUpdate(_messages: unknown[]) {
    const now = new Date().toISOString();

    setSessions((current) => {
      if (!activeSessionId) return current;

      const updated = current.map((session) =>
        session.id === activeSessionId
          ? { ...session, updated_at: now }
          : session,
      );

      return [...updated].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    });
  }

  async function handleRenameSession(id: string, title: string) {
    const response = await fetch(`/api/chat-sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as { session?: ChatSessionSummary };
    if (!data.session) return;

    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, title: data.session!.title } : session,
      ),
    );
  }

  async function handleDeleteSession(id: string) {
    const response = await fetch(`/api/chat-sessions/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) return;

    setSessions((current) => current.filter((session) => session.id !== id));

    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  }

  return (
    <div className="relative flex h-screen overflow-hidden">
      <ChatHistorySidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <ChatBackground />

        <header className="relative z-10 max-h-[60px] shrink-0 overflow-hidden border-b border-[#7C3AED]/10 bg-[#05050f]/40 px-4 py-3 backdrop-blur-xl md:max-h-none md:px-8 md:py-6 sm:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/35 to-transparent"
          />
          <div className="flex items-center justify-between gap-3 md:gap-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => setHistoryOpen(true)}
                aria-label="Open chat history"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/90 transition hover:border-[#EC4899]/35 hover:bg-[#EC4899]/10 md:hidden"
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden>
                  <path
                    d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <p className="hidden text-xs font-semibold uppercase tracking-[0.12em] text-[#A855F7]/70 md:block">
                  AI Chat
                </p>
                <h1 className="font-heading truncate text-xl font-bold tracking-[-0.02em] text-white md:mt-1.5 md:text-4xl lg:text-[3rem]">
                  Creative co-pilot
                </h1>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-[#A855F7]/50 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] px-3 py-1 text-[10px] font-semibold tracking-[-0.01em] text-white shadow-[0_0_24px_-6px_#A855F7] md:px-4 md:py-2 md:text-xs sm:px-5 sm:text-sm">
              ⚡ Clotter Lite
            </span>
          </div>
        </header>

        <ChatInterface
          selectedModel="Clotter Lite"
          sessionId={activeSessionId}
          onSessionCreate={handleSessionCreate}
          onMessagesUpdate={handleMessagesUpdate}
        />
      </div>
    </div>
  );
}
