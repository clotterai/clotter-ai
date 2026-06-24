type ClotterLogoProps = {
  size?: 32 | 64;
  className?: string;
};

export function ClotterLogo({ size = 32, className = "" }: ClotterLogoProps) {
  const radius = size === 64 ? "rounded-xl" : "rounded-lg";

  return (
    <span
      className={`clotter-logo-wrap inline-flex shrink-0 items-center justify-center overflow-hidden bg-white ${radius} ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="Clotter AI"
        width={size}
        height={size}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
