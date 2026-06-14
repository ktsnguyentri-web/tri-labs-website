"use client";

import * as React from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ResearchArticle } from "@/types/cms";

import { Reveal } from "@/components/animations/Reveal";

interface ResearchSectionClientProps {
  insights: ResearchArticle[];
}

export function ResearchSectionClient({ insights }: ResearchSectionClientProps) {
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
    <div className="relative group/section -mx-4 px-4 md:-mx-10 md:px-10">
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
        className={`flex flex-nowrap overflow-x-auto gap-3 pb-12 no-scrollbar ${isDragging ? 'cursor-grabbing select-none scroll-auto snap-none' : 'cursor-default scroll-smooth snap-x snap-mandatory'}`}
      >
        {insights.map((item, i) => (
          <div 
            key={`${item.slug}-${i}`} 
            className="flex-shrink-0 w-[85vw] sm:w-[calc((100%-12px)/2)] lg:w-[calc((100%-36px)/4)] snap-start"
          >
            <Reveal width="100%" delay={i * 0.1}>
              <div className="flex flex-col gap-6 group h-full text-left">
                {/* 1. Image container */}
                <Link 
                  href={`/research/${item.slug}`}
                  scroll={false}
                  onClick={(e) => isDragging && e.preventDefault()}
                  className="w-full aspect-[3/2] relative overflow-hidden bg-black cursor-pointer block"
                >
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    draggable={false}
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 select-none"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </Link>

                {/* 2. Content Section */}
                <div className="flex flex-col gap-1">
                  <div className="font-sans text-[11px] font-bold text-white tracking-tight">
                    {item.category || 'Insight'}
                  </div>

                  <Link 
                    href={`/research/${item.slug}`}
                    scroll={false}
                    onClick={(e) => isDragging && e.preventDefault()}
                    className="text-[17px] md:text-[19px] font-light tracking-tight text-white leading-[1.2] hover:opacity-70 transition-opacity line-clamp-2 min-h-[2.4em]"
                  >
                    {item.title}
                  </Link>

                  <div className="font-sans text-[11px] text-white/40 leading-relaxed line-clamp-1">
                    {item.date}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}
