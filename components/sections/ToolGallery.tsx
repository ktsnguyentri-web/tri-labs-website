"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { ResearchArticle } from "@/types/cms";
import { ArticleModal } from "@/components/modals/ArticleModal";
import { Reveal } from "@/components/animations/Reveal";

interface ToolGalleryProps {
  toolArticles: ResearchArticle[];
}

export function ToolGallery({ toolArticles }: ToolGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [selectedArticle, setSelectedArticle] = useState<ResearchArticle | null>(null);

  const counts = useMemo(() => {
    const all = toolArticles.length;
    const tools = toolArticles.filter((a) => a.category === "Tool").length;
    const research = toolArticles.filter((a) => a.category === "Research").length;
    return { all, tools, research };
  }, [toolArticles]);

  const categories = [
    { id: "All", label: `All [${counts.all}]` },
    { id: "Tool", label: `Tools [${String(counts.tools).padStart(2, "0")}]` },
    { id: "Research", label: `Research [${String(counts.research).padStart(2, "0")}]` },
  ];

  const filteredArticles = useMemo(() => {
    if (activeFilter === "All") return toolArticles;
    return toolArticles.filter((item) => item.category === activeFilter);
  }, [toolArticles, activeFilter]);

  return (
    <div className="w-full max-w-[1440px] mx-auto pb-16 sm:pb-20">
      {/* ── Filter Bar (Matching 01 / WORK) ── */}
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

      {/* ── Dense Grid: Matching 01 / WORK Grid and Text Layout ── */}
      <section className="px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-1.5 md:gap-2">
          {filteredArticles.map((article, i) => {
            const formattedIndex = String(i + 1).padStart(2, "0");
            const category = article.category || "Tool";
            const date = article.date || "2026";

            return (
              <Reveal key={article.slug} delay={0.02 * (i % 8)} className="w-full">
                <div
                  onClick={() => setSelectedArticle(article)}
                  className="relative aspect-[4/3] w-full overflow-hidden block group bg-neutral-900 cursor-pointer select-none border border-black/5 dark:border-white/5"
                >
                  {/* Article Thumbnail */}
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-black/[0.02] dark:bg-white/[0.02]">
                      <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-neutral-400 dark:text-white/30 mb-1">
                        Computational Prototype
                      </span>
                      <span className="font-serif text-xs text-neutral-400 dark:text-white/50 line-clamp-2">
                        {article.title}
                      </span>
                    </div>
                  )}

                  {/* Information Overlay (Visible on hover - matching WorkGallery) */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3.5 sm:p-4 flex flex-col justify-between pointer-events-none">
                    {/* Top Row: [01] + Title */}
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="font-mono text-xs text-neutral-400 flex-shrink-0">
                        [{formattedIndex}]
                      </span>
                      <h3 className="font-sans text-sm font-medium text-white tracking-tight truncate">
                        {article.title}
                      </h3>
                    </div>

                    {/* Bottom Row: Category + Date */}
                    <div className="flex items-center justify-between gap-2 min-w-0 font-mono text-[11px] text-neutral-300 border-t border-white/15 pt-2">
                      <span className="truncate uppercase">
                        {category}
                      </span>
                      <span className="flex-shrink-0 text-neutral-400">
                        {date}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="py-20 text-center font-mono text-xs text-neutral-500 uppercase tracking-widest">
            No prototypes found in this category.
          </div>
        )}
      </section>

      {/* Modal View for Article Detail */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
