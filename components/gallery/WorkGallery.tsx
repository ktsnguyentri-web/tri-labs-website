"use client";

import Link from "next/link";
import Image from "next/image";
import type { WorkItem } from "@/types/cms";
import { Reveal } from "@/components/animations/Reveal";

export function WorkGallery({ works }: { works: WorkItem[] }) {
  const categories = ["Architecture", "Interior", "Design"] as const;
  
  const groupedWorks = categories.map(cat => ({
    name: cat,
    projects: works.filter(w => w.category === cat)
  }));

  return (
    <div className="w-full pb-32">
      {groupedWorks.map((group, groupIdx) => (
        <section key={group.name} className="mt-20 first:mt-10 px-6 md:px-10">
          {/* Section Header */}
          <Reveal width="100%">
            <div className="flex justify-between items-end mb-10 border-b border-white/10 pb-6 uppercase font-sans text-[11px] tracking-[0.3em] text-white/30">
              <div className="flex items-center gap-6">
                <h2 className="text-[22px] md:text-[26px] font-light tracking-tight text-white normal-case">
                  {group.name}
                </h2>
                <button className="px-4 py-1.5 border border-white/20 hover:bg-white hover:text-black transition-all text-[9px] tracking-[0.2em] uppercase rounded-full">
                  Filter
                </button>
              </div>
              <div className="hidden md:block">
                <span className="text-white/60">{group.projects.length}</span> projects
              </div>
            </div>
          </Reveal>

          {/* Grid with Thin Gap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {group.projects.map((work, i) => {
              const href = `/work/${work.slug}`;
              
              return (
                <Reveal 
                  key={work.id} 
                  delay={0.05 * (i % 8)} 
                  className="aspect-[4/3] md:aspect-square relative overflow-hidden group bg-white/5"
                >
                  <Link
                    href={href}
                    className="cursor-pointer relative w-full h-full block"
                  >
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw, 25vw"
                    />
                    
                    {/* Editorial Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 backdrop-blur-[1px]">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <h4 className="text-white text-[13px] font-bold uppercase tracking-[0.25em] mb-2 leading-tight">
                          {work.title}
                        </h4>
                        <p className="text-white/60 text-[9px] font-mono uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-[1px] bg-white/40" />
                          {work.location || group.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

