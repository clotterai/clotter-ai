import { PremiumBackground } from "../components/premium-background";
import { MemoryDashboard } from "./memory-dashboard";

export default function MemoryPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0D0D1A]">
      <PremiumBackground />
      <div aria-hidden className="captions-top-shimmer" />

      <header className="captions-fade-in relative z-10 shrink-0 px-6 pb-2 pt-10 sm:px-10 sm:pt-14">
        <span className="captions-glow-badge">AI Memory</span>
        <h1 className="font-heading mt-6 max-w-3xl text-[2.5rem] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.25rem]">
          Your Creator{" "}
          <span className="bg-gradient-to-r from-[#FB7185] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
            Brain
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed tracking-[-0.016em] text-white/45">
          The more Clotter knows you, the better it gets.
        </p>
      </header>

      <MemoryDashboard />
    </div>
  );
}
