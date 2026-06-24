export default function OnboardingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0D0D1A]">
      {children}
    </div>
  );
}
