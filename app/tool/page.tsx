import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { getAllResearchInsights } from "@/lib/cms";
import { ToolGallery } from "@/components/sections/ToolGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "02 / LABS | Archive — Prototypes & Tools",
  description: "Internal computational tools, algorithmic prototypes, and spatial investigations developed by Tri Labs.",
};

export default async function ToolPage() {
  const articles = await getAllResearchInsights();

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <Navbar />
      <main className="w-full pt-[60px]">
        {/* Two-Column Architectural Header (Matching 01 / WORK exactly) */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 pt-8 sm:pt-12 pb-4 sm:pb-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8">
            {/* Left Column */}
            <div>
              <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-tight text-neutral-900 dark:text-neutral-100">
                02 / LABS
              </h1>
              <div className="font-mono text-xs text-neutral-500 tracking-wider mt-2">
                [ ARCHIVE — {String(articles.length).padStart(2, "0")} PROTOTYPES &amp; TOOLS ]
              </div>
            </div>

            {/* Right Column */}
            <div>
              <p className="font-sans text-sm text-neutral-400 max-w-md leading-relaxed">
                Internal computational tools, algorithmic prototypes, and technical investigations developed by Tri Labs. Individual prototypes cataloged per entry.
              </p>
            </div>
          </div>
        </div>

        <ToolGallery toolArticles={articles} />
        <Contact />
      </main>
    </div>
  );
}
