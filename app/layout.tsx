import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clotter AI — AI Operating System for Creators",
  description:
    "Clotter AI is the world's best AI platform for content creators and influencers. Generate captions, hooks, scripts, content ideas, and grow your audience with AI.",
  keywords:
    "Clotter AI, AI for creators, content creator tools, AI caption generator, hook generator, influencer tools, content ideas AI",
  openGraph: {
    title: "Clotter AI — AI Operating System for Creators",
    description:
      "The AI OS for creators and influencers. Generate captions, hooks, scripts and grow faster.",
    url: "https://clotter.ai",
    siteName: "Clotter AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clotter AI — AI Operating System for Creators",
    description: "The AI OS for creators and influencers.",
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  metadataBase: new URL("https://clotter.ai"),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className={`${jakarta.variable} flex min-h-full flex-col font-sans`}>
        {children}
      </body>
    </html>
  );
}
