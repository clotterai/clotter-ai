type BubbleIconSize = 28 | 64 | 96;

const sizeMap: Record<BubbleIconSize, number> = {
  28: 28,
  64: 64,
  96: 96,
};

export function BubbleIcon({ size = 28 }: { size?: BubbleIconSize }) {
  const px = sizeMap[size];
  const gradientId = `bubble-gradient-${size}`;

  return (
    <svg
      viewBox="0 0 64 64"
      width={px}
      height={px}
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="8" x2="56" y2="56">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="24" fill={`url(#${gradientId})`} opacity="0.95" />
      <circle cx="32" cy="32" r="24" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="5" fill="rgba(255,255,255,0.35)" />
      <circle cx="40" cy="38" r="3" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}
