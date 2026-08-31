"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface AccordionItemProps {
  id: string;
  number: string;
  title: string;
  badge?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hideBottomDivider?: boolean;
}

export function AccordionItem({
  id,
  number,
  title,
  badge,
  isOpen,
  onToggle,
  children,
  hideBottomDivider = false,
}: AccordionItemProps) {
  return (
    <div className="w-full transition-colors duration-300">
      {/* ── Section Trigger Bar (Constrained to max-w-3xl) ─────── */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        className="w-full py-5 md:py-6 text-left group cursor-pointer select-none transition-colors"
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-5 min-w-0">
            <span className="font-mono text-xs md:text-sm text-neutral-500 tracking-[0.2em] flex-shrink-0">
              {number}
            </span>
            <h2 className="font-sans font-medium text-sm sm:text-base md:text-lg text-neutral-200 group-hover:text-white transition-colors tracking-[0.15em] uppercase truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0 ml-4">
            {badge && (
              <span className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-white/40 border border-white/10 px-2 md:px-2.5 py-0.5 hidden sm:inline-block">
                {badge}
              </span>
            )}
            <div className="w-7 h-7 md:w-8 md:h-8 border border-white/10 group-hover:border-white/40 flex items-center justify-center text-white transition-colors bg-white/[0.02]">
              {isOpen ? (
                <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={1.5} />
              ) : (
                <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={1.5} />
              )}
            </div>
          </div>
        </div>
      </button>

      {/* ── Animated Drawer Content ──────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-content-${id}`}
            key={`content-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-10 md:pb-14">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Divider Line (Constrained to inner grid) ──────── */}
      {!hideBottomDivider && (
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 w-full">
          <div className="border-b border-white/10 w-full" />
        </div>
      )}
    </div>
  );
}
