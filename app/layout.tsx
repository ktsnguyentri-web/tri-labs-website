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
      <body className="min-h-full flex flex-col font-sans selection:bg-accent selection:text-black">
        <IntroAnimationProvider>
          <main className="flex-grow pt-[80px] px-10 pb-20">
            <div className="max-w-[1440px] mx-auto w-full">
              {children}
            </div>
          </main>
        </IntroAnimationProvider>
      </body>
    </html>
  );
}
