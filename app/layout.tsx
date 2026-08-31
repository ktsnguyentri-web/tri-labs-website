import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { IntroAnimationProvider } from "@/lib/intro-animation-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tri Nguyen Minh — Architect & Design Technologist",
  description: "Personal architecture portfolio and computational design experiments of Tri Nguyen Minh.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents unintended zooming/wobbling on some devices
};

import { ChatWidget } from "@/components/layout/ChatWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-accent selection:text-black">
        <IntroAnimationProvider>
          <main className="flex-grow">
            {children}
          </main>
          <ChatWidget />
        </IntroAnimationProvider>
      </body>
    </html>
  );
}
