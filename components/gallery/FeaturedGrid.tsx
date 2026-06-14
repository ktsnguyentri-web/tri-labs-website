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
  
  // Drag refs for inertia physics
  const startX = React.useRef(0);
  const startScrollLeft = React.useRef(0);
  const lastX = React.useRef(0);
  const lastTime = React.useRef(0);
  const velocity = React.useRef(0);
  const animFrameId = React.useRef<number | null>(null);
  const wasDragged = React.useRef(false);
  
  // AudioContext ref to synthesize mechanical clicks lazily
  const audioCtxRef = React.useRef<AudioContext | null>(null);
  const lastClickScrollLeft = React.useRef(0);
  const CLICK_INTERVAL = 45; // pixels per click

  const playMechanicalClick = React.useCallback(() => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Primary click (high-pitched metallic latch)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(2600, now);
      osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.01);
      gain1.gain.setValueAtTime(0.03, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.012);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.012);

      // Secondary click (mid-pitched mechanical body)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1400, now + 0.002);
      osc2.frequency.exponentialRampToValueAtTime(600, now + 0.008);
      gain2.gain.setValueAtTime(0.015, now + 0.002);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.002);
      osc2.stop(now + 0.01);
    } catch (e) {
      // Ignore autoplay block
    }
  }, []);

  const handleScroll = React.useCallback(() => {
    if (!scrollRef.current) return;
    const currentScrollLeft = scrollRef.current.scrollLeft;
    const diff = Math.abs(currentScrollLeft - lastClickScrollLeft.current);
    if (diff >= CLICK_INTERVAL) {
      playMechanicalClick();
      lastClickScrollLeft.current = currentScrollLeft;
    }
  }, [playMechanicalClick]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;

    // Cancel any ongoing momentum
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }

    setIsDragging(true);
    wasDragged.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    startScrollLeft.current = scrollRef.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = performance.now();
    velocity.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = startScrollLeft.current - walk;

    const now = performance.now();
    const dt = now - lastTime.current;
    const dx = e.pageX - lastX.current;

    if (Math.abs(dx) > 3) {
      wasDragged.current = true;
    }

    if (dt > 0) {
      velocity.current = -dx / dt;
    }

    lastX.current = e.pageX;
    lastTime.current = now;
  };

  const handleMouseUp = () => {
    if (!isDragging || !scrollRef.current) return;
    setIsDragging(false);

    if (Math.abs(velocity.current) > 0.15) {
      let vel = velocity.current * 14;
      const friction = 0.94;

      const step = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollLeft += vel;
        vel *= friction;

        if (Math.abs(vel) > 0.15) {
          animFrameId.current = requestAnimationFrame(step);
        } else {
          animFrameId.current = null;
        }
      };

      animFrameId.current = requestAnimationFrame(step);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      playMechanicalClick();
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/section -mx-4 px-4 md:-mx-10 md:px-10">
      {/* Navigation Arrows */}
      <button 
        onClick={() => scroll("left")}
        className="absolute left-4 top-[35%] -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all duration-300 border border-white/10 hidden md:flex"
        aria-label="Previous"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <button 
        onClick={() => scroll("right")}
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
        onScroll={handleScroll}
        className={`flex flex-nowrap overflow-x-auto gap-3 pb-12 no-scrollbar ${isDragging ? "cursor-grabbing select-none scroll-auto snap-none" : "cursor-default scroll-smooth snap-x snap-mandatory"}`}
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
                    onClick={(e) => wasDragged.current && e.preventDefault()}
                    className="w-full aspect-[3/2] relative overflow-hidden bg-black cursor-pointer block"
                  >
                    <Image
                      src={work.heroImage}
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
                      onClick={(e) => wasDragged.current && e.preventDefault()}
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

