import { PremiumBackground } from "../components/premium-background";
import { ScriptGenerator } from "./script-generator";

export default function ScriptPage() {
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
              "radial-gradient(circle, rgba(236, 72, 153, 0.85) 0%, rgba(249, 115, 22, 0.35) 50%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.22,
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
              "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(249, 115, 22, 0.3) 50%, transparent 70%)",
            filter: "blur(100px)",
            opacity: 0.2,
            animation: "captions-orb-drift-2 36s ease-in-out infinite",
          }}
        />
      </div>

      <div aria-hidden className="captions-top-shimmer" />

      <header className="captions-fade-in relative z-10 shrink-0 px-6 pb-2 pt-10 sm:px-10 sm:pt-14">
        <span className="script-glow-badge">Script Generator</span>
        <h1 className="font-heading mt-6 max-w-3xl text-[2.5rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.25rem]">
          Write scripts that{" "}
          <span className="bg-gradient-to-r from-[#FB7185] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
            go viral.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed tracking-[-0.016em] text-white/45">
          Professional, retention-optimized video scripts with hooks, timestamps,
          and CTAs — tailored to your platform and tone.
        </p>
      </header>

      <ScriptGenerator />
    </div>
  );
}
