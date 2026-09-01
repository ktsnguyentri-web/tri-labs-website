"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchArticle } from "@/types/cms";
import { ArticleModal } from "@/components/modals/ArticleModal";

interface WritingAccordionContentProps {
  articles: ResearchArticle[];
}

function formatDisplayDate(dateStr: string): string {
  // If format is like "June 24, 2026", parse and extract year or month/year
  try {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      return parsed.getFullYear().toString();
    }
  } catch {
    // fallback
  }
  // Return last 4 characters if they are a year, or raw string
  const yearMatch = dateStr.match(/\b(20\d\d)\b/);
  return yearMatch ? yearMatch[1] : dateStr;
}

export function WritingAccordionContent({ articles }: WritingAccordionContentProps) {
  const [selectedArticle, setSelectedArticle] = useState<ResearchArticle | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 flex flex-col pt-1">
      {/* ── Subtitle / Editorial Meta ────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-2">
        <span className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 tracking-normal">
          Essays, Notes &amp; Spatial Research
        </span>
        <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 tracking-normal">
          {articles.length} {articles.length === 1 ? "Entry" : "Entries"}
        </span>
      </div>

      {/* ── Minimalist Single-Column Text List (Lovin / Coursey style) ── */}
      <div className="flex flex-col divide-y divide-neutral-100 dark:divide-neutral-900/60">
        {articles.map((article) => {
          const displayDate = formatDisplayDate(article.date);

          return (
            <Link
              key={article.slug}
              href={`/research/${article.slug}`}
              onClick={(e) => {
                // If standard left click without modifier, open inline reader modal
                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
                  e.preventDefault();
                  setSelectedArticle(article);
                }
              }}
              className="group -mx-3 px-3 py-3.5 sm:py-4 rounded-md flex items-center justify-between gap-4 transition-all duration-200 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60 cursor-pointer"
            >
              {/* Left: Indicator dot & Article Title */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 group-hover:bg-neutral-900 dark:group-hover:bg-white transition-colors shrink-0" />
                <h3 className="font-sans font-normal text-sm sm:text-[15px] text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                  {article.title}
                </h3>
              </div>

              {/* Center: Subtle connecting dotted line on wider screens */}
              <div className="hidden sm:block flex-1 max-w-[160px] md:max-w-xs border-b border-dotted border-neutral-200 dark:border-neutral-800 transition-colors group-hover:border-neutral-400 dark:group-hover:border-neutral-600 shrink-0" />

              {/* Right: Year / Date & Reveal Arrow */}
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                  {displayDate}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 dark:text-neutral-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Inline Reader Modal ────────────────────────────────────── */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
