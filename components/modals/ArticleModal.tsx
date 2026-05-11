"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={handleClose}
        aria-label="Close modal background"
      />

      <div className="bg-black w-full max-w-7xl h-[85vh] relative overflow-hidden flex flex-col shadow-2xl z-10 scale-in-95 duration-300 border border-white/10">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors z-20 shadow-sm"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-white" strokeWidth={1.5} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto w-full h-full custom-scrollbar overscroll-contain">
          <div className="max-w-3xl mx-auto py-20 px-6 md:px-12">

            {/* Header */}
            <header className="mb-12 pb-12 border-b border-black/10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-white/40">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{article.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white leading-[1.1] font-sans">
                  {article.title}
                </h1>
                <div className="text-white/40 font-sans text-lg italic">
                  By Tri Labs Team
                </div>
              </div>
            </header>

            {/* Body — Prose HTML from CMS */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-white prose-headings:font-medium prose-p:text-white/60 prose-p:leading-[1.8] prose-p:font-sans prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-none prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* Footer */}
            <div className="mt-20 pt-10 border-t border-black/10 text-center">
              <Button variant="ghost" onClick={handleClose}>
                Close Article
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
