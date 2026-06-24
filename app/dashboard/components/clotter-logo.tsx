type ClotterLogoProps = {
  size?: 32 | 64;
  className?: string;
};

export function ClotterLogo({ size = 32, className = "" }: ClotterLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/Logo.png"
      alt="Clotter AI"
      width={size}
      height={size}
      className={`clotter-logo shrink-0 object-contain ${className}`.trim()}
    />
  );
}
