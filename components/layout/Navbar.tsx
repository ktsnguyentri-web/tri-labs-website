"use client";

/**
 * Navbar.tsx
 *
 * Animation behaviour — ONE-SHOT per session:
 *
 *  State machine: null → "checking" (pre-useEffect, SSR-safe)
 *                 false → "animate"  (first visit this session)
 *                 true  → "static"   (already played, instant render)
 *
 * Using null as the initial value (not false) is the critical fix:
 *  - Server renders content hidden (opacity-0 wrapper) — no mismatch.
 *  - useEffect fires client-side, sets true/false — correct state.
 *  - No lazy-initializer hydration mismatch with Next.js App Router.
 *
 * Framer Motion variants encode all three named states cleanly.
 * Rule #1 (RULES.md): bg-white, h-[60px], fixed, items-center are
 * on <nav> itself and are NEVER touched by motion props.
 */

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const SESSION_KEY = "introPlayed";

// ─── Variant Definitions ──────────────────────────────────────────────────────

/** Logo: drops down from above */
const logoVariants = {
  /** Off-screen above the navbar */
  initial: { y: -80, opacity: 0 },
  /** Springs into place — delayed to sync with Hero expansion */
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", bounce: 0.4, delay: 0.8 } as const,
  },
  /** Return visit: already at final position, zero cost */
  static: { y: 0, opacity: 1, transition: { duration: 0 } as const },
};

/** Nav link: fades + slides in from the right */
function makeLinkVariants(delaySeconds: number) {
  return {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { delay: delaySeconds, duration: 0.4, ease: "easeOut" as const },
    },
    static: { opacity: 1, x: 0, transition: { duration: 0 } as const },
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * hasPlayed tri-state:
   *  null  — not yet checked (SSR + first client render). Navbar content
   *          is opacity-0 via a wrapper to prevent flash of unstyled state.
   *  false — first visit this session → play full cinematic sequence.
   *  true  — already played this session → render in static final state.
   */
  const [hasPlayed, setHasPlayed] = useState<boolean | null>(null);

  useEffect(() => {
    // typeof window check is redundant inside useEffect (always client),
    // but kept as documentation/safety belt.
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem(SESSION_KEY)) {
      // Already played → jump to static final state immediately
      setHasPlayed(true);
    } else {
      // First visit → queue animation, mark as played
      sessionStorage.setItem(SESSION_KEY, "true");
      setHasPlayed(false);
    }
  }, []);

  const links = [
    { label: "About", href: "/#about" },
    { label: "CV", href: "/cv" },
    { label: "Work", href: "/work" },
    { label: "Research & Insights", href: "/research" },
    { label: "Contact", href: "/#contact" },
  ];

  const linkCount = links.length;

  /**
   * Resolve which Framer Motion variant name to use.
   *  null  → "static" (will be invisible via opacity-0 wrapper below)
   *  false → "animate" (play intro)
   *  true  → "static" (instant final state)
   */
  const activeVariant = hasPlayed === false ? "animate" : "static";

  return (
    <>
      {/* ── Fixed Navbar — Rule #1: bg-white, h-[60px], items-center ────── */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white h-[60px]">

        {/*
          Content wrapper: opacity-0 while hasPlayed is null (SSR / pre-check).
          This prevents a one-frame flash of the fully-visible navbar before
          we know which state to render. The <nav> h-[60px] is always present
          so layout never shifts.
        */}
        <motion.div
          className="flex h-full items-center justify-between px-6 md:px-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: hasPlayed === null ? 0 : 1 }}
          transition={{ duration: 0.05 }}
        >

          {/* ── Logo — Phase 2 Drop ─────────────────────────────────────── */}
          <motion.div
            variants={logoVariants}
            /**
             * Pass the initial variant name only when we're going to animate.
             * When hasPlayed=true or null, pass `false` so Motion treats the
             * element as already in its final position (no animation queued).
             */
            initial={hasPlayed === false ? "initial" : false}
            animate={activeVariant}
          >
            <Link
              href="/"
              className="text-lg font-bold tracking-[0.2em] text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              TRI LABS
            </Link>
          </motion.div>

          {/* ── Desktop Links — staggered right-to-left ──────────────────── */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {links.map((item, i) => {
              /*
               * Stagger: rightmost link (i = linkCount-1) fires at 1.0 s
               *          leftmost link  (i = 0)           fires at 1.4 s
               * This creates a right-to-left wave effect after the logo drop.
               */
              const staggerDelay = 1.0 + (linkCount - 1 - i) * 0.1;

              return (
                <motion.div
                  key={item.label}
                  variants={makeLinkVariants(staggerDelay)}
                  initial={hasPlayed === false ? "initial" : false}
                  animate={activeVariant}
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

          {/* ── Mobile Toggle — always visible, no entrance animation ────── */}
          <div className="block md:hidden text-black flex items-center h-full">
            <button
              className="hover:text-gray-500 transition-colors duration-200 cursor-pointer"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen
                ? <X className="w-6 h-6" strokeWidth={1.5} />
                : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>

        </motion.div>
      </nav>

      {/* ── Mobile Menu Dropdown ─────────────────────────────────────────── */}
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
