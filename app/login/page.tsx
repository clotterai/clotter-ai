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

const platformLogos = [
  {
    name: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    name: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    name: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    name: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    name: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
];

const infraLogos = [
  {
    name: "Google",
    paths: [
      "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
      "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
      "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
      "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
    ],
  },
  {
    name: "Anthropic",
    paths: [
      "M17.304 3.541h-3.671l-6.696 16.918h3.736l1.38-3.719h4.818l1.378 3.719h3.736L17.304 3.541zm-4.694 10.278 1.756-4.733 1.756 4.733h-3.512z",
    ],
  },
  {
    name: "Perplexity",
    paths: [
      "M12.288 1.296c-.282 0-.56.07-.805.203L1.955 6.944a1.708 1.708 0 0 0-.87 1.49v7.132a1.708 1.708 0 0 0 .87 1.49l9.528 5.445a1.708 1.708 0 0 0 1.61 0l9.528-5.445a1.708 1.708 0 0 0 .87-1.49V8.434a1.708 1.708 0 0 0-.87-1.49L13.093 1.499a1.708 1.708 0 0 0-.805-.203zM12 4.666l7.884 4.506L12 13.678 4.116 9.172 12 4.666zm-8.648 6.29L11.12 15.36v8.063l-7.768-4.445V10.956zm9.296 11.518V15.36l7.768-4.403v8.063L12.648 22.764z",
    ],
  },
  {
    name: "Vercel",
    paths: ["M24 22.525H0l12-21.05 12 21.05z"],
  },
  {
    name: "Supabase",
    paths: [
      "M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 10.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-10.261.401-.562a1.04 1.04 0 0 0-.836-1.66z",
    ],
  },
  {
    name: "Next.js",
    paths: [
      "M11.572 0c-.176 0-.31.001-.358.007a.535.535 0 0 0-.192.063.35.35 0 0 0-.13.128.677.677 0 0 0-.093.335v11.495l-9.528 5.484V.62a.677.677 0 0 0-.093-.335A.348.348 0 0 0 1.05.07.537.537 0 0 0 .858.007C.81.001.676 0 .5 0H0v24h11.572V12.674L21.428 18V6.326L11.572 0z",
    ],
  },
  {
    name: "Meta",
    paths: [
      "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.28 0 11.758 0 14.494c0 2.65 1.305 5.005 3.33 6.453C5.357 22.394 8.058 24 11.015 24c1.968 0 3.683-1.28 4.871-3.113C17.296 19.714 18 17.236 18 14.5c0-2.65-1.305-5.005-3.33-6.453C12.643 6.606 9.942 5 7.085 5c-.057 0-.113.002-.17.004v-.004H6.915zm4.1 14.44c-1.456 0-2.75-.78-3.45-2.05-.7-1.27-.7-2.83 0-4.1.7-1.27 1.994-2.05 3.45-2.05s2.75.78 3.45 2.05c.7 1.27.7 2.83 0 4.1-.7 1.27-1.994 2.05-3.45 2.05zm5.985-14.44c-1.968 0-3.683 1.28-4.871 3.113C10.704 9.28 10 11.758 10 14.494c0 2.65 1.305 5.005 3.33 6.453 1.027.947 2.328 1.553 3.685 1.553 1.968 0 3.683-1.28 4.871-3.113C22.296 19.714 23 17.236 23 14.5c0-2.65-1.305-5.005-3.33-6.453C18.643 6.606 15.942 5 13.085 5c-.057 0-.113.002-.17.004v-.004h-.005z",
    ],
  },
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

      {/* Platforms */}
      <section className="relative z-10 px-6 pb-12 sm:px-10">
        <p className="text-center text-sm text-white/50">
          Built for creators on
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
          {platformLogos.map((platform) => (
            <svg
              key={platform.name}
              viewBox="0 0 24 24"
              height={28}
              fill="currentColor"
              role="img"
              aria-label={platform.name}
              className="text-white/40 transition-colors duration-300 hover:text-white/80"
            >
              <path d={platform.path} />
            </svg>
          ))}
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

      {/* Powered by */}
      <section className="relative z-10 px-6 py-16 sm:px-10">
        <p className="text-center text-sm text-white/50">
          Powered by world-class infrastructure
        </p>
        <div className="mt-8 flex flex-wrap items-start justify-center gap-8">
          {infraLogos.map((brand) => (
            <div
              key={brand.name}
              className="group flex w-20 flex-col items-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                width={24}
                height={24}
                fill="currentColor"
                role="img"
                aria-label={brand.name}
                className="text-white/30 transition-colors duration-300 group-hover:text-white/70"
              >
                {brand.paths.map((path) => (
                  <path key={path} d={path} />
                ))}
              </svg>
              <span className="text-xs text-white/30">{brand.name}</span>
            </div>
          ))}
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
