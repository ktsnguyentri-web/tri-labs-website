"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/cms";
import { Reveal } from "@/components/animations/Reveal";
import * as React from "react";

export function WorkGallery({ works }: { works: Project[] }) {
  const [activeFilter, setActiveFilter] = React.useState<string>("All");

  const counts = React.useMemo(() => {
    const all = works.length;
    const arch = works.filter((w) => w.category === "Architecture").length;
    const comp = works.filter((w) => w.category === "Computation").length;
    return { all, arch, comp };
  }, [works]);

  const categories = [
    { id: "All", label: `All [${counts.all}]` },
    { id: "Architecture", label: `Architecture [${String(counts.arch).padStart(2, "0")}]` },
    { id: "Computation", label: `Computation [${String(counts.comp).padStart(2, "0")}]` },
  ];

  const filteredWorks = React.useMemo(() => {
    if (activeFilter === "All") return works;
    return works.filter((work) => work.category === activeFilter);
  }, [works, activeFilter]);

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-16 sm:pb-20">
      {/* ── 2. Streamlined Monochrome Filter Bar (Tighter Spacing) ── */}
      <div className="px-4 sm:px-6 md:px-10">
        <div className="flex flex-wrap items-center gap-5 sm:gap-7 border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-3.5 sm:mb-4">
          {categories.map((cat) => {
            const isSelected = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`cursor-pointer transition-colors ${
                  isSelected
                    ? "font-mono text-xs text-neutral-900 dark:text-neutral-100 underline underline-offset-8"
                    : "font-mono text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. Dense Grid: Images Close Together with Hover Info ── */}
      <section className="px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-1.5 md:gap-2">
          {filteredWorks.map((work, i) => {
            const href = `/work/${work.slug}`;
            const itemIndex = work.order !== undefined ? work.order + 1 : i + 1;
            const formattedIndex = String(itemIndex).padStart(2, "0");
            const typology = work.typology || work.category || "Architecture";
            const year = work.completionYear || "2024";

            return (
              <Reveal
                key={work.slug}
                delay={0.02 * (i % 8)}
                className="w-full"
              >
                <Link
                  href={href}
                  className="relative aspect-[4/3] w-full overflow-hidden block group bg-neutral-900 cursor-pointer select-none border border-black/5 dark:border-white/5"
                >
                  {/* Project Image */}
                  <Image
                    src={work.heroImage}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Information Overlay (Visible only on hover) */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3.5 sm:p-4 flex flex-col justify-between pointer-events-none">
                    {/* Top Row: [01] + Title */}
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="font-mono text-xs text-neutral-400 flex-shrink-0">
                        [{formattedIndex}]
                      </span>
                      <h3 className="font-sans text-sm font-medium text-white tracking-tight truncate">
                        {work.title}
                      </h3>
                    </div>

                    {/* Bottom Row: Typology / Location + Year */}
                    <div className="flex items-center justify-between gap-2 min-w-0 font-mono text-[11px] text-neutral-300 border-t border-white/15 pt-2">
                      <span className="truncate">
                        {typology} / {work.location}
                      </span>
                      <span className="flex-shrink-0 text-neutral-400">
                        {year}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {filteredWorks.length === 0 && (
          <div className="py-20 text-center font-mono text-xs text-neutral-500 uppercase tracking-widest">
            No projects found in this category.
          </div>
        )}
      </section>
    </div>
  );
}
