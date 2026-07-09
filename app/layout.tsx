import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
