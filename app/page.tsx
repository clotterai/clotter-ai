const features = [
  {
    title: "AI Chat",
    description:
      "A creative co-pilot that knows your voice, niche, and goals — brainstorm, refine, and ship in one thread.",
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
    title: "Caption Generator",
    description:
      "Platform-perfect captions in seconds — optimized for engagement, tone, and your personal brand.",
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
    title: "Hook Generator",
    description:
      "Scroll-stopping openers crafted for Reels, TikTok, and Shorts — tested patterns, your unique angle.",
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
    title: "Content Ideas",
    description:
      "Never stare at a blank page again. Get endless, on-brand concepts tailored to your audience.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M9.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 6v6l3 2M19 5l2-2M19 19l2 2M5 5 3 3M5 19l-2 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Trend Analyzer",
    description:
      "Spot rising topics before they peak. Real-time signals so you publish what audiences want now.",
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
  {
    title: "Content Planner",
    description:
      "Map your entire content calendar with AI — themes, cadence, and cross-platform scheduling in one view.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
        <path
          d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden bg-[#050505] font-sans text-white">
      {/* Background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-[#6366F1]/10 blur-[120px]" />
        <div className="absolute -right-32 top-2/3 h-[360px] w-[360px] rounded-full bg-[#818CF8]/8 blur-[100px]" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-8 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] shadow-[0_0_24px_-4px_#6366F1]">
            <span className="text-sm font-semibold text-white">C</span>
          </div>
          <span className="text-sm font-medium tracking-tight text-white">
            Clotter AI
          </span>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-white/45 sm:flex">
          <a
            href="#features"
            className="transition-colors hover:text-white/80"
          >
            Features
          </a>
          <a href="#" className="transition-colors hover:text-white/80">
            Pricing
          </a>
          <a
            href="#"
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
          >
            Sign in
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-28 pt-8 text-center sm:px-10 sm:pt-16">
        <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/20 bg-[#6366F1]/10 px-4 py-1.5 text-xs font-medium tracking-wide text-[#A5B4FC]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6366F1] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
          </span>
          AI operating system for creators
        </p>

        <h1 className="max-w-4xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
          The AI OS for{" "}
          <span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
            creators
          </span>{" "}
          who move fast
        </h1>

        <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-white/45 sm:mt-8 sm:text-lg sm:leading-8">
          Clotter AI unifies your entire creative stack — from ideation to
          publishing — so influencers and creators can grow faster with
          intelligence that feels native to their brand.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12 sm:flex-row">
          <a
            href="#"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-[#6366F1] px-8 text-sm font-medium text-white shadow-[0_0_40px_-8px_#6366F1] transition-all hover:shadow-[0_0_56px_-4px_#6366F1] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#818CF8] to-[#6366F1] opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative">Get started</span>
          </a>
          <a
            href="#features"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-8 text-sm font-medium text-white/60 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white/90"
          >
            Explore features
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-4 w-4"
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
          </a>
        </div>

        {/* Hero visual */}
        <div className="relative mt-20 w-full max-w-4xl">
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#6366F1]/40 via-[#6366F1]/10 to-transparent opacity-60" />
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0c]/80 p-1 shadow-[0_32px_64px_-24px_rgba(99,102,241,0.35)] backdrop-blur-xl">
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="ml-2 text-xs text-white/25">clotter.ai</span>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-3 sm:p-6">
              {["Ideate", "Create", "Publish"].map((step, i) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#6366F1]/15 to-transparent p-4 text-left"
                >
                  <p className="text-[10px] font-medium uppercase tracking-widest text-[#818CF8]">
                    Step {i + 1}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white/80">
                    {step}
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6366F1] to-[#818CF8]"
                      style={{ width: `${100 - i * 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-32 sm:px-10"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#818CF8]">
            Features
          </p>
          <h2 className="mt-4 text-balance text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
            Everything you need to create at scale
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-white/40">
            Six powerful tools, one intelligent system — built for the way
            modern creators actually work.
          </p>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 transition-all duration-300 hover:border-[#6366F1]/30 hover:shadow-[0_24px_48px_-20px_rgba(99,102,241,0.35)] sm:p-7"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6366F1]/20 via-[#6366F1]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#6366F1]/20 blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-0" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] text-white shadow-[0_8px_24px_-6px_rgba(99,102,241,0.6)] transition-transform duration-300 group-hover:scale-105">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-tight text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45 transition-colors duration-300 group-hover:text-white/55">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer CTA strip */}
      <section className="relative z-10 border-t border-white/[0.06] px-6 py-20 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#6366F1]/10 via-[#0a0a0a] to-[#6366F1]/5 px-8 py-14 text-center sm:flex-row sm:px-12 sm:text-left">
          <div>
            <h2 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Ready to upgrade your creative OS?
            </h2>
            <p className="mt-2 text-sm text-white/40">
              Join creators building smarter, not harder.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#6366F1] px-8 text-sm font-medium text-white shadow-[0_0_32px_-6px_#6366F1] transition-all hover:bg-[#5558E3] active:scale-[0.98]"
          >
            Get started free
          </a>
        </div>
        <p className="mx-auto mt-12 max-w-6xl text-center text-xs text-white/20">
          © {new Date().getFullYear()} Clotter AI. All rights reserved.
        </p>
      </section>
    </div>
  );
}
