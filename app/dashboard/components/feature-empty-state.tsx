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
    <section className="flex flex-col items-center py-12 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{
          background: "linear-gradient(135deg, #EC4899, #F97316)",
        }}
      >
        {icon}
      </div>
      <h2 className="mt-4 text-sm font-semibold text-white">{title}</h2>
      <p className="mt-1 max-w-sm text-xs text-white/30">{description}</p>
    </section>
  );
}
