import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const stats = [
  { label: "Daily Streak", value: "🔥 3 Day Streak" },
  { label: "Content Generated", value: "⚡ 12 pieces" },
  { label: "Ideas Saved", value: "💡 8 ideas" },
  { label: "Growth Score", value: "📈 +24%" },
];

const aiSuggestions = [
  "Reels are trending today — perfect time to post",
  "Your audience is most active at 7PM",
  "Try a 'Day in my life' format this week",
];

const quickActions = [
  {
    title: "AI Chat",
    description: "Brainstorm ideas and refine content with your creative co-pilot.",
    href: "/dashboard/chat",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
    title: "Captions",
    description: "Write scroll-stopping captions tailored to your brand voice.",
    href: "/dashboard/captions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
    title: "Hooks",
    description: "Craft attention-grabbing openers for Reels, TikTok, and Shorts.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
    title: "Script",
    description: "Generate full video scripts optimized for retention and virality.",
    href: "/dashboard/script",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
  {
    title: "Content Ideas",
    description: "Discover fresh content concepts aligned with your niche.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
    title: "Trend Analyzer",
    description: "Spot rising topics before they peak in your audience.",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
];

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}) {
  const email = user.email ?? "";
  const meta = user.user_metadata ?? {};
  const fullName =
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    email.split("@")[0] ||
    "Creator";

  return fullName.split(/\s+/)[0];
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user ? getFirstName(user) : "Creator";
  const greeting = getTimeGreeting();

  return (
    <div className="flex min-h-full flex-col">
      <header className="dash-fade-in relative shrink-0 border-b border-[#7C3AED]/10 bg-[#0D0D1A]/60 px-8 py-7 backdrop-blur-2xl sm:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/40 to-transparent"
        />
        <div className="flex items-center justify-between gap-6">
          <h1 className="font-heading text-[2rem] font-bold tracking-[-0.02em] text-white sm:text-[2.375rem]">
            Dashboard
          </h1>
          <button
            type="button"
            className="dash-glass-v2 flex h-11 w-11 items-center justify-center !rounded-xl text-white/50 transition-all duration-300 hover:!border-[#A855F7]/40 hover:text-[#C084FC] hover:shadow-[0_0_32px_-8px_#A855F7]"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M15 17H9c-2 0-3-.8-3-2.8V10a6 6 0 1 1 12 0v4.2c0 2-1 2.8-3 2.8ZM12 21a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <main className="dash-page-enter flex-1 space-y-10 px-8 py-10 sm:space-y-12 sm:px-10 sm:py-12">
        {/* Greeting */}
        <section className="dash-fade-in">
          <h2 className="font-heading text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3rem]">
            {greeting}, {firstName}
          </h2>
          <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed tracking-[-0.015em] text-white/50">
            Here&apos;s your creative workspace for today.
          </p>
        </section>

        {/* Stats row */}
        <section
          className="dash-fade-in grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
          style={{ animationDelay: "0.08s" }}
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="dash-fade-in rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#A855F7]/30 hover:shadow-[0_8px_40px_-12px_rgba(168,85,247,0.45)] sm:p-6"
              style={{ animationDelay: `${0.12 + index * 0.07}s` }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/35">
                {stat.label}
              </p>
              <p className="mt-3 text-[1.0625rem] font-semibold tracking-[-0.02em] text-white sm:text-lg">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* AI Suggestions */}
        <section
          className="dash-fade-in rounded-2xl border border-white/10 border-l-4 border-l-[#A855F7] bg-white/5 p-6 backdrop-blur-md sm:p-8"
          style={{ animationDelay: "0.28s" }}
        >
          <h3 className="font-heading text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
            Today&apos;s Opportunities
          </h3>
          <ul className="mt-6 space-y-4">
            {aiSuggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className="dash-fade-in flex items-start gap-3 text-[15px] leading-relaxed tracking-[-0.01em] text-white/65 sm:text-base"
                style={{ animationDelay: `${0.34 + index * 0.06}s` }}
              >
                <span
                  aria-hidden
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#A855F7]"
                />
                {suggestion}
              </li>
            ))}
          </ul>
        </section>

        {/* Quick actions */}
        <section className="dash-fade-in" style={{ animationDelay: "0.4s" }}>
          <div>
            <h3 className="font-heading text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
              Quick actions
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed tracking-[-0.01em] text-white/45">
              Jump into your most-used tools
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className="dash-fade-in group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#A855F7]/35 hover:bg-white/[0.07] hover:shadow-[0_16px_48px_-16px_rgba(168,85,247,0.55)] sm:p-7"
                style={{ animationDelay: `${0.46 + index * 0.07}s` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 via-[#A855F7]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#A855F7]/20 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="relative flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white shadow-[0_0_32px_-4px_#A855F7] ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110">
                    {action.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[17px] font-semibold tracking-[-0.025em] text-white transition-colors duration-300 group-hover:text-[#E9D5FF]">
                      {action.title}
                    </h4>
                    <p className="mt-2 text-[14px] leading-[1.65] tracking-[-0.01em] text-white/40 transition-colors duration-300 group-hover:text-white/60">
                      {action.description}
                    </p>
                    <p className="mt-4 translate-y-1 text-[13px] font-medium text-[#C084FC] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Open →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
