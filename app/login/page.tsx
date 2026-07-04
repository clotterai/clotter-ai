import { DashboardParticles } from "@/app/dashboard/components/particles";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

const tickerItems =
  "AI Captions • Hook Generator • Script Writer • Trend Analyzer • Creator Memory • Bubble AI • Content Ideas • AI Chat • Real-time Trends • Content Planner • ";

const features = [
  {
    emoji: "⚡",
    title: "AI Chat",
    description:
      "Your creative co-pilot. Ask anything, get creator-specific answers.",
  },
  {
    emoji: "🧠",
    title: "Creator Memory",
    description:
      "Clotter learns your niche, style, and audience. Gets smarter every session.",
  },
  {
    emoji: "📈",
    title: "Trend Analyzer",
    description:
      "Real-time trends from the web. Always know what's blowing up.",
  },
  {
    emoji: "✍️",
    title: "Caption Generator",
    description:
      "5 captions in seconds. Crafted for your voice and platform.",
  },
  {
    emoji: "🎣",
    title: "Hook Generator",
    description:
      "Stop-the-scroll hooks that get attention in the first 2 seconds.",
  },
  {
    emoji: "🫧",
    title: "Bubble",
    description:
      "Your personal AI buddy. Always here to vibe, vent, or brainstorm.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Clotter who you are",
    description: "Onboarding sets your niche and style",
  },
  {
    number: "02",
    title: "Ask for what you need",
    description: "Captions, hooks, scripts, trends",
  },
  {
    number: "03",
    title: "Post and grow",
    description: "Content that fits your voice, every time",
  },
];

