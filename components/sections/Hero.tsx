"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { HeroSlide } from "@/types/cms";

const SESSION_KEY = "hasSeenHeroAnim";

const SLIDES: HeroSlide[] = [
  {
    id: 0,
    title: "Chavana Boutique Hotel",
    tag: "ARCHITECTURE | RENOVATION",
    image: "/images/projects/chavana/front.jpg",
    href: "/work/chavana-boutique-hotel",
  },
  {
    id: 1,
    title: "Ma Yansong Named Guest Editor of...",
    tag: "PUBLICATION | [TAG]",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
    href: "/research/3d-as-code",
  },
  {
    id: 2,
    title: "Brutalist Concrete Structure Design",
    tag: "ARCHITECTURE | [TAG]",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    href: "/work/harbin-opera-house",
  },
  {
    id: 3,
    title: "Modern Minimalist Interior Space",
    tag: "INTERIOR | [TAG]",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    href: "/work/sky-villa",
  },
  {
    id: 4,
    title: "Sustainable Urban Planning Concept",
    tag: "URBAN | [TAG]",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop",
    href: "/research/streaming-3dgs-worlds",
  },
];

function DotsIndicator({
  currentIndex,
  total,
  duration,
  onComplete,
  onDotClick,
}: {
  currentIndex: number;
  total: number;
  duration: number;
  onComplete: () => void;
  onDotClick: (index: number) => void;
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
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
      {Array.from({ length: total }).map((_, idx) => (
        <div 
          key={idx} 
          onClick={() => onDotClick(idx)}
          className="relative flex items-center justify-center w-6 h-6 cursor-pointer group"
        >
          {idx === currentIndex ? (
            <>
              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeDasharray="63"
                  strokeDashoffset={63 - (progress / 100) * 63}
                  className="transition-all duration-100 ease-linear"
                />
              </svg>
              {/* Inner Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </>
          ) : (
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx < currentIndex ? 'bg-white' : 'bg-white/40'} group-hover:bg-white/80 group-hover:scale-150`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const played = sessionStorage.getItem(SESSION_KEY);
    const firstTime = !played;
    if (firstTime) {
      setIsFirstTime(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }
  }, []);

  const handleComplete = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className={`relative w-full h-screen transition-opacity duration-300 ${hasMounted ? 'opacity-100' : 'opacity-0'}`}>
      <section
        className="relative overflow-hidden flex items-center justify-center h-full w-full"
        id="hero-main"
      >
        {hasMounted && (
          <motion.div
            className="relative z-0 w-full h-full overflow-hidden"
            initial={isFirstTime ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={isFirstTime ? {
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1] 
            } : { duration: 0 }}
          >
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover object-center"
                  style={{ filter: "contrast(110%)" }}
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Subtle Gradient Bottom */}
            <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 pointer-events-none" />

            <DotsIndicator 
              currentIndex={currentIndex}
              total={SLIDES.length}
              duration={5000}
              onComplete={handleComplete}
              onDotClick={setCurrentIndex}
            />

            {/* Scroll Down Indicator */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center gap-4">
               <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 w-full h-full bg-white"
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
               </div>
               <span className="font-mono text-[8px] tracking-[0.3em] text-white/40 uppercase rotate-90 mt-8">
                 Scroll
               </span>
            </div>

            {/* Info card — Clean Text Style */}
            <motion.div
              className="absolute bottom-12 left-10 z-30 max-w-[33vw] text-white flex flex-col"
              initial={isFirstTime ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={isFirstTime ? { 
                delay: 1.0, 
                duration: 0.8, 
                ease: [0.16, 1, 0.3, 1] 
              } : { duration: 0 }}
            >
              <div className="flex flex-col gap-1.5">
                <Link 
                  href={currentSlide.href || "#"}
                  className="group block cursor-pointer"
                >
                  <div className="font-mono text-[7px] tracking-[0.25em] text-white/50 uppercase mb-1.5 group-hover:text-white transition-colors">
                    {currentSlide.tag.split('|')[0].trim() || "News"}
                  </div>
                  <h4 className="font-sans text-[18px] md:text-[24px] font-medium leading-[1.15] tracking-tight transition-all duration-300 group-hover:text-white/80">
                    {currentSlide.title}
                  </h4>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
