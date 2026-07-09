import { PremiumBackground } from "../components/premium-background";
import { CaptionGenerator } from "./caption-generator";

export default function CaptionsPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0D0D1A]">
      <PremiumBackground />

      {/* Caption-specific orbs — blur 100px, opacity 0.2 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="captions-orb captions-orb-1"
          style={{
            position: "absolute",
            top: "-12%",
            left: "-10%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(249, 115, 22, 0.4) 50%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.2,
            animation: "captions-orb-drift-1 30s ease-in-out infinite",
          }}
        />
        <div
          className="captions-orb captions-orb-2"
          style={{
            position: "absolute",
            bottom: "-14%",
            right: "-8%",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(251, 113, 133, 0.85) 0%, rgba(249, 115, 22, 0.35) 50%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.2,
            animation: "captions-orb-drift-2 36s ease-in-out infinite",
          }}
        />
        <div
          className="captions-orb captions-orb-3"
          style={{
            position: "absolute",
            top: "38%",
            right: "-6%",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(194, 65, 12, 0.3) 55%, transparent 72%)",
            filter: "blur(100px)",
            opacity: 0.2,
            animation: "captions-orb-drift-3 24s ease-in-out infinite",
          }}
        />
      </div>

      {/* Top shimmer line */}
      <div aria-hidden className="captions-top-shimmer" />

      <header className="captions-fade-in relative z-10 shrink-0 px-6 pb-2 pt-10 sm:px-10 sm:pt-14">
        <span className="captions-glow-badge">Caption Generator</span>
        <h1 className="font-heading mt-6 max-w-3xl text-[2.5rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.25rem]">
          Write captions that stop the{" "}
          <span className="bg-gradient-to-r from-[#FB7185] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
            scroll.
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed tracking-[-0.016em] text-white/45">
          Describe your post, choose a tone, and get five scroll-stopping captions
          crafted for your audience.
        </p>
      </header>

      <CaptionGenerator />
    </div>
  );
}
