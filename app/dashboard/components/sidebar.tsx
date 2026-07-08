"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, memo, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  CHAT_SESSIONS_UPDATED_EVENT,
  dispatchChatSessionsUpdated,
} from "@/lib/chat-sessions-events";
import { LogoutButton } from "./logout-button";
import { ClotterLogo } from "./clotter-logo";

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
        label: "AI Chat",
        href: "/dashboard/chat",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path
              d="M8 10h8M8 14h5M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 0 1-4-.8L3 21l1.8-4.2A8.8 8.8 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ),
      },
      {
        label: "Bubble",
        href: "/dashboard/bubble",
        icon: (
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="14" cy="14" r="1" fill="currentColor" opacity="0.35" />
          </svg>
        ),
      },
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
  "dash-nav-item group relative flex items-center gap-3.5 overflow-hidden rounded-xl border-l-2 px-3.5 py-3 text-[15px] font-medium tracking-[-0.02em] transition-all duration-200";

function navLinkClass(active: boolean) {
  return active
    ? `${navLinkBase} border-pink-500 bg-gradient-to-r from-pink-500/10 to-orange-500/5 text-white`
    : `${navLinkBase} border-transparent text-white/50 hover:bg-white/5 hover:text-white/80`;
}

function capitalizeTitle(title: string) {
  const trimmed = title.trim();
  if (!trimmed) return "New Chat";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function truncateTitle(title: string, maxLength = 28) {
  const formatted = capitalizeTitle(title);
  if (formatted.length <= maxLength) return formatted;
  return `${formatted.slice(0, maxLength - 3)}...`;
}

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

function chatSubLinkClass(active: boolean) {
  return `dash-chat-history-item flex items-center rounded-lg py-1.5 pl-8 pr-16 text-xs transition-all duration-200 ${
    active
      ? "border-l-2 border-pink-500 bg-pink-500/10 text-white/80 shadow-[0_0_20px_-10px_rgba(236,72,153,0.5)]"
      : "border-l-2 border-transparent text-white/50 hover:bg-white/5 hover:text-white/80"
  }`;
}

const historyActionIconClass =
  "rounded p-1 text-white/40 transition-all duration-150 hover:scale-[1.05] hover:text-white/80 disabled:opacity-40";

const ChatHistoryItem = memo(function ChatHistoryItem({
  session,
  index,
  isActive,
  timeLabel,
  onClose,
  onRename,
  onDuplicate,
  onDelete,
}: {
  session: ChatSessionSummary;
  index: number;
  isActive: boolean;
  timeLabel: string;
  onClose: () => void;
  onRename: (id: string, title: string) => Promise<boolean>;
  onDuplicate: (id: string) => Promise<ChatSessionSummary | null>;
  onDelete: (id: string) => Promise<boolean>;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(session.title);
  const [isSavingRename, setIsSavingRename] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
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

  async function confirmDeleteSession() {
    setIsDeleting(true);
    setIsFadingOut(true);
    setConfirmDelete(false);

    await new Promise((resolve) => setTimeout(resolve, 200));
    await onDelete(session.id);
    setIsDeleting(false);
  }

  async function handleDuplicate(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setConfirmDelete(false);
    setIsDuplicating(true);
    await onDuplicate(session.id);
    setIsDuplicating(false);
  }

  return (
    <li
      className={`group relative dash-chat-history-item ${
        isFadingOut ? "dash-chat-history-fade-out" : ""
      }`}
      style={{ "--history-index": index + 1 } as React.CSSProperties}
    >
      {isRenaming ? (
        <div className={`${chatSubLinkClass(isActive)} flex-col items-start gap-1`}>
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
            className="w-full border-b border-white/20 bg-transparent text-xs text-white outline-none placeholder:text-white/30 disabled:opacity-60"
          />
          {isSavingRename && (
            <span className="text-[10px] text-white/30">Saving...</span>
          )}
        </div>
      ) : (
        <>
          <Link
            href={`${CHAT_HREF}?session=${session.id}`}
            onClick={onClose}
            className={`${chatSubLinkClass(isActive)} flex-col items-start gap-0.5`}
          >
            <span className="w-full truncate">
              {truncateTitle(session.title)}
            </span>
            <span className="text-[10px] text-white/30">{timeLabel}</span>
          </Link>

          <div className="dash-chat-history-actions pointer-events-none absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-0.5 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setConfirmDelete(false);
                setRenameValue(session.title);
                setIsRenaming(true);
              }}
              className={historyActionIconClass}
              aria-label={`Rename ${session.title}`}
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden>
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
              onClick={(event) => void handleDuplicate(event)}
              disabled={isDuplicating}
              className={historyActionIconClass}
              aria-label={`Duplicate ${session.title}`}
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden>
                <rect
                  x="5"
                  y="5"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <path
                  d="M5 11H4a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 4 2.5h5.5A1.5 1.5 0 0 1 11 4v1"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setConfirmDelete(true);
              }}
              disabled={isDeleting}
              className={`${historyActionIconClass} hover:text-red-400`}
              aria-label={`Delete ${session.title}`}
            >
              <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden>
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
        </>
      )}

      {confirmDelete && !isRenaming && (
        <div className="absolute left-6 right-2 top-full z-10 mt-1 rounded-lg border border-white/10 bg-[#13131f] px-2.5 py-2 shadow-lg">
          <p className="text-[10px] text-white/50">Delete?</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void confirmDeleteSession();
              }}
              disabled={isDeleting}
              className="rounded-md bg-red-500/20 px-2 py-0.5 text-[10px] font-medium text-red-300 transition-all duration-150 hover:bg-red-500/30"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setConfirmDelete(false);
              }}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60 transition-all duration-150 hover:bg-white/10 hover:text-white/80"
            >
              No
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
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
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
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`relative z-[1] transition-all duration-200 ${
          active
            ? "text-pink-400"
            : "text-white/40 group-hover:text-pink-400/80"
        }`}
      >
        {item.icon}
      </span>
      <span className="relative z-[1]">{item.label}</span>
    </Link>
  );
}

