import type { ReactNode } from "react";
import { PremiumBackground } from "./premium-background";

type FeaturePageShellProps = {
  label: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  wide?: boolean;
};

export function FeaturePageShell({
  label,
  title,
  subtitle,
  children,
  headerExtra,
  wide = false,
}: FeaturePageShellProps) {
  return (
    <div className="premium-feature-page relative flex min-h-screen flex-col overflow-hidden bg-[#09090B]">
      <PremiumBackground variant="feature" />

      <div
        className={`relative z-10 mx-auto flex w-full flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 ${
          wide ? "max-w-[1400px]" : "max-w-2xl"
        }`}
      >
        <header className="premium-feature-header shrink-0">
          <p className="premium-feature-label">{label}</p>
          <div aria-hidden className="premium-feature-title-underline" />
          <h1 className="premium-feature-title">{title}</h1>
          <p className="premium-feature-subtitle">{subtitle}</p>
          {headerExtra}
        </header>

        <div className="mt-8 flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
