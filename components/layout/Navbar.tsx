"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const SESSION_KEY = "introPlayed";

/**
 * Navbar.tsx — Cinematic Entrance (Safety-First Logic)
 * 
 * 1. Mount Check: uses hasMounted to ensure sessionStorage is only accessed client-side.
 * 2. Animation Logic: plays only once per session via introPlayed key.
 * 3. Static States: avoids flickering by rendering the static final state during SSR/Hydration.
 */

const logoVariants: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", bounce: 0.4, delay: 0.8 },
  },
  static: { y: 0, opacity: 1 },
};

function makeLinkVariants(delaySeconds: number): Variants {
  return {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { delay: delaySeconds, duration: 0.4, ease: "easeOut" },
    },
    static: { opacity: 1, x: 0 },
  };
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const introPlayed = sessionStorage.getItem(SESSION_KEY);
    if (!introPlayed) {
      setShouldAnimate(true);
      sessionStorage.setItem(SESSION_KEY, "true");
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

  // Determine variant based on state
  // During hydration (hasMounted is false), we show the "static" state to avoid flicker
  const activeVariant = shouldAnimate ? "animate" : "static";
  const initialVariant = shouldAnimate ? "initial" : false;

  return (
    <>
      {/* Rule #1: bg-white, h-[60px], fixed, items-center */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white h-[60px]">
        <div className="flex h-full items-center justify-between px-6 md:px-12">
          
          {/* Logo Drop-down */}
          <motion.div
            variants={logoVariants}
            initial={initialVariant}
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

          {/* Desktop Links - Staggered */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {links.map((item, i) => {
              const staggerDelay = 1.0 + (linkCount - 1 - i) * 0.1;
              return (
                <motion.div
                  key={item.label}
                  variants={makeLinkVariants(staggerDelay)}
                  initial={initialVariant}
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

          {/* Mobile Toggle */}
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
