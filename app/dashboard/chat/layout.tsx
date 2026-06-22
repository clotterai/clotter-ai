export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="chat-page-shell relative min-h-full">{children}</div>;
}
