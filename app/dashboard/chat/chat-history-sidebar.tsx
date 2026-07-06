"use client";

import { useEffect, useRef, useState } from "react";

export type ChatSessionSummary = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

type ChatHistorySidebarProps = {
  sessions: ChatSessionSummary[];
  activeSessionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onRenameSession: (id: string, title: string) => Promise<void>;
  onDeleteSession: (id: string) => Promise<void>;
};

export function ChatHistorySidebar({
  sessions,
  activeSessionId,
  isOpen,
  onClose,
  onNewChat,
  onSelectSession,
  onRenameSession,
  onDeleteSession,
}: ChatHistorySidebarProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  async function saveRename(id: string) {
    const trimmed = renameValue.trim();
    setRenamingId(null);

    if (!trimmed) return;

    const session = sessions.find((item) => item.id === id);
    if (!session || session.title === trimmed) return;

    await onRenameSession(id, trimmed);
  }

  function startRename(session: ChatSessionSummary) {
    setRenamingId(session.id);
    setRenameValue(session.title);
  }

  async function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(
      `Delete "${title}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    await onDeleteSession(id);
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close chat history"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[#05050f]/70 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-white/5 bg-[#0D0D1A] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:static md:z-0 md:shrink-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-white/5 p-3">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#F97316] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_32px_-8px_rgba(236,72,153,0.75)] transition hover:scale-[1.02]"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden>
              <path
                d="M10 4v12M4 10h12"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {sessions.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-white/30">
              No chats yet. Start a new conversation.
            </p>
          ) : (
            <ul className="space-y-1">
              {sessions.map((session) => {
                const isActive = activeSessionId === session.id;
                const isRenaming = renamingId === session.id;

                return (
                  <li key={session.id} className="group relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (isRenaming) return;
                        onSelectSession(session.id);
                        onClose();
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left transition ${
                        isActive
                          ? "border-l-2 border-[#EC4899] bg-white/5"
                          : "border-l-2 border-transparent hover:bg-white/5"
                      }`}
                    >
                      {isRenaming ? (
                        <input
                          ref={renameInputRef}
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onBlur={() => void saveRename(session.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void saveRename(session.id);
                            }
                            if (e.key === "Escape") {
                              setRenamingId(null);
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full rounded-md border border-white/10 bg-[#13131f] px-2 py-1 text-sm text-white outline-none focus:border-[#EC4899]/40"
                        />
                      ) : (
                        <>
                          <p className="truncate pr-14 text-sm text-white/80">
                            {session.title}
                          </p>
                          <p className="mt-0.5 text-xs text-white/30">
                            {formatTimeAgo(session.updated_at)}
                          </p>
                        </>
                      )}
                    </button>

                    {!isRenaming && (
                      <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(session);
                          }}
                          className="rounded-md p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white/70"
                          aria-label={`Rename ${session.title}`}
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-3.5 w-3.5"
                            aria-hidden
                          >
                            <path
                              d="M11.5 2.5 13.5 4.5 5.5 12.5H3.5V10.5L11.5 2.5Z"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDelete(session.id, session.title);
                          }}
                          className="rounded-md p-1.5 text-white/40 transition hover:bg-white/10 hover:text-red-400"
                          aria-label={`Delete ${session.title}`}
                        >
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-3.5 w-3.5"
                            aria-hidden
                          >
                            <path
                              d="M3.5 5.5h9M6 5.5V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1m1.5 0v7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-7"
                              stroke="currentColor"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
