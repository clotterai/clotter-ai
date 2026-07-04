import { DashboardParticles } from "@/app/dashboard/components/particles";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

const tickerItems =
  "AI Chat • Hook Generator • Caption Writer • Trend Analyzer • Creator Memory • Bubble AI • Script Writer • Content Ideas • ";

const features = [
  {
    emoji: "⚡",
    title: "AI Chat",
    description: "Your creative co-pilot for strategy and ideas",
  },
  {
    emoji: "🧠",
    title: "Creator Memory",
    description: "Learns your niche. Gets smarter every day.",
  },
  {
    emoji: "📈",
    title: "Trend Analyzer",
    description: "Real-time trends from the live web",
  },
  {
    emoji: "✍️",
    title: "Caption Generator",
    description: "5 scroll-stopping captions in seconds",
  },
  {
    emoji: "🎣",
    title: "Hook Generator",
    description: "Open lines that demand attention",
  },
  {
    emoji: "🫧",
    title: "Bubble",
    description: "Your personal AI buddy. Always here.",
  },
];

const steps = [
  {
    number: "01",
    title: "Tell Clotter who you are",
    description: "Set your niche, platform, and style",
  },
  {
    number: "02",
    title: "Ask for what you need",
    description: "Captions, hooks, scripts, or ideas",
  },
  {
    number: "03",
    title: "Post and grow",
    description: "Content that fits your voice every time",
  },
];

