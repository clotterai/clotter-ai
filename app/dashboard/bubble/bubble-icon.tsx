import { ClotterLogo } from "@/app/dashboard/components/clotter-logo";

type BubbleIconSize = 28 | 64;

export function BubbleIcon({ size = 28 }: { size?: BubbleIconSize }) {
  return <ClotterLogo size={size} />;
}
