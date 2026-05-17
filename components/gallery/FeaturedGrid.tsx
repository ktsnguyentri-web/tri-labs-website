"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Project } from "@/types/cms";
import { Reveal } from "@/components/animations/Reveal";
import * as React from "react";

export function FeaturedGrid({ works }: { works: Project[] }) {
  const pathname = usePathname();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);

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
    const walk = (x - startX) * 2;
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
      {/* Navigation Arrows */}
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
        {works.map((work, i) => {
          const href = `/work/${work.slug}`;
          const isWorkPage = pathname?.includes('/work') || pathname?.includes('/projects');
          const isIndependent = !!work.author || !work.architect;

          return (
            <div 
              key={work.slug} 
              className={`flex-shrink-0 w-[85vw] sm:w-[calc((100%-12px)/2)] lg:w-[calc((100%-36px)/4)] snap-start border-white/10`}
            >
              <Reveal width="100%" delay={i * 0.1}>
                <div className="flex flex-col gap-6 group h-full text-left">
                  {/* 1. Image container */}
                  <Link
                    href={href}
                    scroll={false}
                    onClick={(e) => isDragging && e.preventDefault()}
                    className="w-full aspect-[3/2] relative overflow-hidden bg-black cursor-pointer block"
                  >
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      draggable={false}
                      className="object-cover transition-transform duration-1000 group-hover:scale-105 select-none"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </Link>

                  {/* 2. Content Section */}
                  <div className="flex flex-col mt-4">
                    <Link
                      href={href}
                      scroll={false}
                      onClick={(e) => isDragging && e.preventDefault()}
                      className="text-[13px] md:text-[14px] font-semibold tracking-wider uppercase text-white hover:text-[#61F9E9] transition-colors leading-snug truncate block w-full"
                      title={work.title}
                    >
                      {work.title}
                    </Link>

                    <div 
                      className="font-mono text-[9px] uppercase tracking-widest text-white/40 mt-1.5 mb-3 leading-relaxed truncate block w-full"
                      title={isIndependent ? "Independent Work" : `${work.category || 'Architecture'} // ${work.location} // ${work.status || work.completionYear}`}
                    >
                      {isIndependent 
                        ? "Independent Work" 
                        : `${work.category || 'Architecture'} // ${work.location} // ${work.status || work.completionYear}`}
                    </div>

                    <div className="flex flex-col gap-2 font-mono text-[9px] text-white/70 tracking-wider uppercase border-t border-white/10 pt-3">
                      <div className="flex justify-between items-start gap-2 min-w-0">
                         <span className="text-white/40 shrink-0">Role</span>
                         <span className="text-right text-white truncate max-w-[70%] min-w-0 block" title={work.role}>{work.role}</span>
                      </div>
                      <div className="flex justify-between items-start gap-2 min-w-0">
                         <span className="text-white/40 shrink-0">Scope</span>
                         <span className="text-right text-white truncate max-w-[70%] min-w-0 block" title={work.scope}>{work.scope}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </div>
  );
}

