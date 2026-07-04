import { DashboardParticles } from "@/app/dashboard/components/particles";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

const features = [
  {
    title: "AI Chat",
    description:
      "Your creative co-pilot for ideas, strategy, and content",
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
    title: "Creator Memory",
    description:
      "Clotter learns your niche and style. Gets smarter every day.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
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
  {
    title: "Trend Analyzer",
    description: "Real-time trends powered by live web data",
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

const stats = [
  { value: "10+ AI Tools", label: "Built for creators" },
  { value: "Real-time Trends", label: "Live web intelligence" },
  { value: "AI Memory", label: "Learns your style" },
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
          50% { transform: translate(40px, 30px) scale(1.05); }
        }

        @keyframes login-orb-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-35px, -25px) scale(1.08); }
        }

        @keyframes login-orb-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -20px) scale(1.04); }
        }

        @keyframes login-hero-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes login-fade-up {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-hero-in {
          animation: login-hero-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .login-hero-in-delay-1 { animation-delay: 0.12s; }
        .login-hero-in-delay-2 { animation-delay: 0.24s; }
        .login-hero-in-delay-3 { animation-delay: 0.36s; }

        .login-reveal {
          opacity: 0;
          transform: translateY(32px);
          animation: login-fade-up 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-timeline: view();
          animation-range: entry 0% cover 28%;
        }

        .login-reveal-delay-1 { animation-delay: 0.1s; }
        .login-reveal-delay-2 { animation-delay: 0.2s; }
        .login-reveal-delay-3 { animation-delay: 0.3s; }

        @supports not (animation-timeline: view()) {
          .login-reveal {
            opacity: 1;
            transform: none;
            animation: login-fade-up 0.85s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
        }

        .login-logo-pulse {
          animation: clotter-logo-pulse 3s ease-in-out infinite;
        }

        .login-google-wrap button {
          border: none !important;
          border-radius: 0.875rem !important;
          background: linear-gradient(135deg, #ec4899 0%, #f97316 100%) !important;
          color: white !important;
          font-weight: 600 !important;
          padding-top: 0.9375rem !important;
          padding-bottom: 0.9375rem !important;
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

        .login-feature-card {
          transition:
            transform 0.35s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.35s ease,
            box-shadow 0.35s ease;
        }

        .login-feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(236, 72, 153, 0.28);
          box-shadow: 0 20px 48px -20px rgba(236, 72, 153, 0.45);
        }
      `}</style>

      {/* Background orbs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute"
          style={{
            top: "-10%",
            left: "-8%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.5) 0%, rgba(249, 115, 22, 0.25) 45%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.35,
            animation: "login-orb-drift-1 28s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-12%",
            right: "-6%",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.45) 0%, rgba(236, 72, 153, 0.2) 50%, transparent 72%)",
            filter: "blur(80px)",
            opacity: 0.3,
            animation: "login-orb-drift-2 32s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            top: "42%",
            right: "10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.35) 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.25,
            animation: "login-orb-drift-3 24s ease-in-out infinite",
          }}
        />
      </div>

      <DashboardParticles />

      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#EC4899]/40 to-transparent"
      />

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-16 sm:px-10">
        <div className="login-hero-in flex w-full max-w-3xl flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Clotter AI"
            width={80}
            height={80}
            className="login-logo-pulse h-20 w-20"
          />

          <h1 className="login-hero-in login-hero-in-delay-1 font-heading mt-8 text-[2.5rem] font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem]">
            The AI OS for Creators
          </h1>

          <p className="login-hero-in login-hero-in-delay-2 mt-5 max-w-xl text-[1.0625rem] leading-relaxed tracking-[-0.016em] text-white/50 sm:text-lg">
            Generate captions, hooks, scripts, trends — all powered by AI that
            knows you.
          </p>

          {authError && (
            <p className="login-hero-in login-hero-in-delay-2 mt-6 w-full max-w-md rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm text-red-300">
              Authentication failed. Please try again.
            </p>
          )}

          <div className="login-hero-in login-hero-in-delay-3 login-google-wrap mt-10 w-full max-w-sm">
            <LoginForm />
          </div>
        </div>

        <a
          href="#features"
          className="login-hero-in login-hero-in-delay-3 mt-16 flex flex-col items-center gap-2 text-xs font-medium tracking-[0.08em] text-white/30 transition-colors hover:text-white/55"
        >
          <span>Explore features</span>
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 px-6 py-24 sm:px-10 sm:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="login-reveal mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EC4899]/70">
              Everything you need
            </p>
            <h2 className="font-heading mt-4 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
              One platform. Infinite content.
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {features.map((feature, index) => (
              <article
                key={feature.title}
                className={`login-reveal login-reveal-delay-${index + 1} login-feature-card rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-md sm:p-8`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899] to-[#F97316] text-white shadow-[0_0_32px_-6px_rgba(236,72,153,0.6)]">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-[-0.02em] text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-white/45">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="relative z-10 border-y border-white/[0.06] bg-white/[0.02] px-6 py-24 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="login-reveal text-center font-heading text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            Built for creators who move fast
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.value}
                className={`login-reveal login-reveal-delay-${index + 1} rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center backdrop-blur-md`}
              >
                <p className="bg-gradient-to-r from-[#EC4899] to-[#F97316] bg-clip-text text-xl font-bold tracking-[-0.02em] text-transparent sm:text-2xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section className="relative z-10 px-6 py-28 sm:px-10 sm:py-36">
        <div className="login-reveal mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-heading text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            Ready to grow faster?
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/40">
            Join creators using Clotter AI to ship content at the speed of
            ideas.
          </p>
          <div className="login-google-wrap mt-10 w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </section>
    </div>
  );
}
