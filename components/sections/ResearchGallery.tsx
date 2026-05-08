"use client";

import { useState } from "react";
import Image from "next/image";
import type { ResearchArticle } from "@/types/cms";
import { ArticleModal } from "@/components/modals/ArticleModal";
import { Reveal } from "@/components/animations/Reveal";

interface ResearchGalleryProps {
  researchArticles: ResearchArticle[];
  toolArticles: ResearchArticle[];
}

function GridItem({
  item,
  onClick,
  index,
}: {
  item: ResearchArticle;
  onClick: () => void;
  index: number;
}) {
  return (
    <Reveal delay={0.2 + (index % 3) * 0.1}>
      <div
        onClick={onClick}
        className="flex flex-col gap-4 group cursor-pointer h-full text-left"
      >
        <div className="flex flex-col gap-2 flex-grow">
          <span className="data-mono text-white/30">
            {item.date} | {item.category}
          </span>
          <h3 className="text-heading-lg font-bold tracking-tight text-white group-hover:text-white/60 transition-colors truncate">
            {item.title}
          </h3>

          <p className="text-body-md text-white/50 line-clamp-2">
            {item.excerpt}
          </p>
        </div>
        {/* aspect-[16/10] + relative enables fill Image */}
        <div className="w-full aspect-[16/10] overflow-hidden mt-auto relative">
          <Image
            src={item.coverImage}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        </div>
      </div>
    </Reveal>
  );
}

export function ResearchGallery({
  researchArticles,
}: Omit<ResearchGalleryProps, 'toolArticles'>) {
  const [selectedArticle, setSelectedArticle] = useState<ResearchArticle | null>(null);

  return (
    <div className="w-full max-w-[1440px] mx-auto pt-12 pb-32 flex flex-col gap-24 px-10">
 
       {/* Section 1: Research & Insights */}
       {researchArticles.length > 0 && (
         <div className="w-full">
           <Reveal>
             <div className="flex flex-col md:flex-row items-baseline gap-6 mb-12">
               <h1 className="text-[48px] font-light tracking-tight text-white uppercase leading-none">
                 Research &amp; Insights
               </h1>
               <p className="label-caps text-[#4C4546]/60">
                 Updates and news from the Tri Labs team.
               </p>
             </div>
           </Reveal>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {researchArticles.map((item, i) => (
               <GridItem
                 key={item.slug}
                 item={item}
                 onClick={() => setSelectedArticle(item)}
                 index={i}
               />
             ))}
           </div>
         </div>
       )}
 
       {selectedArticle && (
         <ArticleModal
           article={selectedArticle}
           onClose={() => setSelectedArticle(null)}
         />
       )}
     </div>
  );
}
