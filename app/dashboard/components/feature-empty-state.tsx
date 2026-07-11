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
      <div className="premium-empty-state-icon">{icon}</div>
      <h2 className="mt-5 text-base font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-xs leading-relaxed text-white/30">
        {description}
      </p>
      <p className="premium-empty-state-cta">
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M8 3v10M8 3l-3 3M8 3l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Fill in the details above
      </p>
    </section>
  );
}
