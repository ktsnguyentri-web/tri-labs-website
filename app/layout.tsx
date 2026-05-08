import type { Metadata } from "next";
import { Inter, Titan_One } from "next/font/google";
import "@/styles/globals.css";
import { IntroAnimationProvider } from "@/lib/intro-animation-context";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const titanOne = Titan_One({
  weight: "400",
  variable: "--font-titan",
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
      className={`${inter.variable} ${titanOne.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-accent selection:text-black">
        <IntroAnimationProvider>
          <main className="flex-grow pb-20">
            {children}
          </main>
        </IntroAnimationProvider>
      </body>
    </html>
  );
}
