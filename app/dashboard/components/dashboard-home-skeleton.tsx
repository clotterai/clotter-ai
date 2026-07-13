export function DashboardHomeSkeleton() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#09090B]">
      <div className="relative z-10 mx-auto max-w-3xl space-y-12 px-6 py-10">
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/10" />
            <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />
          </div>
          <div className="space-y-3">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="h-10 w-48 animate-pulse rounded-lg bg-white/[0.06]" />
            <div className="h-4 w-40 animate-pulse rounded bg-white/[0.04]" />
          </div>
          <div className="h-14 animate-pulse rounded-2xl border border-white/[0.06] bg-[#111114]" />
        </section>

        <section>
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="h-[108px] animate-pulse rounded-2xl border border-white/[0.06] bg-[#111114]"
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-6 w-52 animate-pulse rounded bg-white/[0.06]" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[52px] animate-pulse rounded-xl border border-white/[0.06] bg-[#111114]"
              />
            ))}
          </div>
        </section>

        <section className="pb-8">
          <div className="mb-4 space-y-2">
            <div className="h-3 w-24 animate-pulse rounded bg-white/[0.04]" />
            <div className="h-6 w-40 animate-pulse rounded bg-white/[0.06]" />
          </div>
          <div className="h-48 animate-pulse rounded-2xl border border-white/[0.06] bg-[#111114]" />
        </section>
      </div>
    </div>
  );
}
