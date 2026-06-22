export default function CaptionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative isolate min-h-full">{children}</div>
  );
}
