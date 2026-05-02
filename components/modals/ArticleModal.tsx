"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { ResearchArticle } from "@/types/cms";
import { Button } from "@/components/ui/button";

interface ArticleModalProps {
  article: ResearchArticle;
  onClose: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close modal background"
      />

      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-[24px] relative overflow-hidden flex flex-col shadow-2xl z-10 scale-in-95 duration-300">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-sm hover:bg-gray-100 rounded-full transition-colors z-20 shadow-sm"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-black" strokeWidth={1.5} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto w-full h-full custom-scrollbar">
          <div className="max-w-3xl mx-auto py-20 px-6 md:px-12">

            {/* Header */}
            <header className="mb-12 pb-12 border-b border-gray-100">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#4C4546]">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{article.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-black leading-[1.1] font-sans">
                  {article.title}
                </h1>
                <div className="text-[#4C4546] font-sans text-lg italic">
                  By Tri Labs Team
                </div>
              </div>
            </header>

            {/* Body — Prose HTML from CMS */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-black prose-headings:font-medium prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:font-sans prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-strong:text-black"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />

            {/* Footer */}
            <div className="mt-20 pt-10 border-t border-gray-100 text-center">
              <Button variant="ghost" onClick={onClose}>
                Close Article
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