const ChatNavSection = memo(function ChatNavSection({
  item,
  pathname,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSessionId = searchParams.get("session");
  const isChatPage = pathname.startsWith(CHAT_HREF);
  const isParentActive = isChatPage;

  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [now, setNow] = useState(() => Date.now());

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
      return true;
    },
    [],
  );

  const handleDuplicateSession = useCallback(
    async (sessionId: string) => {
      const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        method: "POST",
      });

      if (!response.ok) return null;

      const data = (await response.json()) as {
        session?: ChatSessionSummary;
      };

      if (!data.session) return null;

      setSessions((current) =>
        [data.session!, ...current.filter((s) => s.id !== data.session!.id)].slice(
          0,
          10,
        ),
      );
      dispatchChatSessionsUpdated();
      return data.session;
    },
    [],
  );

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
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

      dispatchChatSessionsUpdated();
      return true;
    },
    [activeSessionId, router],
  );

  return (
    <div>
      <Link
        href={CHAT_HREF}
        onClick={onClose}
        className={navLinkClass(isParentActive)}
        aria-current={isParentActive ? "page" : undefined}
      >
        <span
          className={`relative z-[1] transition-all duration-200 ${
            isParentActive
              ? "text-pink-400"
              : "text-white/40 group-hover:text-pink-400/80"
          }`}
        >
          {item.icon}
        </span>
        <span className="relative z-[1]">{item.label}</span>
      </Link>

      {isChatPage && (
        <ul className="mt-1 space-y-0.5">
          <li
            className="dash-chat-history-item"
            style={{ "--history-index": 0 } as React.CSSProperties}
          >
            <Link
              href={CHAT_HREF}
              onClick={onClose}
              className={`${chatSubLinkClass(!activeSessionId)} gap-2`}
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-3 w-3 shrink-0 text-pink-500"
                aria-hidden
              >
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>New Chat</span>
            </Link>
          </li>

          {sessions.length === 0 ? (
            <li className="px-8 py-2 text-xs text-white/30">No chats yet</li>
          ) : (
            sessions.map((session, index) => (
              <ChatHistoryItem
                key={session.id}
                session={session}
                index={index}
                isActive={activeSessionId === session.id}
                timeLabel={formatTimeAgo(session.updated_at, now)}
                onClose={onClose}
                onRename={handleRenameSession}
                onDuplicate={handleDuplicateSession}
                onDelete={handleDeleteSession}
              />
            ))
          )}
        </ul>
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
      className={`dash-sidebar-enter fixed inset-y-0 left-0 z-50 flex h-full w-[17.5rem] flex-col border-r border-[#EC4899]/10 bg-[#0D0D1A]/95 backdrop-blur-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform md:translate-x-0 ${
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
      <div className="relative shrink-0 border-b border-[#EC4899]/10 px-6 py-7">
        <div className="flex items-center gap-3.5">
          <ClotterLogo size={32} />
          <div>
            <p className="font-heading text-base font-bold tracking-[-0.02em] text-white">
              Clotter AI
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <SidebarNavLink
          item={dashboardNavItem}
          pathname={pathname}
          onClose={onClose}
        />

        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className="mt-6">
            <p
              className="dash-nav-group-label mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/25"
              style={{ "--group-index": groupIndex } as React.CSSProperties}
            >
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) =>
                item.href === CHAT_HREF ? (
                  <ChatNavSection
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    onClose={onClose}
                  />
                ) : (
                  <SidebarNavLink
                    key={item.label}
                    item={item}
                    pathname={pathname}
                    onClose={onClose}
                  />
                ),
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div className="shrink-0 border-t border-white/10 p-5">
        <div className="dash-glass-v2 !rounded-2xl !p-4 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex items-center gap-3.5">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt=""
                loading="lazy"
                className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-[#EC4899]/30"
              />
            ) : (
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899]/40 to-[#F97316]/20 text-sm font-semibold text-[#FECDD3] ring-1 ring-[#EC4899]/30">
                {user.initials}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-[#EC4899]/20 blur-sm"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium tracking-[-0.02em] text-white/95">
                {user.fullName}
              </p>
              <p className="truncate text-xs text-white/40">{user.email}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
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
