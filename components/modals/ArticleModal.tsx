"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { ResearchArticle } from "@/types/cms";
import { Button } from "@/components/ui/button";

interface ArticleModalProps {
  article: ResearchArticle;
  onClose?: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };
  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClose}
        aria-label="Close modal background"
      />

      <div className="bg-white w-[96vw] max-w-4xl h-[93vh] rounded-[6px] relative overflow-hidden flex flex-col shadow-2xl z-10 scale-in-95 duration-300 border border-black/10">

        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-20 px-6 py-3.5 flex justify-between items-center border-b border-black/10 shrink-0">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
            <span>{article.category}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-black/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5 text-black" strokeWidth={1.2} />
          </button>
        </div>

        {/* Dynamic Container based on isExpanded state */}
        <div className={`w-full h-full overscroll-contain ${isExpanded ? 'overflow-y-auto custom-scrollbar-light' : 'overflow-hidden'}`}>
          <div className="max-w-4xl mx-auto pt-8 pb-12 px-6 md:px-12 flex flex-col h-full min-h-full">

            {/* Header */}
            <header className="mb-6 pb-6 border-b border-black/10 shrink-0">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-[42px] font-light tracking-tight text-black leading-[1.15] font-sans">
                  {article.title}
                </h1>
                <div className="text-black/50 font-sans text-sm italic">
                  By Tri Labs Team
                </div>
              </div>
            </header>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="relative w-full h-[30vh] md:h-[40vh] bg-gray-100 shrink-0 mb-8 overflow-hidden rounded-none">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1600px) 96vw, 1600px"
                  priority
                />
              </div>
            )}

            {!isExpanded ? (
              <>
                {/* Preview Excerpt fitting in initial un-scrollable view */}
                <div className="relative flex-grow overflow-hidden">
                  <p className="font-sans text-base md:text-lg text-black/80 leading-[1.7] line-clamp-4">
                    {article.excerpt || "Explore our comprehensive research findings, methodologies, and interactive tools designed to push the boundaries of digital architecture and spatial computing."}
                  </p>
                </div>

                {/* Read More Trigger */}
                <div className="pt-4 border-t border-black/10 shrink-0 mt-4">
                  <button 
                    onClick={() => setIsExpanded(true)}
                    className="font-mono text-[11px] uppercase tracking-[0.2em] text-black hover:opacity-50 transition-all flex items-center gap-2 group py-2"
                  >
                    Read More 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Full Compiled Prose Body */}
                <div
                  className="prose prose-lg max-w-none prose-headings:text-black prose-headings:font-light prose-headings:tracking-tight prose-p:text-black/80 prose-p:leading-[1.8] prose-p:font-sans prose-a:text-black prose-a:underline hover:prose-a:text-black/60 prose-img:rounded-none prose-strong:text-black prose-strong:font-semibold shrink-0"
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />

                {/* Expanded Footer Actions */}
                <div className="mt-16 pt-8 border-t border-black/10 flex items-center justify-between shrink-0">
                  <button 
                    onClick={() => setIsExpanded(false)}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 hover:text-black transition-all"
                  >
                    ← Show Less
                  </button>
                  <Button variant="ghost" onClick={handleClose} showIcon={false}>
                    Close Article
                  </Button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
