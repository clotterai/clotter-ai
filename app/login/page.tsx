import { PremiumBackground } from "@/app/dashboard/components/premium-background";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const authError = params.error === "auth";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0D0D1A] px-6 py-12">
      <PremiumBackground />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-12%",
            left: "-10%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168, 85, 247, 0.9) 0%, rgba(124, 58, 237, 0.4) 50%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.2,
            animation: "captions-orb-drift-1 30s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-14%",
            right: "-8%",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(192, 132, 252, 0.85) 0%, rgba(124, 58, 237, 0.35) 50%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.2,
            animation: "captions-orb-drift-2 36s ease-in-out infinite",
          }}
        />
      </div>

      <div aria-hidden className="captions-top-shimmer" />

      <div className="captions-fade-in relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="chat-logo-glow relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] ring-1 ring-white/15">
          <span className="text-2xl font-bold text-white">C</span>
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-[-0.04em] text-white">
          Clotter AI
        </h1>
        <p className="mt-3 text-base tracking-[-0.02em] text-white/45">
          The AI OS for creators
        </p>

        <p className="mt-8 text-sm leading-relaxed text-white/35">
          Sign in to access your creative workspace — chat, captions, hooks, and
          more.
        </p>

        {authError && (
          <p className="mt-6 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Authentication failed. Please try again.
          </p>
        )}

        <div className="mt-8 w-full">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
