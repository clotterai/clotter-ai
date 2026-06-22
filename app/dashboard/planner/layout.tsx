export default function PlannerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="relative isolate min-h-full">{children}</div>;
}
