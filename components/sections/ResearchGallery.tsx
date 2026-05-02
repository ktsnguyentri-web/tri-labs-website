"use client";

import { useState } from "react";
import Image from "next/image";
import type { ResearchArticle } from "@/types/cms";
import { ArticleModal } from "@/components/modals/ArticleModal";

interface ResearchGalleryProps {
  researchArticles: ResearchArticle[];
  toolArticles: ResearchArticle[];
}

function GridItem({
  item,
  onClick,
}: {
  item: ResearchArticle;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-4 group cursor-pointer h-full text-left"
    >
      <div className="flex flex-col gap-2 flex-grow">
        <span className="font-mono text-[12px] uppercase tracking-[0.05em] text-[#4C4546]">
          {item.date} | {item.category}
        </span>
        <h3 className="font-sans text-2xl font-medium tracking-tight text-black group-hover:text-[#4C4546] transition-colors truncate">
          {item.title}
        </h3>
        <p className="font-sans text-base text-[#4C4546] line-clamp-2 leading-[1.6]">
          {item.excerpt}
        </p>
      </div>
      {/* aspect-[16/10] + relative enables fill Image */}
      <div className="w-full aspect-[16/10] overflow-hidden rounded-2xl mt-auto relative">
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

export function ResearchGallery({
  researchArticles,
  toolArticles,
}: ResearchGalleryProps) {
  const [selectedArticle, setSelectedArticle] = useState<ResearchArticle | null>(null);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-10 pt-0 pb-24 flex flex-col gap-32">

      {/* Section 1: Research & Insights */}
      {researchArticles.length > 0 && (
        <div className="w-full">
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-24">
            <h1 className="text-4xl md:text-[52px] leading-none font-normal text-black">
              Research &amp; Insights
            </h1>
            <p className="font-mono text-[14px] text-[#4C4546] mb-1 md:mb-2">
              Updates and news from the Tri Labs team.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {researchArticles.map((item) => (
              <GridItem
                key={item.slug}
                item={item}
                onClick={() => setSelectedArticle(item)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Tool */}
      {toolArticles.length > 0 && (
        <div className="w-full scroll-mt-[100px]" id="tool">
          <div className="flex flex-col md:flex-row md:items-end gap-6 mb-24">
            <h2 className="text-4xl md:text-[52px] leading-none font-normal text-black">
              Tool
            </h2>
            <p className="font-mono text-[14px] text-[#4C4546] mb-1 md:mb-2">
              Internal tools and computational workflows developed by Tri Labs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolArticles.map((item) => (
              <GridItem
                key={item.slug}
                item={item}
                onClick={() => setSelectedArticle(item)}
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
