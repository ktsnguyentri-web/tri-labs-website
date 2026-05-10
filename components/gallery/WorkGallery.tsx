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
    <div className="w-full pt-12 pb-24">


      {/* Filters */}
      <div className="flex flex-col gap-6 mb-6 px-6 md:px-10">
        <div className="flex flex-wrap justify-between items-center w-full">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-[28px] md:text-[32px] leading-none tracking-tight transition-colors ${
                activeFilter === filter
                  ? "font-light text-white"
                  : "font-light text-white/30 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-2 grid-flow-dense">
        {filteredWorks.map((work, i) => {
          const href = `/work/${work.slug}`;
          const isWorkPage = pathname?.includes('/work') || pathname?.includes('/projects');

          return (
            <Reveal key={work.id} delay={0.1 + (i % 4) * 0.1} className={work.span}>
              {isWorkPage ? (
                <a
                  href={href}
                  className="cursor-pointer relative w-full h-full text-left block"
                >
                  <div className="relative w-full h-full overflow-hidden group bg-secondary">
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 25vw"
                    />
                    {/* Hover overlay — rounded to match container */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="absolute bottom-0 left-0 p-6">
                        <h4 className="text-white text-[15px] font-medium tracking-tight mb-2 leading-snug">
                          {work.title}
                        </h4>
                        <p className="text-white/70 text-[10px] font-mono uppercase tracking-widest">
                          {work.completionYear}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ) : (
                <Link
                  href={href}
                  scroll={false}
                  className="cursor-pointer relative w-full h-full text-left block"
                >
                  <div className="relative w-full h-full overflow-hidden group bg-secondary">
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 25vw"
                    />
                    {/* Hover overlay — rounded to match container */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="absolute bottom-0 left-0 p-6">
                        <h4 className="text-white text-[15px] font-medium tracking-tight mb-2 leading-snug">
                          {work.title}
                        </h4>
                        <p className="text-white/70 text-[10px] font-mono uppercase tracking-widest">
                          {work.completionYear}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </Reveal>
          );
        })}
    </div>
    </div>
  );
}

