import type { ReactNode } from "react";
import { PremiumBackground } from "./premium-background";

type FeaturePageShellProps = {
  label: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  headerExtra?: ReactNode;
};

export function FeaturePageShell({
  label,
  title,
  subtitle,
  children,
  headerExtra,
}: FeaturePageShellProps) {
  return (
    <div className="premium-feature-page relative flex min-h-screen flex-col overflow-hidden bg-[#0D0D1A]">
      <PremiumBackground variant="feature" />

      <header className="premium-feature-header relative z-10 shrink-0 px-6 pb-4 pt-10 sm:px-10 sm:pt-14">
        <p className="premium-feature-label">{label}</p>
        <h1 className="premium-feature-title">{title}</h1>
        <div aria-hidden className="premium-feature-title-underline" />
        <p className="premium-feature-subtitle">{subtitle}</p>
        {headerExtra}
      </header>

      {children}
    </div>
  );
}
