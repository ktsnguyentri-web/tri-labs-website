"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/cms";
import { Reveal } from "@/components/animations/Reveal";
import * as React from "react";

const FILTERS = [
  "All",
  "Concept Design",
  "Schematic Design",
  "Design Development",
  "Documentation",
  "BIM",
  "Visualization",
  "Computational Design",
  "Independent Work"
];

export function WorkGallery({ works }: { works: Project[] }) {
  const [activeFilter, setActiveFilter] = React.useState<string>("All");

  const filteredWorks = React.useMemo(() => {
    if (activeFilter === "All") return works;
    
    return works.filter(work => {
      const scopes = work.scope ? work.scope.split(",").map(s => s.trim()) : [];
      if (activeFilter === "Independent Work") {
         // Either explicitly tagged or has an author instead of an architect
         return scopes.includes("Independent Work") || !!work.author || !work.architect;
      }
      return scopes.includes(activeFilter);
    });
  }, [works, activeFilter]);

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-32">
      {/* Scope Filter Bar */}
      <div className="px-6 md:px-10 mt-6 mb-12">
        <Reveal width="100%">
          <div className="flex flex-col gap-5 border-t border-b border-white/10 py-6">
            <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">
              {FILTERS.map(filter => {
                const isSelected = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`text-[11px] font-mono tracking-[0.15em] uppercase transition-colors duration-300 ${
                      isSelected 
                        ? "text-[#61F9E9]" 
                        : "text-white/40 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      <section className="px-6 md:px-10">
        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWorks.map((work, i) => {
            const href = `/work/${work.slug}`;
            const isIndependent = !!work.author || !work.architect;
            
            return (
              <Reveal 
                key={work.slug} 
                delay={0.05 * (i % 8)} 
                className="aspect-[4/3] relative overflow-hidden group bg-[#111]"
              >
                <Link
                  href={href}
                  className="cursor-pointer relative w-full h-full block"
                >
                  <Image
                    src={work.heroImage}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  
                  {/* Editorial Hover Overlay */}
                  <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-5 md:p-6 backdrop-blur-[2px]">
                    {/* Top section: Title & Basic Info */}
                    <div className="flex flex-col">
                      <h4 className="text-white text-[13px] md:text-[14px] font-semibold tracking-wider uppercase leading-snug">
                        {work.title}
                      </h4>
                      <p className="text-white/40 text-[9px] font-mono uppercase tracking-widest mt-1 truncate" title={isIndependent ? "Independent Work" : `${work.category || "Architecture"} // ${work.location} // ${work.status || work.completionYear}`}>
                        {isIndependent 
                          ? "Independent Work" 
                          : `${work.category || "Architecture"} // ${work.location} // ${work.status || work.completionYear}`}
                      </p>
                    </div>

                    {/* Bottom section: Roles & Scopes Metadata */}
                    <div className="flex flex-col gap-2 font-mono text-[9px] text-white/70 tracking-wider uppercase border-t border-white/10 pt-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-white/40 shrink-0">Office</span>
                        <span className="text-right text-white truncate max-w-[70%]">{isIndependent ? "Independent Work" : work.architect}</span>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-white/40 shrink-0">Scope</span>
                        <span className="text-right text-white truncate max-w-[70%]" title={work.scope}>{work.scope}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
        
        {filteredWorks.length === 0 && (
          <div className="py-20 text-center font-mono text-[11px] text-white/30 uppercase tracking-widest">
             No works found for this scope.
          </div>
        )}
      </section>
    </div>
  );
}
