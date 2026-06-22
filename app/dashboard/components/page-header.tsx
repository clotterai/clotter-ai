type PageHeaderProps = {
  label: string;
  title: string;
  badge?: string;
  live?: boolean;
  action?: React.ReactNode;
};

export function PageHeader({
  label,
  title,
  badge,
  live = false,
  action,
}: PageHeaderProps) {
  return (
    <header className="relative shrink-0 border-b border-white/[0.06] bg-[#030303]/75 px-8 py-6 backdrop-blur-2xl sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/30 to-transparent"
      />
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="dash-label">{label}</p>
          <h1 className="dash-title-page mt-2 sm:text-[2rem]">{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {badge && (
            <div className="dash-badge hidden sm:inline-flex">
              {live && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F59E0B] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F59E0B]" />
                </span>
              )}
              {badge}
            </div>
          )}
          {action}
        </div>
      </div>
    </header>
  );
}
