import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { IntroAnimationProvider } from "@/lib/intro-animation-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tri Labs",
  description: "Tri Labs Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <IntroAnimationProvider>
          {children}
        </IntroAnimationProvider>
      </body>
    </html>
  );
}
