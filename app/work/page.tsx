import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { WorkGallery } from "@/components/gallery/WorkGallery";
import { getProjects } from "@/lib/cms";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "01 / WORK | Archive — 10 Selected Projects",
  description: "Selected architectural designs, computational prototypes, and spatial investigations from 2019 to 2026.",
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <Navbar />
      <main className="w-full pt-[60px]">
        {/* Two-Column Architectural Header */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 pt-8 sm:pt-12 pb-4 sm:pb-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8">
            {/* Left Column */}
            <div>
              <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-tight text-neutral-900 dark:text-neutral-100">
                01 / WORK
              </h1>
              <div className="font-mono text-xs text-neutral-500 tracking-wider mt-2">
                [ ARCHIVE — 10 SELECTED PROJECTS ]
              </div>
            </div>

            {/* Right Column */}
            <div>
              <p className="font-sans text-sm text-neutral-400 max-w-md leading-relaxed">
                Selected architectural designs, computational prototypes, and spatial investigations from 2019 to 2026. Individual roles and office credits are cataloged per entry.
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="pt-20 px-10 font-mono text-[10px] text-neutral-400 dark:text-white/40 uppercase tracking-widest">Loading visual chronicles...</div>}>
          <WorkGallery works={projects} />
        </Suspense>
        <Contact />
      </main>
    </div>
  );
}
