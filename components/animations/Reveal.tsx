"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Reveal.tsx — Reusable Scroll-Reveal component.
 * 
 * Animation Goal: Slide up (y: 40 to 0) and fade in (opacity: 0 to 1).
 * Trigger: whileInView, viewport={{ once: true }}.
 * Transition: 0.8s duration, easeOutExpo.
 */
export function Reveal({ children, width = "100%", delay = 0, y = 40, className }: RevealProps) {
  return (
    <motion.div
      initial={{ y: y, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1.0],
        delay: delay,
      }}
      className={className}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
}
