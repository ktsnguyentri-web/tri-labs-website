"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { WorkItem } from "@/types/cms";


// Re-export so app/work/page.tsx can import WorkItem from here (backwards compat)
export type { WorkItem } from "@/types/cms";

type Category = "All" | "Architecture" | "Interior" | "Design";

import { Reveal } from "@/components/animations/Reveal";

export function WorkGallery({ works }: { works: WorkItem[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const categoryParam = searchParams.get("category") as Category | null;

  const [activeFilter, setActiveFilter] = useState<Category>(categoryParam || "All");

  useEffect(() => {
    if (categoryParam) {
      setActiveFilter(categoryParam);
    }
  }, [categoryParam]);

  const filters: Category[] = ["All", "Architecture", "Interior", "Design"];

  const filteredWorks =
    activeFilter === "All" ? works : works.filter((w) => w.category === activeFilter);

  return (
    <div className="w-full">
      {/* Editorial Top Bar */}
      <div className="flex justify-between items-center px-6 md:px-10 py-10 border-b border-white/5 uppercase font-mono text-[10px] tracking-[0.2em] text-white/30 bg-background">
        <div className="flex gap-8 items-center">
          <button className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity">
            <span className="w-1 h-1 bg-white rounded-full" />
            Search & Filter
          </button>
          <span className="hidden md:inline font-light opacity-50 tracking-[0.1em]">
            <span className="text-white/60">{filteredWorks.length}</span> projects
          </span>
        </div>
        
        <div className="flex gap-10 items-center">
          <div className="flex gap-6">
            <button className="text-white border-b border-white pb-1">Grid</button>
            <button className="hover:text-white transition-colors pb-1 border-b border-transparent">List</button>
            <button className="hover:text-white transition-colors pb-1 border-b border-transparent">Map</button>
          </div>
        </div>
      </div>

      {/* Zero-Gap Editorial Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0 bg-white/5">
        {filteredWorks.map((work, i) => {
          const href = `/work/${work.slug}`;
          
          return (
            <Reveal 
              key={work.id} 
              delay={0.02 * (i % 8)} 
              className="aspect-[4/3] md:aspect-square relative overflow-hidden group border-r border-b border-white/5"
            >
              <Link
                href={href}
                className="cursor-pointer relative w-full h-full block overflow-hidden"
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
                      {work.location || 'Architecture'}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

