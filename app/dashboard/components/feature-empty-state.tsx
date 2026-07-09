import type { ReactNode } from "react";

type FeatureEmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
};

export function FeatureEmptyState({
  icon,
  title,
  description,
  cta,
}: FeatureEmptyStateProps) {
  return (
    <section className="feature-empty-state relative mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center backdrop-blur-md sm:px-10 sm:py-14">
      <div aria-hidden className="feature-empty-state-bg pointer-events-none absolute inset-0" />
      <div className="relative z-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#F97316] text-white shadow-[0_0_40px_-8px_rgba(236,72,153,0.65)] ring-1 ring-white/15">
          {icon}
        </div>
        <h2 className="font-heading mt-6 text-lg font-bold tracking-[-0.02em] text-white sm:text-xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/45 sm:text-[15px]">
          {description}
        </p>
        <p className="mt-5 text-sm font-medium text-[#FB923C]">{cta}</p>
      </div>
    </section>
  );
}
