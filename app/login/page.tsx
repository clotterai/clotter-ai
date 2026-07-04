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

function InstagramLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
      <defs>
        <linearGradient
          id="login-ig-grad"
          x1="0"
          y1="48"
          x2="48"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#833AB4" />
          <stop offset="0.5" stopColor="#E1306C" />
          <stop offset="1" stopColor="#F56040" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="24" fill="url(#login-ig-grad)" />
      <rect
        x="13"
        y="13"
        width="22"
        height="22"
        rx="6"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
      <circle cx="24" cy="24" r="5.5" fill="none" stroke="white" strokeWidth="2" />
      <circle cx="32" cy="16" r="1.75" fill="white" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
      <rect x="4" y="11" width="40" height="26" rx="7" fill="#FF0000" />
      <path d="M20 18.5v11l11-5.5-11-5.5z" fill="white" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
      <rect x="4" y="4" width="40" height="40" rx="5" fill="#0A66C2" />
      <path
        fill="white"
        d="M14.5 20.2h4.2v15.1h-4.2V20.2zm2.1-6.8a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zm6.4 6.8h4v2.1h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.7v8.5h-4.2v-7.5c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4v7.6h-4.2V20.2z"
      />
    </svg>
  );
}

function XLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#000000" />
      <g transform="translate(12 12)">
        <path
          fill="white"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </g>
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="24" r="24" fill="#1877F2" />
      <path
        fill="white"
        d="M27.8 24.5h-2.6v11.5h-4.7V24.5h-1.8v-3.8h1.8v-2.5c0-2.9 1.7-4.5 4.4-4.5 1.2 0 2.5.2 2.5.2v2.8h-1.4c-1.4 0-1.8.9-1.8 1.8v2.2h3.1l-.5 3.8z"
      />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function AnthropicLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="20" fill="#1A1A1A" />
      <path
        fill="white"
        d="M22.8 9.5h-3.1L12.5 30.5h3.1l1.2-3.1h4.1l1.2 3.1h3.1L22.8 9.5zm-4 12.2 1.5-4 1.5 4h-3z"
      />
    </svg>
  );
}

function PerplexityLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="20" fill="#1B3139" />
      <path
        fill="#20B8CD"
        d="M20.5 8.5 10.5 14.2v11.6l10 5.7 10-5.7V14.2l-10-5.7zm0 3.9 6.6 3.8L20 19.9l-6.6-3.8 6.6-3.7zm-7.2 6.3 6.6 3.8v7.6l-6.6-3.8v-7.6zm14.4 0v7.6l-6.6 3.8v-7.6l6.6-3.8z"
      />
    </svg>
  );
}

function VercelLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="white" />
      <path d="M20 9 33 31H7L20 9z" fill="#000000" />
    </svg>
  );
}

function SupabaseLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <path
        fill="#3ECF8E"
        d="M35.6 15.6H20V1.3a.66.66 0 0 0-1.2-.39L3.7 17.4l-.67.94a1.73 1.73 0 0 0 1.39 2.76H20v14.9a.66.66 0 0 0 1.2.39l15.1-17.1.67-.94a1.73 1.73 0 0 0-1.39-2.76z"
      />
    </svg>
  );
}

function NextJsLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="20" fill="#000000" />
      <path
        fill="white"
        d="M13.5 12.5h3.2l8.1 12.4V12.5h2.8v15h-3.2l-8.1-12.4V27.5h-2.8v-15z"
      />
    </svg>
  );
}

function MetaLogo() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="login-meta-grad" x1="0" y1="12" x2="24" y2="12">
          <stop stopColor="#0082FB" />
          <stop offset="1" stopColor="#0064E0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#login-meta-grad)"
        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.28 0 11.758 0 14.494c0 2.65 1.305 5.005 3.33 6.453C5.357 22.394 8.058 24 11.015 24c1.968 0 3.683-1.28 4.871-3.113C17.296 19.714 18 17.236 18 14.5c0-2.65-1.305-5.005-3.33-6.453C12.643 6.606 9.942 5 7.085 5c-.057 0-.113.002-.17.004v-.004H6.915zm4.1 14.44c-1.456 0-2.75-.78-3.45-2.05-.7-1.27-.7-2.83 0-4.1.7-1.27 1.994-2.05 3.45-2.05s2.75.78 3.45 2.05c.7 1.27.7 2.83 0 4.1-.7 1.27-1.994 2.05-3.45 2.05zm5.985-14.44c-1.968 0-3.683 1.28-4.871 3.113C10.704 9.28 10 11.758 10 14.494c0 2.65 1.305 5.005 3.33 6.453 1.027.947 2.328 1.553 3.685 1.553 1.968 0 3.683-1.28 4.871-3.113C22.296 19.714 23 17.236 23 14.5c0-2.65-1.305-5.005-3.33-6.453C18.643 6.606 15.942 5 13.085 5c-.057 0-.113.002-.17.004v-.004h-.005z"
      />
    </svg>
  );
}

const platformLogoItems = [
  { name: "Instagram", Logo: InstagramLogo },
  { name: "YouTube", Logo: YouTubeLogo },
  { name: "LinkedIn", Logo: LinkedInLogo },
  { name: "X", Logo: XLogo },
  { name: "Facebook", Logo: FacebookLogo },
];

const infraLogoItems = [
  { name: "Google", Logo: GoogleLogo },
  { name: "Anthropic", Logo: AnthropicLogo },
  { name: "Perplexity", Logo: PerplexityLogo },
  { name: "Vercel", Logo: VercelLogo },
  { name: "Supabase", Logo: SupabaseLogo },
  { name: "Next.js", Logo: NextJsLogo },
  { name: "Meta", Logo: MetaLogo },
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

        @keyframes loginLogoSectionIn {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-logo-section {
          animation: loginLogoSectionIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .login-logo-section--platforms {
          animation-delay: 0.55s;
        }

        .login-logo-section--infra {
          animation-delay: 0.2s;
        }

        .login-logo-item {
          animation: loginLogoSectionIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          transition: transform 200ms ease;
        }

        .login-logo-item:hover {
          transform: scale(1.1);
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
      <section className="login-logo-section login-logo-section--platforms relative z-10 px-6 pb-12 sm:px-10">
        <p className="text-center text-sm text-white/50">
          Built for creators on
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          {platformLogoItems.map((platform, index) => (
            <div
              key={platform.name}
              className="login-logo-item"
              style={{ animationDelay: `${0.65 + index * 0.1}s` }}
              role="img"
              aria-label={platform.name}
            >
              <platform.Logo />
            </div>
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
      <section className="login-logo-section login-logo-section--infra relative z-10 px-6 py-16 sm:px-10">
        <p className="text-center text-sm text-white/50">
          Powered by world-class infrastructure
        </p>
        <div className="mt-10 flex flex-wrap items-start justify-center gap-8">
          {infraLogoItems.map((brand, index) => (
            <div
              key={brand.name}
              className="login-logo-item flex w-24 flex-col items-center gap-2.5"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <brand.Logo />
              <span className="text-xs text-white/60">{brand.name}</span>
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
