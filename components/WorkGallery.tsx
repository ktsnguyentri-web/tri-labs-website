"use client";

import { useState } from "react";
import { Plus, List } from "lucide-react";

type Category = "All" | "Architecture" | "Interior" | "Design";

export interface WorkItem {
  id: string | number;
  title: string;
  category: "Architecture" | "Interior" | "Design";
  year: string;
  img: string;
  span: string;
}

export function WorkGallery({ works }: { works: WorkItem[] }) {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  
  const filters: Category[] = ["All", "Architecture", "Interior", "Design"];

  const filteredWorks = activeFilter === "All" 
    ? works 
    : works.filter(w => w.category === activeFilter);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-[5vw] pt-40 pb-24">
      
      {/* Filters Section */}
      <div className="flex flex-col gap-8 mb-24">
        
        {/* Primary Filter Row */}
        <div className="flex flex-wrap gap-8 items-center">
          {filters.map(filter => (
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

      {/* Grid Gallery - Bento Box */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-6 grid-flow-dense">
        {filteredWorks.map(work => (
          <div key={work.id} className={`${work.span} group cursor-pointer relative overflow-hidden rounded-2xl bg-secondary w-full h-full`}>
            <img 
              src={work.img} 
              alt={work.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark Hover Overlay (Bottom-Left) */}
            <div className="absolute bottom-0 left-0 bg-black/80 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tr-xl backdrop-blur-sm max-w-[85%]">
              <h4 className="text-white text-[15px] font-medium tracking-tight mb-2 leading-snug">{work.title}</h4>
              <p className="text-white/70 text-[10px] font-mono uppercase tracking-widest">{work.year}</p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
