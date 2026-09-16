"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

  // Check if the cover image is already included in the article content HTML to avoid duplicates
  const isImageInContent = article.coverImage && article.contentHtml.includes(article.coverImage);

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-2 md:p-4 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClose}
        aria-label="Close modal background"
      />

      <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 w-[96vw] max-w-4xl h-[93vh] rounded-2xl sm:rounded-3xl relative overflow-hidden flex flex-col shadow-2xl z-10 scale-in-95 duration-300 border border-neutral-200 dark:border-neutral-800">

        {/* Sticky Header */}
        <div className="sticky top-0 bg-[#FAFAFA] dark:bg-[#0A0A0A] z-20 px-6 py-3.5 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            <span>{article.category}</span>
            <span>•</span>
            <span>{article.date}</span>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-90"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-neutral-900 dark:text-neutral-100" strokeWidth={1.5} />
          </button>
        </div>

        {/* Always scrollable container with full article */}
        <div className="w-full h-full overscroll-contain overflow-y-auto custom-scrollbar-light dark:custom-scrollbar">
          <div className="max-w-4xl mx-auto pt-8 pb-12 px-6 md:px-12 flex flex-col min-h-full">

            {/* Header */}
            <header className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-[42px] font-light tracking-tight text-neutral-900 dark:text-neutral-100 leading-[1.15] font-sans">
                  {article.title}
                </h1>
                <div className="text-neutral-500 dark:text-neutral-400 font-sans text-sm italic">
                  By Tri Labs Team
                </div>
              </div>
            </header>

            {/* Cover Image - only show if it does not appear inside the content HTML */}
            {article.coverImage && !isImageInContent && (
              <div className="relative w-full h-[30vh] md:h-[40vh] bg-neutral-100 dark:bg-neutral-900 shrink-0 mb-8 overflow-hidden rounded-none">
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

            {/* Full Compiled Prose Body */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100 prose-headings:font-light prose-headings:tracking-tight prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-[1.8] prose-p:font-sans prose-a:text-neutral-900 dark:prose-a:text-neutral-100 prose-a:underline hover:opacity-70 prose-img:rounded-none prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100 shrink-0"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* Expanded Footer Actions */}
            <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end shrink-0">
              <Button variant="outline" onClick={handleClose} showIcon={false} className="rounded-full px-6 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                Close Article
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
