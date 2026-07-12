import type { CSSProperties, ReactNode } from "react";

const gradientTextStyle: CSSProperties = {
  background: "linear-gradient(135deg, #EC4899, #F97316)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

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
    <div className="min-h-screen bg-[#09090B]">
      <div className="px-6 py-8 md:px-10">
        <header>
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={gradientTextStyle}
          >
            {label}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-white/35">{subtitle}</p>
          {headerExtra}
        </header>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
