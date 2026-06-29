import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const quickActions = [
  {
    title: "Start AI Chat",
    description: "Brainstorm ideas and refine your content with your creative co-pilot.",
    href: "/dashboard/chat",
    accent: "from-[#A855F7]/20 to-[#7C3AED]/5",
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
    title: "Generate Captions",
    description: "Write scroll-stopping captions tailored to your brand voice.",
    href: "/dashboard/captions",
    accent: "from-[#C084FC]/20 to-[#7C3AED]/5",
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
    title: "Create Hooks",
    description: "Craft attention-grabbing openers for Reels, TikTok, and Shorts.",
    href: "#",
    accent: "from-[#818CF8]/20 to-[#A855F7]/5",
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
    title: "Plan Content",
    description: "Map your calendar and schedule posts across every platform.",
    href: "#",
    accent: "from-[#A855F7]/15 to-[#6366F1]/5",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
  {
    title: "Explore Ideas",
    description: "Discover fresh content concepts aligned with your niche.",
    href: "#",
    accent: "from-[#7C3AED]/20 to-[#A855F7]/5",
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
    title: "Analyze Trends",
    description: "Spot rising topics before they peak in your audience.",
    href: "#",
    accent: "from-[#A855F7]/20 to-[#C084FC]/5",
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

const MOTIVATIONAL_LINES = [
  "Consistency beats perfection — ship one piece of content today.",
  "Your next viral moment is one bold idea away.",
  "Creators who show up daily win. You've got this.",
  "Don't wait for inspiration — create it.",
  "Your audience is waiting. Give them something worth sharing.",
  "Small steps today, massive growth tomorrow.",
  "The best content starts messy. Just start.",
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

function getMotivationalLine() {
  return MOTIVATIONAL_LINES[new Date().getDay() % MOTIVATIONAL_LINES.length];
}

function getTodayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user ? getFirstName(user) : "Creator";
  const greeting = getTimeGreeting();
  const today = getTodayLabel();
  const motivationalLine = getMotivationalLine();

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
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

      <main className="flex-1 space-y-12 px-8 py-10 sm:space-y-14 sm:px-10 sm:py-12">
        {/* Personalized greeting */}
        <section className="dash-fade-in">
          <h2 className="font-heading text-[2rem] font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-[2.75rem] lg:text-[3rem]">
            {greeting}, {firstName} 👋
          </h2>
        </section>

        {/* Daily Brief */}
        <section className="dash-fade-in dash-fade-in-delay-1">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/50 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#7C3AED]/20 blur-3xl"
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#A855F7]">
                Your Daily Brief
              </p>
              <p className="mt-2 text-sm font-medium text-white/45">{today}</p>
              <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.75] tracking-[-0.015em] text-white/70">
                {motivationalLine}
              </p>
              <p className="font-heading mt-5 text-xl font-semibold tracking-[-0.02em] text-[#E9D5FF] sm:text-2xl">
                What are you creating today?
              </p>
            </div>
          </div>
        </section>

        {/* Stats hero */}
        <section className="dash-fade-in dash-fade-in-delay-1 relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(ellipse_at_30%_20%,rgba(124,58,237,0.28),transparent_60%),radial-gradient(ellipse_at_80%_60%,rgba(168,85,247,0.15),transparent_55%)] blur-2xl"
          />
          <div className="dash-hero-v2 relative overflow-hidden p-8 sm:p-10">
            <div aria-hidden className="dash-hero-orb" />
            <div aria-hidden className="dash-hero-orb-bl" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#7C3AED]/20 blur-[100px]"
            />

            <div className="relative">
              <div className="dash-badge-live inline-flex items-center gap-2 rounded-full border border-[#A855F7]/25 bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#E9D5FF]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A855F7] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                </span>
                System online
              </div>

              <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.75] tracking-[-0.015em] text-white/50">
                Your creative operating system is online. Pick a tool below to
                ideate, write, plan, and publish — all powered by AI that
                understands your brand.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5">
                {[
                  { value: "12", label: "Posts this week" },
                  { value: "4", label: "Drafts in progress" },
                  { value: "3", label: "Trending topics" },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`dash-stat-v2 dash-fade-in dash-glow-hover ${
                      i === 1
                        ? "dash-card-float-delay-1"
                        : i === 2
                          ? "dash-card-float-delay-2"
                          : ""
                    }`}
                    style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                  >
                    <p className="dash-stat-glow">{stat.value}</p>
                    <p className="mt-2.5 text-xs font-medium tracking-wide text-white/40">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="dash-fade-in dash-fade-in-delay-2">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
              Quick actions
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed tracking-[-0.01em] text-white/45">
              Jump into your most-used tools
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#A855F7]/35 hover:bg-white/[0.07] hover:shadow-[0_12px_48px_-16px_rgba(168,85,247,0.5)] ${
                  index % 3 === 1
                    ? "dash-card-float-delay-1"
                    : index % 3 === 2
                      ? "dash-card-float-delay-2"
                      : ""
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${action.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#A855F7]/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="relative flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white shadow-[0_0_32px_-4px_#A855F7] ring-1 ring-white/15 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_48px_0px_#A855F7]">
                    {action.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold tracking-[-0.025em] text-white transition-colors duration-300 group-hover:text-[#E9D5FF]">
                      {action.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.65] tracking-[-0.01em] text-white/40 transition-colors duration-300 group-hover:text-white/60">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="relative mt-6 flex translate-y-1 items-center gap-1.5 text-[13px] font-medium text-[#C084FC] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Open tool
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
