"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import type { ResearchArticle } from "@/types/cms";
import { ArticleModal } from "@/components/modals/ArticleModal";

import { Reveal } from "@/components/animations/Reveal";

interface ResearchSectionClientProps {
  insights: ResearchArticle[];
}

export function ResearchSectionClient({ insights }: ResearchSectionClientProps) {
  const [selectedArticle, setSelectedArticle] = useState<ResearchArticle | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!insights || insights.length === 0) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/section -mx-10 px-10">
      {/* Navigation Arrows — Circular and centered on image */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-4 top-[35%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 border border-white/10 hidden md:flex"
        aria-label="Previous"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-4 top-[35%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 border border-white/10 hidden md:flex"
        aria-label="Next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex flex-nowrap overflow-x-auto gap-6 pb-12 no-scrollbar ${isDragging ? 'cursor-grabbing select-none scroll-auto snap-none' : 'cursor-default scroll-smooth snap-x snap-mandatory'}`}
      >
        {insights.map((item, i) => (
          <div 
            key={`${item.slug}-${i}`} 
            className="flex-shrink-0 w-[85vw] md:w-[calc((100%-48px)/3)] snap-start"
          >
            <Reveal width="100%" delay={i * 0.1}>
              <div className="flex flex-col gap-6 group h-full text-left">
                {/* 1. Image container - Clickable area */}
                <div 
                  onClick={() => !isDragging && setSelectedArticle(item)}
                  className="w-full aspect-[3/2] relative overflow-hidden bg-white/5 cursor-pointer"
                >
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    draggable={false}
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 select-none"
                    sizes="(max-width: 768px) 300px, 600px"
                  />
                </div>

                {/* 2. Content below image - Clickable area */}
                <div className="flex flex-col gap-3">
                  <div className="font-sans text-[12px] text-white/30 uppercase tracking-[0.1em] select-none">
                    {item.date}
                  </div>
                  
                  <h3 
                    onClick={() => !isDragging && setSelectedArticle(item)}
                    className="text-[18px] md:text-[22px] font-medium tracking-tight text-white hover:underline w-fit decoration-white decoration-2 underline-offset-4 cursor-pointer transition-colors leading-[1.3] line-clamp-2 select-none"
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
