"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, memo, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  CHAT_SESSIONS_UPDATED_EVENT,
  dispatchChatSessionsUpdated,
} from "@/lib/chat-sessions-events";
import { displaySessionTitle } from "@/lib/generate-chat-title";
import { LogoutButton } from "./logout-button";
import { ClotterLogo } from "./clotter-logo";
import { useToast } from "./toast-provider";

export type SidebarUser = {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  initials: string;
};

const dashboardNavItem = {
  label: "Dashboard",
  href: "/dashboard",
  icon: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const navGroups = [
  {
    label: "CREATE",
    items: [
      {
        label: "Caption Generator",
        href: "/dashboard/captions",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M4 6h16M4 12h12M4 18h8M20 18l-2 2-4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Hook Generator",
        href: "/dashboard/hooks",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Script Generator",
        href: "/dashboard/script",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M8 4h8a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M10 8h4M10 12h4M10 16h2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    label: "PLAN",
    items: [
      {
        label: "Content Ideas",
        href: "/dashboard/content-ideas",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M9.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 6v6l3 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
      {
        label: "Content Planner",
        href: "/dashboard/planner",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    label: "GROW",
    items: [
      {
        label: "Trend Analyzer",
        href: "/dashboard/trends",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M3 17l6-6 4 4 8-10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 5h7v7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
    ],
  },
  {
    label: "ME",
    items: [
      {
        label: "AI Memory",
        href: "/dashboard/memory",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.5A2.5 2.5 0 0 0 5 7.5 2.5 2.5 0 0 0 2.5 10v1A2.5 2.5 0 0 0 5 13.5 2.5 2.5 0 0 0 7 15.5v.5A2.5 2.5 0 0 0 9.5 18h1A2.5 2.5 0 0 0 13 15.5v-.5a2.5 2.5 0 0 0 2-2.45V12a2.5 2.5 0 0 0-2-2.45V9A2.5 2.5 0 0 0 13 6.5V6A2.5 2.5 0 0 0 10.5 3.5h-1Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M12 6v12M9 9.5c.5-.5 1.5-.75 3-.75s2.5.25 3 .75M9 14.5c.5.5 1.5.75 3 .75s2.5-.25 3-.75"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        ),
      },
    ],
  },
];

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

type ChatSessionSummary = {
  id: string;
  title: string;
  updated_at: string;
};

const CHAT_HREF = "/dashboard/chat";

const navLinkBase =
  "dash-nav-item dash-nav-stagger group relative flex min-h-[44px] items-center gap-3 overflow-hidden rounded-xl border-l-2 px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ease-out";

function navLinkClass(active: boolean) {
  return active
    ? `${navLinkBase} border-pink-400 bg-pink-500/10 text-white`
    : `${navLinkBase} border-transparent text-white/45 hover:translate-x-1 hover:bg-pink-500/5 hover:text-white/85`;
}

function chatItemClass(active: boolean) {
  return `dash-chat-rise-in group/history relative flex min-h-[44px] flex-col justify-center rounded-xl border-l-2 px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ease-out ${
    active
      ? "border-pink-400 bg-pink-500/10 text-white"
      : "border-transparent text-white/45 hover:bg-pink-500/5 hover:text-white/85"
  }`;
}

const historyActionIconClass =
  "flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-opacity duration-150 hover:text-white/70 disabled:opacity-40";

type DeletedSessionSnapshot = {
  title: string;
  messages: unknown[];
  wasActive: boolean;
};

function formatTimeAgo(dateString: string, now = Date.now()) {
  const date = new Date(dateString);
  const seconds = Math.floor((now - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const ChatHistoryItem = memo(function ChatHistoryItem({
  session,
  index,
  isActive,
  timeLabel,
  onClose,
  onRename,
  onDelete,
}: {
  session: ChatSessionSummary;
  index: number;
  isActive: boolean;
  timeLabel: string;
  onClose: () => void;
  onRename: (id: string, title: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(session.title);
  const [isSavingRename, setIsSavingRename] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const escapingRenameRef = useRef(false);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    if (!isRenaming) {
      setRenameValue(session.title);
    }
  }, [session.title, isRenaming]);

  async function saveRename() {
    const trimmed = renameValue.trim();

    if (!trimmed || trimmed === session.title) {
      cancelRename();
      return;
    }

    setIsSavingRename(true);
    const saved = await onRename(session.id, trimmed);
    setIsSavingRename(false);

    if (saved) {
      setIsRenaming(false);
    }
  }

  function cancelRename() {
    escapingRenameRef.current = false;
    setRenameValue(session.title);
    setIsRenaming(false);
    setIsSavingRename(false);
  }

  function handleRenameBlur() {
    if (escapingRenameRef.current) {
      escapingRenameRef.current = false;
      return;
    }
    void saveRename();
  }

  async function handleDelete(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsFadingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 150));
    await onDelete(session.id);
  }

  return (
    <li
      className={`relative ${isFadingOut ? "dash-chat-history-fade-out" : ""}`}
      style={{ "--history-index": index } as React.CSSProperties}
    >
      {isRenaming ? (
        <div className={`${chatItemClass(isActive)} pr-3`}>
          <input
            ref={renameInputRef}
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            onBlur={handleRenameBlur}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void saveRename();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                escapingRenameRef.current = true;
                cancelRename();
              }
            }}
            disabled={isSavingRename}
            className="w-full border-b border-white/20 bg-transparent text-[13px] font-medium text-white outline-none disabled:opacity-60"
          />
          {isSavingRename && (
            <span className="mt-1 text-[10px] text-white/25">Saving...</span>
          )}
        </div>
      ) : (
        <div className="group relative">
          <Link
            href={`${CHAT_HREF}?session=${session.id}`}
            onClick={onClose}
            className={`${chatItemClass(isActive)} block pr-16`}
            style={{ "--history-index": index } as React.CSSProperties}
          >
            <span className="block truncate">
              {displaySessionTitle(session.title)}
            </span>
            <span className="mt-0.5 block text-[10px] font-normal text-white/25">
              {timeLabel}
            </span>
          </Link>

          <div className="pointer-events-none absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setRenameValue(session.title);
                setIsRenaming(true);
              }}
              className={historyActionIconClass}
              aria-label={`Rename ${session.title}`}
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
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
              onClick={(event) => void handleDelete(event)}
              className={`${historyActionIconClass} hover:text-red-400`}
              aria-label={`Delete ${session.title}`}
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
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
        </div>
      )}
    </li>
  );
});

function SidebarNavLink({
  item,
  pathname,
  onClose,
  animationIndex,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
  animationIndex: number;
}) {
  const active =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href) && item.href !== "#";

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={navLinkClass(active)}
      style={
        {
          "--nav-index": animationIndex,
          animationDelay: `${animationIndex * 30}ms`,
        } as React.CSSProperties
      }
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`relative z-[1] shrink-0 transition-all duration-200 ${
          active ? "text-pink-400" : "text-white/35 group-hover:text-pink-400/70"
        }`}
      >
        {item.icon}
      </span>
      <span className="relative z-[1] truncate">{item.label}</span>
    </Link>
  );
}

