"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: React.ReactNode;
  totalItems: number;
}

export function HorizontalCarousel({ children, totalItems }: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active item index
    if (totalItems > 0 && scrollWidth > clientWidth) {
      const scrollFraction = scrollLeft / (scrollWidth - clientWidth);
      const estimatedIndex = Math.round(scrollFraction * (totalItems - 1));
      setCurrentIndex(Math.min(Math.max(0, estimatedIndex), totalItems - 1));
    }
  }, [totalItems]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const el = scrollRef.current;
    if (!el) return;

    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Drag sensitivity
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="w-full py-1">
      {/* ── Carousel Header Controls (Constrained to max-w-3xl) ──── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 flex items-center justify-between mb-3">
        {/* Slide Counter */}
        <div className="flex items-center gap-2 font-mono text-[10px] md:text-[11px] text-neutral-500 tracking-[0.2em]">
          <span className="text-neutral-200 font-medium">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{String(totalItems).padStart(2, "0")}</span>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="p-1.5 border border-white/10 hover:border-white text-white disabled:opacity-20 disabled:hover:border-white/10 transition-colors cursor-pointer disabled:cursor-not-allowed bg-black/40 rounded-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="p-1.5 border border-white/10 hover:border-white text-white disabled:opacity-20 disabled:hover:border-white/10 transition-colors cursor-pointer disabled:cursor-not-allowed bg-black/40 rounded-sm"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Full-Width Horizontal Scroll Track with Edge Fade Mask ── */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`w-full flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth pb-3 select-none pointer-events-auto px-6 md:px-16 lg:px-24 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          maskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      >
        {children}
      </div>

      {/* ── Bottom Track Progress Bar (Constrained to max-w-3xl) ─── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 mt-1">
        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
          <div
            className="h-full bg-white/50 transition-all duration-300 ease-out"
            style={{
              width: `${totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
