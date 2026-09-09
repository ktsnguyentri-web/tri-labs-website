"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface AccordionItemProps {
  id: string;
  number: string;
  title: string;
  href?: string;
  isDirectLink?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  hideBottomDivider?: boolean;
}

export function AccordionItem({
  id,
  number,
  title,
  href,
  isDirectLink = false,
  isOpen = false,
  onToggle,
  children,
  hideBottomDivider = false,
}: AccordionItemProps) {
  // Direct Link Row (e.g. 04. About)
  if (isDirectLink && href) {
    return (
      <div className="w-full transition-colors duration-300">
        <Link
          href={href}
          className="w-full py-4 sm:py-5 flex items-center justify-between group cursor-pointer select-none transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20"
        >
          <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 flex items-center justify-between w-full">
            <div className="flex items-center min-w-0">
              <span className="font-mono text-xs text-neutral-400 mr-4 flex-shrink-0">
                {number}
              </span>
              <h2 className="font-sans text-base sm:text-lg font-normal tracking-normal text-neutral-900 dark:text-neutral-100 truncate transition-colors group-hover:text-neutral-600 dark:group-hover:text-neutral-100">
                {title}
              </h2>
            </div>

            {/* Far-Right Action Icon with VIEW ALL tooltip */}
            <div className="relative group/link flex items-center justify-center p-1 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
              <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-2 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-neutral-400 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded opacity-0 group-hover/link:opacity-100 transition-opacity duration-150 whitespace-nowrap select-none shadow-sm">
                VIEW ALL
              </span>
            </div>
          </div>
        </Link>

        {/* ── Bottom Divider Line ─────────────────────────────────── */}
        {!hideBottomDivider && (
          <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 w-full">
            <div className="border-b border-neutral-200 dark:border-neutral-800 w-full" />
          </div>
        )}
      </div>
    );
  }

  // Dual-Action Collapsible Row (Works, Labs, Writing)
  return (
    <div className="w-full transition-colors duration-300">
      {/* ── Section Trigger Bar (Constrained to max-w-3xl) ─────── */}
      <div className="w-full group hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Main Row Area (Click anywhere): Toggles accordion preview */}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={`accordion-content-${id}`}
            className="flex-1 py-4 sm:py-5 flex items-center min-w-0 text-left cursor-pointer select-none transition-colors"
          >
            <span className="font-mono text-xs text-neutral-400 mr-4 flex-shrink-0">
              {number}
            </span>
            <h2 className="font-sans text-base sm:text-lg font-normal tracking-normal text-neutral-900 dark:text-neutral-100 truncate transition-colors group-hover:text-neutral-600 dark:group-hover:text-neutral-100">
              {title}
            </h2>
          </button>

          {/* Far-Right Action: Dedicated subpage link with VIEW ALL tooltip */}
          {href && (
            <div className="flex items-center flex-shrink-0 ml-4">
              <Link
                href={href}
                onClick={(e) => e.stopPropagation()}
                className="group/link relative flex items-center justify-center p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                aria-label={`View all ${title}`}
              >
                <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                <span className="pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-2 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-neutral-400 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded opacity-0 group-hover/link:opacity-100 transition-opacity duration-150 whitespace-nowrap select-none shadow-sm">
                  VIEW ALL
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>

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