function LogoOrb({ size }: { size: 32 | 80 }) {
  const gradientId = `login-orb-gradient-${size}`;

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="56">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <circle
        cx="32"
        cy="32"
        r="24"
        fill={`url(#${gradientId})`}
        opacity="0.95"
      />
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
      />
      <circle cx="24" cy="24" r="5" fill="rgba(255,255,255,0.35)" />
      <circle cx="40" cy="38" r="3" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}

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
    <div className="relative min-h-screen overflow-x-hidden bg-[#0D0D1A] text-white">
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes float-tl {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(32px, -40px); }
        }

        @keyframes float-br {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-36px, 32px); }
        }

        @keyframes float-cr {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-36px); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 12px rgba(236, 72, 153, 0.55));
          }
          50% {
            transform: scale(1.06);
            filter: drop-shadow(0 0 28px rgba(249, 115, 22, 0.7));
          }
        }

        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-hero-orb {
          animation: pulse 3s ease-in-out infinite;
        }

        .login-hero-item {
          animation: heroFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .login-hero-delay-1 { animation-delay: 0.05s; }
        .login-hero-delay-2 { animation-delay: 0.15s; }
        .login-hero-delay-3 { animation-delay: 0.25s; }
        .login-hero-delay-4 { animation-delay: 0.35s; }
        .login-hero-delay-5 { animation-delay: 0.45s; }

        .login-ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 20s linear infinite;
        }

        .login-feature-card {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition:
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .login-feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(236, 72, 153, 0.25);
          box-shadow: 0 20px 48px -16px rgba(236, 72, 153, 0.45);
        }

        .login-google-wrap button {
          border: none !important;
          border-radius: 0.875rem !important;
          background: linear-gradient(135deg, #ec4899 0%, #f97316 100%) !important;
          color: white !important;
          font-weight: 600 !important;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 0 40px -6px rgba(236, 72, 153, 0.75) !important;
          transition:
            transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 0.3s ease !important;
        }

        .login-google-wrap button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.14) inset,
            0 0 48px -6px rgba(236, 72, 153, 0.85) !important;
        }

        .login-google-wrap button svg {
          display: none !important;
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
          padding: 0.5rem 1.125rem !important;
          font-size: 0.875rem !important;
          border-radius: 9999px !important;
        }

        .login-google-wrap--hero > div,
        .login-google-wrap--cta > div {
          max-width: none !important;
        }

        .login-google-wrap--hero button {
          padding: 1rem 2rem !important;
          font-size: 1.0625rem !important;
          min-height: 3.5rem !important;
          border-radius: 0.875rem !important;
        }

        .login-google-wrap--cta button {
          padding: 1.125rem 2.25rem !important;
          font-size: 1.125rem !important;
          min-height: 3.75rem !important;
          border-radius: 0.875rem !important;
        }

        .login-cta-card {
          background:
            linear-gradient(#0d0d1a, #0d0d1a) padding-box,
            linear-gradient(135deg, #ec4899, #f97316) border-box;
          border: 1px solid transparent;
        }
      `}</style>

      {/* Bubble-style background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 80% at 50% 100%, #0a0618 0%, #05050f 45%, #030308 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 20% 30%, rgba(236, 72, 153, 0.1) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 80% 70%, rgba(249, 115, 22, 0.08) 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.55) 100%)",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "-8%",
            left: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.85) 0%, rgba(249, 115, 22, 0.45) 40%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.15,
            animation: "float-tl 28s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-8%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.85) 0%, rgba(249, 115, 22, 0.45) 40%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.15,
            animation: "float-br 32s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "35%",
            right: "-6%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.85) 0%, rgba(249, 115, 22, 0.45) 40%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.15,
            animation: "float-cr 9s ease-in-out infinite",
          }}
        />
      </div>

      <DashboardParticles />

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#EC4899]/10 bg-[#05050f]/40 backdrop-blur-xl">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#EC4899]/35 to-transparent"
        />
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
          <div className="flex items-center gap-3">
            <LogoOrb size={32} />
            <span className="text-[15px] font-bold tracking-[-0.02em] text-white">
              Clotter AI
            </span>
          </div>
          <div className="login-google-wrap login-google-wrap--nav">
            <LoginForm />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-24 sm:px-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          <div className="login-hero-item login-hero-delay-1 login-hero-orb">
            <LogoOrb size={80} />
          </div>

          <span className="login-hero-item login-hero-delay-2 mt-8 inline-flex items-center rounded-full bg-[#EC4899]/10 px-4 py-1.5 text-xs font-semibold tracking-[0.04em] text-[#EC4899]">
            ✦ The AI OS for Creators
          </span>

          <h1 className="login-hero-item login-hero-delay-3 mt-8 text-5xl font-bold leading-[1.08] tracking-[-0.04em] text-white md:text-7xl">
            Create content that goes viral.
          </h1>

          <p className="login-hero-item login-hero-delay-4 mt-6 max-w-xl text-base leading-relaxed tracking-[-0.015em] text-white/45 sm:text-lg">
            Captions, hooks, scripts, trends — powered by AI that actually knows
            you.
          </p>

          {authError && (
            <p className="login-hero-item login-hero-delay-4 mt-6 w-full max-w-md rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-300">
              Authentication failed. Please try again.
            </p>
          )}

          <div className="login-hero-item login-hero-delay-5 mt-10 w-full max-w-xs sm:max-w-sm">
            <div className="login-google-wrap login-google-wrap--hero">
              <LoginForm />
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="relative z-10 overflow-hidden border-y border-white/[0.06] bg-[#0a0a14]/90 py-4">
        <div className="login-ticker-track">
          <span className="whitespace-nowrap px-4 text-sm font-medium tracking-[0.05em] text-transparent bg-gradient-to-r from-[#EC4899] to-[#F97316] bg-clip-text">
            {tickerItems}
          </span>
          <span
            aria-hidden
            className="whitespace-nowrap px-4 text-sm font-medium tracking-[0.05em] text-transparent bg-gradient-to-r from-[#EC4899] to-[#F97316] bg-clip-text"
          >
            {tickerItems}
          </span>
        </div>
      </div>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
            Everything you need to grow
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className="login-feature-card rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <p className="text-lg font-semibold tracking-[-0.02em] text-white">
                  {feature.emoji} {feature.title}
                </p>
                <p className="mt-2.5 text-[15px] leading-relaxed text-white/45">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 border-t border-white/[0.05] px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
            From idea to content in 3 steps
          </h2>

          <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            <div
              aria-hidden
              className="pointer-events-none absolute top-6 hidden h-px w-full bg-gradient-to-r from-transparent via-[#EC4899]/30 to-transparent md:block"
            />
            {steps.map((step) => (
              <div key={step.number} className="relative text-center md:text-left">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#EC4899] to-[#F97316] text-sm font-bold text-white shadow-[0_0_32px_-6px_rgba(236,72,153,0.7)]">
                  {step.number}
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white">
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

      {/* Final CTA */}
      <section className="relative z-10 px-6 py-24 sm:px-10 sm:py-32">
        <div className="login-cta-card mx-auto max-w-3xl rounded-3xl px-8 py-14 text-center backdrop-blur-md sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
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
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-10 sm:px-10">
        <p className="text-center text-sm text-white/35">
          © 2026 Clotter AI — The AI OS for Creators
        </p>
      </footer>
    </div>
  );
}
