import { PremiumBackground } from "../components/premium-background";
import { OnboardingFlow } from "./onboarding-flow";

export default function OnboardingPage() {
  return (
    <div className="relative min-h-screen bg-[#0D0D1A]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <PremiumBackground variant="feature" />
      </div>
      <div className="relative z-10 min-h-screen">
        <OnboardingFlow />
      </div>
    </div>
  );
}
