"use client";

import { useState, useEffect, useCallback } from "react";

const PROJECTS = [
  {
    id: 1,
    title: "Ma Yansong Named Guest Editor of...",
    tag: "PUBLICATION | [TAG]",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Brutalist Concrete Structure Design",
    tag: "ARCHITECTURE | [TAG]",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Modern Minimalist Interior Space",
    tag: "INTERIOR | [TAG]",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Sustainable Urban Planning Concept",
    tag: "URBAN | [TAG]",
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop"
  }
];

function ProgressBars({ 
  currentIndex, 
  total, 
  duration, 
  onComplete 
}: { 
  currentIndex: number, 
  total: number, 
  duration: number,
  onComplete: () => void 
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();

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
              width: idx === currentIndex 
                ? `${progress}%` 
                : idx < currentIndex 
                  ? "100%" 
                  : "0%"
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleComplete = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % PROJECTS.length);
  }, []);

  const currentProject = PROJECTS[currentIndex];

  return (
    <div className="flex relative w-full h-[calc(100vh-60px)] overflow-hidden bg-white px-[10px] pb-[10px]">
      <section 
        className="relative overflow-hidden flex-shrink-0 flex items-center justify-center h-full transition-all duration-500 ease-in-out w-full" 
        id="hero-main"
      >
        <div className="relative z-0 w-full h-full rounded-[24px] overflow-hidden">
          {PROJECTS.map((project, index) => (
            <img 
              key={project.id}
              alt={project.title}
              className={`w-full h-full absolute left-0 top-0 object-cover object-center transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`} 
              src={project.image}
              style={{ filter: "grayscale(100%) contrast(120%)" }}
            />
          ))}
          
          <div className="absolute bottom-8 left-8 z-30 w-[272px] h-[130px] bg-black/50 backdrop-blur-2xl rounded-xl border border-white/10 p-4 text-white shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-in slide-in-from-left-8 duration-1000 flex flex-col justify-between">
            <ProgressBars 
              currentIndex={currentIndex} 
              total={PROJECTS.length} 
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
                {currentProject.title}
              </h4>
              <div className="font-mono text-[8px] tracking-widest text-white/50 uppercase transition-opacity duration-500 truncate w-full">
                {currentProject.tag}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
