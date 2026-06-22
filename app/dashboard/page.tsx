import Link from "next/link";

const quickActions = [
  {
    title: "Start AI Chat",
    description: "Brainstorm ideas and refine your content with your creative co-pilot.",
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
    title: "Generate Captions",
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
    title: "Create Hooks",
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
    title: "Plan Content",
    description: "Map your calendar and schedule posts across every platform.",
    href: "#",
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

export default function DashboardPage() {
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

      <main className="flex-1 px-8 py-10 sm:px-10 sm:py-12">
        {/* Welcome hero */}
        <div className="dash-fade-in dash-fade-in-delay-1 relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(ellipse_at_30%_20%,rgba(124,58,237,0.35),transparent_60%),radial-gradient(ellipse_at_80%_60%,rgba(168,85,247,0.2),transparent_55%)] blur-2xl"
          />
          <div className="dash-hero-v2 relative overflow-hidden p-10 sm:p-12">
            {/* Animated orbs */}
            <div aria-hidden className="dash-hero-orb" />
            <div aria-hidden className="dash-hero-orb-bl" />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#7C3AED]/25 blur-[100px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-[#A855F7]/15 blur-[80px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(168,85,247,0.06)_0%,transparent_50%)]"
            />

            <div className="relative">
              <div className="dash-badge-live inline-flex items-center gap-2 rounded-full border border-[#A855F7]/25 bg-[#7C3AED]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#E9D5FF]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A855F7] opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#A855F7]" />
                </span>
                System online
              </div>

              <h2 className="font-heading mt-6 max-w-2xl text-[2.125rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-[2.875rem]">
                Ready to create
                <span className="bg-gradient-to-r from-[#E9D5FF] via-[#C084FC] to-[#A855F7] bg-clip-text text-transparent">
                  {" "}
                  something great?
                </span>
              </h2>
              <p className="mt-5 max-w-2xl text-[1.0625rem] leading-[1.75] tracking-[-0.015em] text-white/50">
                Your creative operating system is online. Pick a tool below to
                ideate, write, plan, and publish — all powered by AI that
                understands your brand.
              </p>

              <div className="mt-10 flex flex-wrap gap-4 sm:gap-5">
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
        </div>

        {/* Quick actions */}
        <div className="dash-fade-in dash-fade-in-delay-2 mt-14">
          <div>
            <h2 className="font-heading text-xl font-bold tracking-[-0.02em] text-white sm:text-2xl">
              Quick actions
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed tracking-[-0.01em] text-white/45">
              Jump into your most-used tools
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                href={action.href}
                className={`dash-glass-v2 dash-action-card dash-glow-hover group relative overflow-hidden p-7 ${
                  index % 3 === 1
                    ? "dash-card-float-delay-1"
                    : index % 3 === 2
                      ? "dash-card-float-delay-2"
                      : ""
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#7C3AED]/15 via-transparent to-[#A855F7]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#A855F7]/20 blur-3xl opacity-0 transition-all duration-500 group-hover:opacity-100"
                />

                <div className="relative flex items-start gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] text-white shadow-[0_0_32px_-4px_#A855F7] ring-1 ring-white/15 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_48px_0px_#A855F7]">
                    {action.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-semibold tracking-[-0.025em] text-white transition-colors duration-300 group-hover:text-[#E9D5FF]">
                      {action.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.65] tracking-[-0.01em] text-white/40 transition-colors duration-300 group-hover:text-white/55">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="relative mt-6 flex translate-y-1 items-center gap-1.5 text-[13px] font-medium text-[#C084FC] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  Open tool
                  <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>
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
        </div>
      </main>
    </div>
  );
}
