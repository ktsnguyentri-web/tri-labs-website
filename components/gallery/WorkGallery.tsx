"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { WorkItem, ModalProject } from "@/types/cms";
import { ProjectModal } from "@/components/modals/ProjectModal";

// Re-export so app/work/page.tsx can import WorkItem from here (backwards compat)
export type { WorkItem } from "@/types/cms";

type Category = "All" | "Architecture" | "Interior" | "Design";

export function WorkGallery({ works }: { works: WorkItem[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as Category | null;

  const [activeFilter, setActiveFilter] = useState<Category>(categoryParam || "All");
  const [selectedProject, setSelectedProject] = useState<ModalProject | null>(null);

  useEffect(() => {
    if (categoryParam) {
      setActiveFilter(categoryParam);
    }
  }, [categoryParam]);

  const filters: Category[] = ["All", "Architecture", "Interior", "Design"];

  const filteredWorks =
    activeFilter === "All" ? works : works.filter((w) => w.category === activeFilter);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[5vw] pt-0 pb-24">

      {/* Filters */}
      <div className="flex flex-col gap-8 mb-24">
        <div className="flex flex-wrap gap-8 items-center">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`text-4xl md:text-[52px] leading-none transition-colors ${
                activeFilter === filter
                  ? "font-normal text-black"
                  : "font-light text-[#9CA3AF] hover:text-black"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-6 grid-flow-dense">
        {filteredWorks.map((work) => (
          <button
            key={work.id}
            onClick={() =>
              setSelectedProject({
                title: work.title,
                coverImage: work.coverImage,
                category: work.category,
                completionYear: work.completionYear,
              })
            }
            className={`${work.span} cursor-pointer relative w-full h-full text-left`}
          >
            <div className="relative w-full h-full rounded-[24px] overflow-hidden group bg-secondary">
              <Image
                src={work.coverImage}
                alt={work.title}
                fill
                className="object-cover rounded-[24px] transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 25vw"
              />
              {/* Hover overlay — rounded to match container */}
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
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
          </button>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
