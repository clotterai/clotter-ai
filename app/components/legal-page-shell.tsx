import { ClotterLogo } from "@/app/dashboard/components/clotter-logo";
import type { ReactNode } from "react";

type LegalPageShellProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="min-h-screen bg-[#0D0D1A] text-white">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:px-10 sm:py-20">
        <header className="flex items-center gap-3 border-b border-white/10 pb-8">
          <ClotterLogo size={32} />
          <span className="text-lg font-bold tracking-[-0.02em] text-white">
            Clotter AI
          </span>
        </header>

        <main className="py-10">
          <h1 className="bg-gradient-to-r from-[#EC4899] to-[#F97316] bg-clip-text text-3xl font-bold tracking-[-0.03em] text-transparent sm:text-4xl">
            {title}
          </h1>
          <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-white/85 sm:text-base sm:leading-relaxed">
            {children}
          </div>
        </main>

        <footer className="border-t border-white/10 pt-8">
          <a
            href="https://clotter.ai"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors duration-200 hover:text-white"
          >
            <span className="bg-gradient-to-r from-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
              ← Back to home
            </span>
          </a>
        </footer>
      </div>
    </div>
  );
}
