"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const SESSION_KEY = "intro_played";

/**
 * Navbar.tsx — One-time cinematic entrance per session.
 * 
 * Rules Adherence:
 * - Rule #1: Navbar height is exactly 60px, bg-white.
 * - Flicker Prevention: Content is opacity: 0 until hasMounted is true.
 */

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const played = sessionStorage.getItem(SESSION_KEY);
    const firstTime = !played;
    if (firstTime) {
      setIsFirstTime(true);
      sessionStorage.setItem(SESSION_KEY, "true");
    }
    console.log('Intro Playing:', firstTime);
  }, []);

  const links = [
    { label: "About", href: "/#about" },
    { label: "CV", href: "/cv" },
    { label: "Work", href: "/work" },
    { label: "Research & Insights", href: "/research" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      {/* Rule #1: bg-white, h-[60px], fixed */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white h-[60px]">
        {/* Flicker prevention: Only show content when mounted */}
        <div className={`flex h-full items-center justify-between px-6 md:px-12 transition-opacity duration-300 ${hasMounted ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Logo Drop-down (One-time animation) */}
          <motion.div
            initial={isFirstTime ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            transition={isFirstTime ? { type: "spring", bounce: 0.4, delay: 1.0 } : { duration: 0 }}
          >
            <Link
              href="/"
              className="text-lg font-bold tracking-[0.2em] text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              TRI LABS
            </Link>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {links.map((item, i) => (
              <motion.div
                key={item.label}
                initial={isFirstTime ? { opacity: 0 } : { opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={isFirstTime ? { delay: 0.8 + i * 0.1 } : { duration: 0 }}
              >
                <Link
                  href={item.href}
                  className="font-sans text-sm text-gray-500 hover:text-black transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
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
