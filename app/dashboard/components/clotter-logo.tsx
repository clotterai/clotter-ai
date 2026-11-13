import Image from "next/image";

type ClotterLogoProps = {
  size?: number;
  className?: string;
};

export function ClotterLogo({ size = 32, className = "" }: ClotterLogoProps) {
  return (
    <Image
      src="/logo.jpg"
      alt="Clotter AI"
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover ${className}`.trim()}
      style={{ width: size, height: size }}
      priority={size >= 32}
    />
  );
}
