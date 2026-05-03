"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { HeroSlide } from "@/types/cms";

const SESSION_KEY = "introPlayed";

// ─── Hero Expansion Variants ─────────────────────────────────────────────────
const heroVariants = {
  /** Collapsed to a point — start of the cinematic expand */
  initial: { scale: 0, opacity: 0 },
  /** Springs open to fill the viewport */
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", damping: 15, stiffness: 40, duration: 1.2 } as const,
  },
  /** Return visit — already at final size, zero motion cost */
  static: { scale: 1, opacity: 1, transition: { duration: 0 } as const },
};

// ─── Info Card Variants ──────────────────────────────────────────────────────
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.6, ease: "easeOut" as const } },
  static: { opacity: 1, y: 0, transition: { duration: 0 } as const },
};

const SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "Ma Yansong Named Guest Editor of...",
    tag: "PUBLICATION | [TAG]",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Brutalist Concrete Structure Design",
    tag: "ARCHITECTURE | [TAG]",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Modern Minimalist Interior Space",
    tag: "INTERIOR | [TAG]",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Sustainable Urban Planning Concept",
    tag: "URBAN | [TAG]",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop",
  },
];

function ProgressBars({
  currentIndex,
  total,
  duration,
  onComplete,
}: {
  currentIndex: number;
  total: number;
  duration: number;
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);
      if (currentProgress < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentIndex, duration, onComplete]);

  return (
    <div className="flex gap-1.5 mb-4 w-full">
      {Array.from({ length: total }).map((_, idx) => (
        <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full"
            style={{
              width:
                idx === currentIndex ? `${progress}%` : idx < currentIndex ? "100%" : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * hasPlayed tri-state — mirrors the Navbar pattern exactly:
   *  null  → SSR / pre-useEffect (content hidden via opacity-0)
   *  false → first visit this session → play expansion animation
   *  true  → already played → render in static final state
   */
  const [hasPlayed, setHasPlayed] = useState<boolean | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setHasPlayed(true);  // Already played → static
    } else {
      // Note: Navbar's useEffect also writes this key. Whichever mounts
      // first wins; the other reads it and skips. Either way the
      // animation plays exactly once.
      sessionStorage.setItem(SESSION_KEY, "true");
      setHasPlayed(false); // First visit → animate
    }
  }, []);

  const handleComplete = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const currentSlide = SLIDES[currentIndex];
  const activeVariant = hasPlayed === false ? "animate" : "static";

  return (
    <div className="flex relative w-full h-[calc(100vh-60px)] overflow-hidden bg-white px-[10px] pb-[10px]">
      <section
        className="relative overflow-hidden flex-shrink-0 flex items-center justify-center h-full transition-all duration-500 ease-in-out w-full"
        id="hero-main"
      >
        {/*
          Phase 1 — Hero Expansion (Rule #3: rounded-[24px] + overflow-hidden always present)
          hasPlayed=null → renders in "static" variant but invisible via parent wrapper
          hasPlayed=false → springs open from scale:0 (cinematic intro)
          hasPlayed=true  → instant static final state (return visit)
        */}
        <motion.div
          className="relative z-0 w-full h-full rounded-[24px] overflow-hidden"
          variants={heroVariants}
          initial={hasPlayed === false ? "initial" : false}
          animate={activeVariant}
        >
          {/* Slideshow — each slide is an absolutely-positioned div wrapping a fill Image */}
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover object-center rounded-[24px]"
                style={{ filter: "grayscale(100%) contrast(120%)" }}
                sizes="100vw"
                priority={index === 0}
              />
            </div>
          ))}

          {/* Info card — fades up after hero has expanded */}
          <motion.div
            className="absolute bottom-8 left-8 z-30 w-[272px] h-[130px] bg-black/50 backdrop-blur-2xl rounded-[24px] border border-white/10 p-4 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col justify-between"
            variants={cardVariants}
            initial={hasPlayed === false ? "initial" : false}
            animate={activeVariant}
          >
            <ProgressBars
              currentIndex={currentIndex}
              total={SLIDES.length}
              duration={5000}
              onComplete={handleComplete}
            />
            <div className="flex flex-col overflow-hidden">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="font-mono text-[8px] tracking-widest text-white bg-white/10 border border-white/20 px-2 py-0.5 rounded hover:bg-white hover:text-black transition-colors cursor-pointer shrink-0">
                  VIEW
                </span>
                <span className="font-mono text-[8px] tracking-widest text-white/60 py-0.5 shrink-0">
                  UPDATE
                </span>
              </div>
              <h4 className="font-sans text-[13px] md:text-sm font-medium leading-snug mb-1 transition-opacity duration-500 truncate w-full">
                {currentSlide.title}
              </h4>
              <div className="font-mono text-[8px] tracking-widest text-white/50 uppercase transition-opacity duration-500 truncate w-full">
                {currentSlide.tag}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