const stats = [
  { value: "10+ AI Tools", label: "Everything in one OS" },
  { value: "Real-time Web Data", label: "Live trend intelligence" },
  { value: "AI Memory", label: "Learns your creator DNA" },
  { value: "100% Free to Start", label: "No credit card needed" },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const authError = params.error === "auth";

  return (
    <div className="login-landing relative min-h-screen overflow-x-hidden bg-[#0D0D1A] text-white">
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes login-orb-drift-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(48px, 36px) scale(1.06); }
        }

        @keyframes login-orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-42px, -30px) scale(1.08); }
        }

        @keyframes login-orb-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -24px) scale(1.05); }
        }

        @keyframes login-hero-in {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes login-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .login-hero-in {
          animation: login-hero-in 0.95s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .login-hero-delay-1 { animation-delay: 0.1s; }
        .login-hero-delay-2 { animation-delay: 0.2s; }
        .login-hero-delay-3 { animation-delay: 0.32s; }
        .login-hero-delay-4 { animation-delay: 0.44s; }

        .login-io {
          opacity: 0;
          transform: translateY(32px);
          transition:
            opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.75s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .login-io.login-io-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .login-ticker-track {
          display: flex;
          width: max-content;
          animation: login-ticker 45s linear infinite;
        }

        .login-ticker-track:hover {
          animation-play-state: paused;
        }

        .login-google-wrap button {
          border: none !important;
          border-radius: 0.875rem !important;
          background: linear-gradient(135deg, #ec4899 0%, #f97316 100%) !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 0 40px -8px rgba(236, 72, 153, 0.75) !important;
          transition:
            transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease !important;
        }

        .login-google-wrap button:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.14) inset,
            0 0 56px -6px rgba(249, 115, 22, 0.85) !important;
        }

        .login-google-wrap--nav {
          width: auto !important;
        }

        .login-google-wrap--nav > div {
          width: auto !important;
          max-width: none !important;
        }

        .login-google-wrap--nav button {
          width: auto !important;
          padding: 0.625rem 1.25rem !important;
          font-size: 0.875rem !important;
        }

        .login-google-wrap--hero button {
          padding: 1rem 1.75rem !important;
          font-size: 1rem !important;
          min-height: 3.25rem !important;
        }

        .login-google-wrap--cta button {
          padding: 1.125rem 2rem !important;
          font-size: 1.0625rem !important;
          min-height: 3.5rem !important;
        }

        .login-feature-card {
          transition:
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }

        .login-feature-card:hover {
          transform: translateY(-6px);
          border-color: rgba(236, 72, 153, 0.3);
          box-shadow: 0 24px 56px -24px rgba(236, 72, 153, 0.5);
        }

        .login-cta-card {
          background:
            linear-gradient(#0d0d1a, #0d0d1a) padding-box,
            linear-gradient(135deg, #ec4899, #f97316) border-box;
          border: 1px solid transparent;
        }
      `}</style>

      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "-12%",
            left: "-10%",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.45) 0%, rgba(249, 115, 22, 0.2) 50%, transparent 72%)",
            filter: "blur(90px)",
            opacity: 0.4,
            animation: "login-orb-drift-1 32s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-15%",
            right: "-8%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(236, 72, 153, 0.18) 48%, transparent 70%)",
            filter: "blur(90px)",
            opacity: 0.35,
            animation: "login-orb-drift-2 38s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "38%",
            left: "50%",
            width: "440px",
            height: "440px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 68%)",
            filter: "blur(90px)",
            opacity: 0.28,
            animation: "login-orb-drift-3 26s ease-in-out infinite",
          }}
        />
      </div>

      <DashboardParticles />

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="font-heading text-[15px] font-bold tracking-[-0.02em] text-white">
              Clotter AI
            </span>
          </div>
          <div className="login-google-wrap login-google-wrap--nav w-auto min-w-[7.5rem]">
            <LoginForm />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-24 sm:px-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <span className="login-hero-in login-hero-delay-1 inline-flex items-center gap-2 rounded-full border border-[#EC4899]/25 bg-[#EC4899]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.04em] text-[#FDA4AF]">
            ✦ The AI OS for Creators
          </span>

          <h1 className="login-hero-in login-hero-delay-2 font-heading mt-8 text-[2.75rem] font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
            Create content that
            <br />
            actually{" "}
            <span className="bg-gradient-to-r from-[#EC4899] via-[#F472B6] to-[#F97316] bg-clip-text text-transparent">
              goes viral.
            </span>
          </h1>

          <p className="login-hero-in login-hero-delay-3 mt-7 max-w-2xl text-base leading-relaxed tracking-[-0.015em] text-white/50 sm:text-lg sm:leading-relaxed">
            Clotter AI gives you captions, hooks, scripts, trends, and a creative
            co-pilot — all in one place. Built exclusively for creators.
          </p>

          {authError && (
            <p className="login-hero-in login-hero-delay-3 mt-6 w-full max-w-md rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-300">
              Authentication failed. Please try again.
            </p>
          )}

          <div className="login-hero-in login-hero-delay-4 mt-10 flex w-full max-w-lg flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
            <div className="login-google-wrap login-google-wrap--hero w-full sm:flex-1">
              <LoginForm />
            </div>
            <a
              href="#how-it-works"
              className="inline-flex min-h-[3.25rem] w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 text-[15px] font-semibold text-white/80 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white sm:w-auto"
            >
              See how it works
            </a>
          </div>

          <p className="login-hero-in login-hero-delay-4 mt-8 text-sm tracking-[-0.01em] text-white/30">
            Trusted by creators on Instagram, YouTube &amp; TikTok
          </p>
        </div>
      </section>

      {/* Ticker */}
      <div className="relative z-10 overflow-hidden border-y border-white/[0.06] bg-[#0a0a14]/80 py-4">
        <div className="login-ticker-track">
          <span className="whitespace-nowrap px-6 text-sm font-medium tracking-[0.06em] text-[#EC4899]/80">
            {tickerItems}
          </span>
          <span
            aria-hidden
            className="whitespace-nowrap px-6 text-sm font-medium tracking-[0.06em] text-[#EC4899]/80"
          >
            {tickerItems}
          </span>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="login-io mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem]">
              Everything a creator needs.
              <br />
              <span className="text-white/45">Nothing they don&apos;t.</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="login-io login-feature-card rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-md sm:p-8"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899]/20 to-[#F97316]/20 text-xl ring-1 ring-[#EC4899]/20">
                  {feature.emoji}
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-white/45">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="relative z-10 border-t border-white/[0.05] px-6 py-24 sm:px-10 sm:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="login-io text-center font-heading text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
            From idea to content in seconds
          </h2>

          <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            <div
              aria-hidden
              className="pointer-events-none absolute top-8 hidden h-px w-full bg-gradient-to-r from-transparent via-[#EC4899]/30 to-transparent md:block"
            />
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="login-io relative text-center md:text-left"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#F97316] font-heading text-sm font-bold text-white shadow-[0_0_32px_-6px_rgba(236,72,153,0.7)]">
                  {step.number}
                </span>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/45">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 border-y border-white/[0.05] bg-white/[0.02] px-6 py-24 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.value}
              className="login-io text-center"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <p className="bg-gradient-to-r from-[#EC4899] to-[#F97316] bg-clip-text text-xl font-bold tracking-[-0.02em] text-transparent sm:text-2xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-24 sm:px-10 sm:py-32">
        <div className="login-io login-cta-card mx-auto max-w-3xl rounded-3xl px-8 py-14 text-center backdrop-blur-md sm:px-12 sm:py-16">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
            Your content era starts now.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/45 sm:text-base">
            Join creators using Clotter AI to ship content at the speed of
            thought.
          </p>
          <div className="login-google-wrap login-google-wrap--cta mx-auto mt-10 max-w-sm">
            <LoginForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-8 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-white/35 sm:flex-row">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={24} height={24} className="h-6 w-6" />
            <span className="font-heading font-semibold text-white/70">
              Clotter AI
            </span>
          </div>
          <p className="text-center text-white/30">
            The AI OS for Creators
          </p>
          <p>© 2026 Clotter AI</p>
        </div>
      </footer>

      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){if(!('IntersectionObserver'in window))return;var els=document.querySelectorAll('.login-io');if(!els.length)return;var io=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('login-io-visible');io.unobserve(e.target);}});},{threshold:0.12,rootMargin:'0px 0px -40px 0px'});els.forEach(function(el){io.observe(el);});})();`,
        }}
      />
    </div>
  );
}
