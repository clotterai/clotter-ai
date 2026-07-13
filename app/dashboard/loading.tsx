export default function DashboardLoading() {
  return (
    <div className="dash-shell relative flex min-h-full overflow-hidden bg-[#0D0D1A] font-sans text-white">
      <div aria-hidden className="dash-top-bar" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[17.5rem] flex-col border-r border-white/[0.06] bg-[#0D0D1A]/95 md:flex">
        <div className="px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="h-4 w-24 animate-pulse rounded bg-white/[0.06]" />
          </div>
        </div>
        <div className="flex-1 space-y-6 px-4 py-4">
          <div className="h-9 animate-pulse rounded-xl bg-white/[0.04]" />
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-8 animate-pulse rounded-lg bg-white/[0.03]"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
        <div className="border-t border-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/[0.06]" />
            <div className="space-y-1.5">
              <div className="h-3 w-20 animate-pulse rounded bg-white/[0.06]" />
              <div className="h-2.5 w-28 animate-pulse rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </aside>

      <div className="relative z-[1] flex min-h-full w-full min-w-0 flex-1 flex-col pt-14 md:pl-[17.5rem] md:pt-0">
        <div className="relative min-h-screen overflow-x-hidden bg-[#09090B]">
          <div className="mx-auto max-w-3xl space-y-12 px-6 py-10">
            <section className="space-y-6 pt-4">
              <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
              <div className="space-y-3">
                <div className="h-10 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
                <div className="h-10 w-48 animate-pulse rounded-lg bg-white/[0.06]" />
              </div>
              <div className="h-14 animate-pulse rounded-2xl border border-white/[0.06] bg-[#111114]" />
            </section>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  className="h-[108px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#111114]"
                />
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[52px] animate-pulse rounded-xl border border-white/[0.06] bg-[#111114]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
