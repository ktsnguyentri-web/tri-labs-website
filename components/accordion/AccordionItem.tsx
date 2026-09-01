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
        className="w-full py-5 md:py-6 text-left group cursor-pointer select-none transition-colors hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50"
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 tracking-tight flex-shrink-0">
              {number}
            </span>
            <h2 className="font-sans font-medium text-base text-neutral-800 dark:text-[#EDEDED] group-hover:text-black dark:group-hover:text-white transition-colors tracking-normal truncate">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0 ml-4">
            {badge && (
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded-sm hidden sm:inline-block">
                {badge}
              </span>
            )}
            <div className="w-7 h-7 border border-neutral-200 dark:border-neutral-800 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 rounded-sm flex items-center justify-center text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors bg-black/[0.01] dark:bg-white/[0.02]">
              {isOpen ? (
                <Minus className="w-3.5 h-3.5" strokeWidth={1.5} />
              ) : (
                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
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
          <div className="border-b border-neutral-200 dark:border-neutral-800 w-full" />
        </div>
      )}
    </div>
  );
}
