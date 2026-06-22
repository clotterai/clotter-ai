import { PremiumBackground } from "../components/premium-background";
import { ContentIdeasGenerator } from "./content-ideas-generator";

export default function ContentIdeasPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0D0D1A]">
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
        <div
          style={{
            position: "absolute",
            top: "38%",
            right: "-6%",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(88, 28, 135, 0.3) 55%, transparent 72%)",
            filter: "blur(100px)",
            opacity: 0.2,
            animation: "captions-orb-drift-3 24s ease-in-out infinite",
          }}
        />
      </div>

      <div aria-hidden className="captions-top-shimmer" />

      <header className="captions-fade-in relative z-10 shrink-0 px-6 pb-2 pt-10 sm:px-10 sm:pt-14">
        <span className="captions-glow-badge">Content Ideas</span>
        <h1 className="mt-6 max-w-3xl text-[2.5rem] font-bold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[3.25rem]">
          Never run out of{" "}
          <span className="bg-gradient-to-r from-[#C084FC] via-[#A855F7] to-[#7C3AED] bg-clip-text text-transparent">
            content.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed tracking-[-0.016em] text-white/45">
          Enter your niche, pick a platform, and get twenty viral content ideas
          tailored to your audience.
        </p>
      </header>

      <ContentIdeasGenerator />
    </div>
  );
}
