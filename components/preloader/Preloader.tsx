"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";

export function Preloader() {
  const { isLoading, isDocked, hasLoadedBefore, completePreloader } = usePreloader();
  const [counter, setCounter] = useState(0);
  const [isCounterVisible, setIsCounterVisible] = useState(true);

  useEffect(() => {
    if (hasLoadedBefore || !isLoading) return;

    const duration = 1000; // ~1.0 second
    let startTimestamp: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth architectural cubic ease-out: 1 - (1 - progress)^3
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const count = Math.min(100, Math.floor(easeOutCubic * 100));
      setCounter(count);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setCounter(100);
        // Hold for 150ms so the user sees the fully lit "tri-labs" text
        setTimeout(() => {
          // Fade out the 100% counter
          setIsCounterVisible(false);

          // Morph brand-logo into Navbar and fade out dark overlay
          completePreloader();
        }, 150);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [hasLoadedBefore, isLoading, completePreloader]);

  if (hasLoadedBefore) {
    return null;
  }

  // Format counter from 00% to 100%
  const formattedCounter = counter < 100 ? `${String(counter).padStart(2, "0")}%` : "100%";

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          id="preloader-root"
          key="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-[100] bg-[#151515] flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Centered Brand Text with Text-Fill Progress Bar & Shared Morphing Layout ID */}
          {!isDocked && (
            <motion.div
              layoutId="brand-logo"
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
              }}
              className="relative inline-block select-none"
            >
              {/* Base Layer (Unfilled): dim muted tone */}
              <span className="font-sans font-medium text-4xl sm:text-5xl text-neutral-800 dark:text-neutral-800 tracking-tight select-none block">
                tri-labs
              </span>

              {/* Foreground Layer (Filling): dynamically masked left-to-right based on counter */}
              <span
                aria-hidden="true"
                style={{ clipPath: `inset(0 ${100 - counter}% 0 0)` }}
                className="absolute inset-0 font-sans font-medium text-4xl sm:text-5xl text-neutral-100 tracking-tight select-none block"
              >
                tri-labs
              </span>
            </motion.div>
          )}

          {/* Progress Counter Directly Below */}
          <motion.span
            animate={{ opacity: isCounterVisible ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-xs text-neutral-500 tracking-widest mt-3 select-none"
          >
            {formattedCounter}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