const ChatNavSection = memo(function ChatNavSection({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const activeSessionId = searchParams.get("session");
  const isChatPage = pathname.startsWith(CHAT_HREF);

  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [undoDelete, setUndoDelete] = useState<DeletedSessionSnapshot | null>(
    null,
  );
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const response = await fetch("/api/chat-sessions");
      if (!response.ok) return;

      const data = (await response.json()) as {
        sessions?: ChatSessionSummary[];
      };

      setSessions((data.sessions ?? []).slice(0, 10));
    } catch {
      // Sessions load silently in the background.
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (isChatPage) {
      void loadSessions();
    }
  }, [isChatPage, activeSessionId, loadSessions]);

  useEffect(() => {
    const handleUpdate = () => {
      void loadSessions();
    };

    window.addEventListener(CHAT_SESSIONS_UPDATED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(CHAT_SESSIONS_UPDATED_EVENT, handleUpdate);
    };
  }, [loadSessions]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 30000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  const showUndoToast = useCallback((snapshot: DeletedSessionSnapshot) => {
    setUndoDelete(snapshot);

    if (undoTimeoutRef.current) {
      window.clearTimeout(undoTimeoutRef.current);
    }

    undoTimeoutRef.current = setTimeout(() => {
      setUndoDelete(null);
    }, 3000);
  }, []);

  const handleUndoDelete = useCallback(async () => {
    if (!undoDelete) return;

    const response = await fetch("/api/chat-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: undoDelete.title,
        messages: undoDelete.messages,
      }),
    });

    if (!response.ok) return;

    const data = (await response.json()) as {
      session?: ChatSessionSummary;
    };

    if (!data.session) return;

    setSessions((current) =>
      [data.session!, ...current].slice(0, 10),
    );

    if (undoDelete.wasActive) {
      router.push(`${CHAT_HREF}?session=${data.session.id}`);
    }

    setUndoDelete(null);
    if (undoTimeoutRef.current) {
      window.clearTimeout(undoTimeoutRef.current);
    }
    dispatchChatSessionsUpdated();
  }, [undoDelete, router]);

  const handleRenameSession = useCallback(
    async (sessionId: string, title: string) => {
      const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) return false;

      const data = (await response.json()) as {
        session?: ChatSessionSummary;
      };

      if (!data.session) return false;

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? { ...session, title: data.session!.title }
            : session,
        ),
      );
      dispatchChatSessionsUpdated();
      showToast("Chat renamed");
      return true;
    },
    [showToast],
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      const snapshotResponse = await fetch(`/api/chat-sessions/${sessionId}`);
      let snapshot: DeletedSessionSnapshot = {
        title: "New Chat",
        messages: [],
        wasActive: activeSessionId === sessionId,
      };

      if (snapshotResponse.ok) {
        const snapshotData = (await snapshotResponse.json()) as {
          session?: { title?: string; messages?: unknown[] };
        };

        if (snapshotData.session) {
          snapshot = {
            title: snapshotData.session.title ?? "New Chat",
            messages: Array.isArray(snapshotData.session.messages)
              ? snapshotData.session.messages
              : [],
            wasActive: activeSessionId === sessionId,
          };
        }
      }

      const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) return false;

      setSessions((current) =>
        current.filter((session) => session.id !== sessionId),
      );

      if (activeSessionId === sessionId) {
        router.push(CHAT_HREF);
      }

      showUndoToast(snapshot);
      showToast("Chat deleted");
      dispatchChatSessionsUpdated();
      return true;
    },
    [activeSessionId, router, showUndoToast, showToast],
  );

  return (
    <div className="mb-1 space-y-1 px-1">
      <Link
        href={CHAT_HREF}
        onClick={onClose}
        className="dash-new-chat-btn dash-chat-rise-in flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 py-2 text-sm font-semibold text-white shadow-[0_0_24px_-8px_rgba(236,72,153,0.5)] transition-all duration-200"
        style={{ "--history-index": 0 } as React.CSSProperties}
      >
        <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
        New Chat
      </Link>

      {isChatPage && (
        <>
          {sessions.length === 0 ? (
            <p className="px-2 py-2 text-xs text-white/30">No chats yet</p>
          ) : (
            <ul className="space-y-0.5">
              {sessions.map((session, index) => (
                <ChatHistoryItem
                  key={session.id}
                  session={session}
                  index={index + 1}
                  isActive={activeSessionId === session.id}
                  timeLabel={formatTimeAgo(session.updated_at, now)}
                  onClose={onClose}
                  onRename={handleRenameSession}
                  onDelete={handleDeleteSession}
                />
              ))}
            </ul>
          )}

          {undoDelete && (
            <div className="dash-chat-rise-in mx-1 mt-2 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#13131f]/95 px-3 py-2.5">
              <span className="text-xs text-white/50">Chat deleted</span>
              <button
                type="button"
                onClick={() => void handleUndoDelete()}
                className="text-xs font-semibold text-pink-400 transition-colors duration-150 hover:text-pink-300"
              >
                Undo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
});

type DashboardSidebarProps = {
  user: SidebarUser;
  isMobileOpen: boolean;
  onClose: () => void;
};

export function DashboardSidebar({
  user,
  isMobileOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`dash-sidebar-enter fixed inset-y-0 left-0 z-50 flex h-full w-[17.5rem] flex-col border-r border-white/5 bg-[#0D0D1A]/98 backdrop-blur-2xl transition-transform duration-300 ease-out will-change-transform md:translate-x-0 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Glowing right edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#EC4899]/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -right-px w-px bg-[#EC4899]/15"
      />

      {/* Logo */}
      <div className="relative shrink-0 px-4 py-5 md:px-5">
        <div className="flex items-center gap-3">
          <div className="sidebar-logo-glow">
            <ClotterLogo size={32} />
          </div>
          <p className="font-heading text-[15px] font-bold tracking-[-0.02em] text-white">
            Clotter AI
          </p>
        </div>
        <div aria-hidden className="sidebar-logo-line mt-5" />
      </div>

      {/* Navigation */}
      <nav
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {(() => {
          let navIndex = 0;
          const nextIndex = () => navIndex++;

          return (
            <>
              <SidebarNavLink
                item={dashboardNavItem}
                pathname={pathname}
                onClose={onClose}
                animationIndex={nextIndex()}
              />

              {navGroups.map((group, groupIndex) => (
                <div key={group.label} className="mt-5">
                  <p
                    className="dash-nav-group-label mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25"
                    style={{ "--group-index": groupIndex } as React.CSSProperties}
                  >
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.label === "CREATE" && (
                      <ChatNavSection
                        pathname={pathname}
                        onClose={onClose}
                      />
                    )}
                    {group.items.map((item) => (
                      <SidebarNavLink
                        key={item.label}
                        item={item}
                        pathname={pathname}
                        onClose={onClose}
                        animationIndex={nextIndex()}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          );
        })()}
      </nav>

      {/* Profile */}
      <div className="shrink-0 border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              loading="lazy"
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500/30 to-orange-500/20 text-xs font-semibold text-white/90 ring-1 ring-white/10">
              {user.initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white/90">
              {user.fullName}
            </p>
            <p className="truncate text-[11px] text-white/35">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}

type DashboardMobileHeaderProps = {
  isMobileOpen: boolean;
  onToggle: () => void;
};

function DashboardMobileHeader({
  isMobileOpen,
  onToggle,
}: DashboardMobileHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center border-b border-[#EC4899]/10 bg-[#0D0D1A]/85 px-4 backdrop-blur-xl md:hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/60 to-transparent"
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMobileOpen}
        className="relative z-50 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-white/90 transition-all duration-150 hover:scale-[1.02] hover:border-[#EC4899]/35 hover:bg-[#EC4899]/10 active:scale-95"
      >
        {isMobileOpen ? (
          <span className="text-lg leading-none">✕</span>
        ) : (
          <span className="leading-none">☰</span>
        )}
      </button>
      <div className="pointer-events-none absolute inset-x-0 flex items-center justify-center">
        <div className="flex items-center gap-2.5">
          <ClotterLogo size={32} />
          <p className="truncate font-heading text-[15px] font-bold tracking-[-0.02em] text-white">
            Clotter AI
          </p>
        </div>
      </div>
    </header>
  );
}

type DashboardSidebarBackdropProps = {
  isMobileOpen: boolean;
  onClose: () => void;
};

function DashboardSidebarBackdrop({
  isMobileOpen,
  onClose,
}: DashboardSidebarBackdropProps) {
  return (
    <button
      type="button"
      aria-label="Close menu"
      onClick={onClose}
      className={`fixed inset-0 z-[45] bg-[#05050f]/70 backdrop-blur-[2px] transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:hidden ${
        isMobileOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    />
  );
}

type DashboardNavigationProps = {
  user: SidebarUser;
  children: ReactNode;
};

export function DashboardNavigation({
  user,
  children,
}: DashboardNavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  const closeSidebar = () => setIsMobileOpen(false);
  const toggleSidebar = () => setIsMobileOpen((open) => !open);

  return (
    <>
      <DashboardSidebarBackdrop
        isMobileOpen={isMobileOpen}
        onClose={closeSidebar}
      />
      <Suspense fallback={null}>
        <DashboardSidebar
          user={user}
          isMobileOpen={isMobileOpen}
          onClose={closeSidebar}
        />
      </Suspense>
      <DashboardMobileHeader
        isMobileOpen={isMobileOpen}
        onToggle={toggleSidebar}
      />
      {children}
    </>
  );
}
