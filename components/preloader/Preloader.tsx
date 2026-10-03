"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";

export function Preloader() {
  const { isLoading, isDocked, hasLoadedBefore, completePreloader } = usePreloader();
  const [hasMounted, setHasMounted] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isCounterVisible, setIsCounterVisible] = useState(true);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || hasLoadedBefore || !isLoading) return;

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
        // Step 1: Once counter hits 100%, fade out the percentage counter
        setTimeout(() => {
          setIsCounterVisible(false);
          // Step 2: Trigger morphing exit transition to Navbar
          setTimeout(() => {
            completePreloader();
          }, 80);
        }, 60);
      }
    };

    rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [hasMounted, hasLoadedBefore, isLoading, completePreloader]);

  if (!hasMounted || hasLoadedBefore) {
    return null;
  }

  // Format counter from 00% to 100%
  const formattedCounter = counter < 100 ? `${String(counter).padStart(2, "0")}%` : "100%";

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Centered Brand Text with Shared Morphing Layout ID */}
          {!isDocked && (
            <motion.span
              layoutId="brand-logo"
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
              }}
              className="font-sans font-medium text-3xl sm:text-4xl text-neutral-100 tracking-tight select-none inline-block"
            >
              tri-labs
            </motion.span>
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
