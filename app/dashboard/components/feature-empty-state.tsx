import type { ReactNode } from "react";

type FeatureEmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function FeatureEmptyState({
  icon,
  title,
  description,
}: FeatureEmptyStateProps) {
  return (
    <section className="premium-empty-state">
      <div aria-hidden className="premium-empty-state-bg" />
      <div className="relative z-10">
        <div className="premium-empty-state-icon">{icon}</div>
        <h2 className="font-heading mt-6 text-lg font-bold tracking-[-0.02em] text-white sm:text-xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/40 sm:text-[15px]">
          {description}
        </p>
        <p className="premium-empty-state-cta">
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden>
            <path
              d="M8 3v10M8 3l-3 3M8 3l3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Fill in the details above to get started
        </p>
      </div>
    </section>
  );
}
