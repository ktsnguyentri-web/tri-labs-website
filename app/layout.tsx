import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { PreloaderProvider } from "@/lib/preloader-context";
import { Preloader } from "@/components/preloader/Preloader";
import { MainContentWrapper } from "@/components/preloader/MainContentWrapper";

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
  adjustFontFallback: false,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
                var hasLoaded = sessionStorage.getItem('hasLoadedBefore');
                var isPreloadForced = window.location.search.indexOf('preload=true') !== -1;
                if (hasLoaded === 'true' && !isPreloadForced) {
                  document.documentElement.classList.add('preloader-done');
                  document.documentElement.classList.remove('preloader-active');
                } else {
                  document.documentElement.classList.add('preloader-active');
                  document.documentElement.classList.remove('preloader-done');
                }
              } catch (e) {}
            })()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-accent selection:text-black bg-[#FAFAFA] dark:bg-[#151515] text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <PreloaderProvider>
          <Preloader />
          <MainContentWrapper>
            {children}
          </MainContentWrapper>
        </PreloaderProvider>
      </body>
    </html>
  );
}
