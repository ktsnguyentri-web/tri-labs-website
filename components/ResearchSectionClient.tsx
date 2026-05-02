"use client";

import { useState } from "react";
import { ResearchData } from "@/lib/cms";
import { ArticleModal } from "./ArticleModal";

interface ResearchSectionClientProps {
  insights: ResearchData[];
}

export function ResearchSectionClient({ insights }: ResearchSectionClientProps) {
  const [selectedArticle, setSelectedArticle] = useState<ResearchData | null>(null);

  if (!insights || insights.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {insights.map((item) => (
          <div 
            key={item.slug} 
            onClick={() => setSelectedArticle(item)}
            className="flex flex-col gap-4 group cursor-pointer h-full text-left"
          >
            <div className="flex flex-col gap-2 flex-grow">
              <span className="font-mono text-[14px] uppercase tracking-[0.05em] text-[#4C4546]">
                {item.date} | {item.category}
              </span>
              <h3 className="font-sans text-[32px] font-medium tracking-[-0.02em] leading-[1.2] text-black group-hover:text-[#4C4546] transition-colors truncate">
                {item.title}
              </h3>
              <p className="font-sans text-[16px] leading-[1.6] text-[#4C4546] line-clamp-2">
                {item.excerpt}
              </p>
            </div>
            <div className="w-full aspect-video relative overflow-hidden rounded-2xl mt-auto">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}
    </>
  );
}
