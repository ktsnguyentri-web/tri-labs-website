"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Framer Motion values for smooth interaction
  const mouseX = useMotionValue(50);
  const smoothMouseX = useSpring(mouseX, { 
    stiffness: isMobile ? 200 : 30, 
    damping: isMobile ? 25 : 30, 
    mass: isMobile ? 0.5 : 4 
  });
  const clipPath = useTransform(smoothMouseX, (value) => `inset(0 ${100 - value}% 0 0)`);

  // Parallax Effect (Inverse: mouse left -> image right)
  const parallaxX = useTransform(
    smoothMouseX,
    [0, 30, 50, 70, 100],
    [60, 60, 0, -60, -60]
  );

  // Main Labels: fully fade out before reaching the opposite edge
  const architectOpacity = useTransform(smoothMouseX, [0, 30, 70, 85, 100], [1, 1, 1, 0, 0]);
  const architectY = useTransform(smoothMouseX, [0, 30, 70, 85, 100], [0, 0, 0, 10, 10]);

  const coderOpacity = useTransform(smoothMouseX, [0, 15, 30, 70, 100], [0, 0, 1, 1, 1]);
  const coderY = useTransform(smoothMouseX, [0, 15, 30, 70, 100], [10, 10, 0, 0, 0]);

  // Secondary Text (Sub-text): ONLY appears at the extremes
  const architectSubOpacity = useTransform(smoothMouseX, [0, 30, 45, 100], [1, 1, 0, 0]);
  const architectSubY = useTransform(smoothMouseX, [0, 30, 45, 100], [0, 0, 10, 10]);

  const coderSubOpacity = useTransform(smoothMouseX, [0, 55, 70, 100], [0, 0, 1, 1]);
  const coderSubY = useTransform(smoothMouseX, [0, 55, 70, 100], [10, 10, 0, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    mouseX.set(newPercentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    mouseX.set(newPercentage);
  };

  const handleMouseLeave = () => {
    mouseX.set(50);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      className="relative w-full h-screen min-h-[600px] overflow-hidden cursor-ew-resize"
    >
      {hasMounted && (
        <>
          {/* BACKGROUND LAYERS */}
          <motion.div 
            className="absolute z-0"
            style={{ 
              top: 0, 
              bottom: 0, 
              left: "-60px", 
              right: "-60px", 
              x: parallaxX 
            }}
          >
            {/* Background layer: Coder (Right) */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <Image
                src="/coder.jpeg"
                alt="Coder"
                fill
                className="object-cover object-[center_25%] scale-[1.3] md:scale-100 transition-transform duration-700"
                priority
              />
            </div>

            {/* Foreground layer: Architect (Left) — clipped */}
            <motion.div
              className="absolute inset-0 pointer-events-none select-none"
              style={{ clipPath }}
            >
              <Image
                src="/architect.jpeg"
                alt="Architect"
                fill
                className="object-cover object-[center_25%] scale-[1.3] md:scale-100 transition-transform duration-700"
                priority
              />
            </motion.div>
          </motion.div>

          {/* OVERLAY CONTENT */}
          <div className="relative z-10 w-full h-full flex flex-col pt-[60px] pointer-events-none">
            
            <div className="flex-1 flex flex-col items-center justify-between py-10 md:py-20 max-w-[1440px] mx-auto w-full px-6 md:px-10 pb-20 md:pb-20">
              <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mt-4 md:mt-10 flex-1">
                {/* LEFT LABEL — architect */}
                <motion.div
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                  className="select-none flex flex-col items-start"
                >
                  <motion.div style={{ opacity: architectOpacity, y: architectY }}>
                    <span
                      className="font-sans font-light tracking-tight text-white/50 lowercase leading-none"
                      style={{ fontSize: "clamp(48px, 10vw, 120px)" }}
                    >
                      architect
                    </span>
                  </motion.div>
                  <motion.div 
                    style={{ opacity: architectSubOpacity, y: architectSubY }}
                    className="mt-2 md:mt-3 overflow-hidden"
                  >
                    <p className="font-sans text-[10px] md:text-sm text-white/50 tracking-widest uppercase">
                      Spatial & Structural Design
                    </p>
                  </motion.div>
                </motion.div>

                {/* RIGHT LABEL — coder */}
                <motion.div
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                  className="select-none flex flex-col items-end text-right mt-auto md:mt-0 pb-10 md:pb-0"
                >
                  <motion.div style={{ opacity: coderOpacity, y: coderY }}>
                    <span
                      className="font-sans font-light tracking-tight text-white/50 lowercase leading-none"
                      style={{ fontSize: "clamp(48px, 10vw, 120px)" }}
                    >
                      coder
                    </span>
                  </motion.div>
                  <motion.div 
                    style={{ opacity: coderSubOpacity, y: coderSubY }}
                    className="mt-2 md:mt-3 overflow-hidden"
                  >
                    <p className="font-sans text-[10px] md:text-sm text-white/50 tracking-widest uppercase">
                      Creative & Frontend Engineering
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">
              Scroll
            </span>
          </motion.div>
        </>
      )}
    </section>
  );
}
