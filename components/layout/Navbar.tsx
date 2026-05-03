"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useIntroAnimation } from "@/lib/intro-animation-context";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { shouldAnimate } = useIntroAnimation();

  const links = [
    { label: "About", href: "/#about" },
    { label: "CV", href: "/cv" },
    { label: "Work", href: "/work" },
    { label: "Research & Insights", href: "/research" },
    { label: "Contact", href: "/#contact" },
  ];

  /*
   * Timing design:
   *  0.0s  — Hero starts expanding (spring)
   *  0.8s  — Logo drops in (spring with bounce) — hero is ~65% expanded
   *  1.0s  — First nav link fades in from right
   *  1.1s … 1.5s — Remaining links stagger in, right-to-left order
   *
   * On return visits (shouldAnimate=false) everything renders at its
   * final state instantly — no layout shift, no jank.
   */

  // Links are displayed LTR but stagger right-to-left so we reverse indices
  const linkCount = links.length;

  return (
    <>
      {/* Fixed nav — Rule #1: bg-white, exact h-[60px], items-center */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white h-[60px]">
        <div className="flex h-full items-center justify-between px-6 md:px-12">

          {/* Phase 2 — Logo Drop */}
          <motion.div
            initial={shouldAnimate ? { y: -100, opacity: 0 } : false}
            animate={{ y: 0, opacity: 1 }}
            transition={
              shouldAnimate
                ? { type: "spring", bounce: 0.4, delay: 0.8, duration: 0.8 }
                : { duration: 0 }
            }
          >
            <Link
              href="/"
              className="text-lg font-bold tracking-[0.2em] text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              TRI LABS
            </Link>
          </motion.div>

          {/* Desktop Links — staggered fade-in, right-to-left */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {links.map((item, i) => {
              // Rightmost link (i = linkCount-1) gets delay 1.0s
              // Leftmost link (i = 0) gets delay 1.0 + (linkCount-1)*0.1s
              const staggerDelay = 1.0 + (linkCount - 1 - i) * 0.1;

              return (
                <motion.div
                  key={item.label}
                  initial={shouldAnimate ? { opacity: 0, x: 20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={
                    shouldAnimate
                      ? { delay: staggerDelay, duration: 0.4, ease: "easeOut" }
                      : { duration: 0 }
                  }
                >
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-gray-500 hover:text-black transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Toggle — no animation needed, always visible */}
          <div className="block md:hidden text-black flex items-center h-full">
            <button
              className="hover:text-gray-500 transition-colors duration-200 cursor-pointer"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`flex flex-col items-center justify-center h-full gap-8 transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-y-0" : "-translate-y-8"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-sans text-2xl text-black hover:text-gray-500 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
