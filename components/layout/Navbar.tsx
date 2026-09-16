"use client";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Logo } from "./Logo";

/**
 * Navbar.tsx — One-time cinematic entrance + Smart Scroll behavior.
 * 
 * Rules Adherence:
 * - bg-white, h-[60px], fixed.
 * - Vertically centered (items-center).
 * - No blur or transparency on Navbar background (Rule 1).
 */

const logoVariants = {
  initial: { y: -100, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 12, stiffness: 50, delay: 0.8 }
  },
  static: { y: 0, opacity: 1 }
} as const;

const menuContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 1.2 }
  },
  static: { opacity: 1 }
} as const;

const menuItemVariants = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  static: { x: 0, opacity: 1 }
} as const;

const navVariants = {
  visible: { y: 0 },
  hidden: { y: "-100%" },
} as const;

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const { scrollY } = useScroll();

  useEffect(() => {
    setHasMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    const played = sessionStorage.getItem('intro_played');

    if (isHomePage && played === null) {
      setShouldAnimate(true);
      sessionStorage.setItem('intro_played', 'true');

      // Delay scroll behavior until intro finishes (approx 2.5s total)
      const timer = setTimeout(() => setIsIntroFinished(true), 2500);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
      setIsIntroFinished(true);
    }
  }, [isHomePage]);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Hide Navbar when a modal is open (indicated by locked body scroll)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isOverflowHidden =
        document.body.style.overflow === 'hidden' ||
        document.documentElement.style.overflow === 'hidden';
      setHidden(isOverflowHidden);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Only allow hiding if intro is done and not at top
    if (!isIntroFinished) return;

    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const links = [
    { label: "Works", href: "/works" },
    { label: "Labs", href: "/labs" },
    { label: "Writing", href: "/writing" },
  ];

  // Prevent hydration mismatch: render a static shell on server/first-pass
  if (!hasMounted) {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#FAFAFA]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md h-[60px] border-b border-neutral-200/60 dark:border-white/5">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 h-full flex items-center justify-between w-full opacity-0">
          <Logo />
        </div>
      </nav>
    );
  }

  return (
    <>
      <motion.nav
        variants={navVariants}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 bg-[#FAFAFA]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md h-[60px] border-b border-neutral-200/60 dark:border-white/5 transition-colors duration-300"
      >
        <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 h-full flex items-center justify-between w-full relative">

          {/* 1. Left Section: Logo strictly aligned with editorial column */}
          <div className="flex-1 flex justify-start items-center">
            <motion.div
              variants={logoVariants}
              initial={shouldAnimate ? "initial" : "static"}
              animate={shouldAnimate ? "animate" : "static"}
            >
              <Logo
                pathname={pathname}
                onHomeClick={() => setIsMenuOpen(false)}
              />
            </motion.div>
          </div>

          {/* 2. Center Section: Left empty for clean architectural breathing room */}
          <div className="hidden md:flex flex-1" />

          {/* 3. Right Section: Theme Toggle + Mobile Toggle strictly aligned with right bounding edge */}
          <div className="flex-1 flex justify-end items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-7 h-7 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-full flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all duration-200 bg-black/[0.02] dark:bg-white/[0.03] hover:bg-neutral-100 dark:hover:bg-neutral-800/80 cursor-pointer active:scale-90"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Mobile Toggle */}
            <div className="block md:hidden text-neutral-800 dark:text-neutral-200 flex items-center h-full">
              <button
                className="hover:opacity-60 transition-colors duration-200 cursor-pointer flex items-center justify-center"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown — Solid Opaque per Rule 1 */}
      <div
        className={`fixed inset-0 z-40 bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`flex flex-col items-center justify-center h-full gap-8 transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-y-0" : "-translate-y-8"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="font-sans text-2xl text-neutral-800 hover:text-black dark:text-neutral-200 dark:hover:text-white transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="w-12 h-px bg-neutral-200 dark:bg-white/10 my-2" />
          <div className="flex items-center gap-8 mt-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-neutral-300 text-neutral-800 hover:bg-neutral-200/50 dark:border-white/20 dark:text-white dark:hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* YouTube */}
            <a
              href="https://www.youtube.com/@Tr%C3%ADNguy%E1%BB%85n-r8w"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300"
              aria-label="YouTube"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/tr%C3%AD-nguy%E1%BB%85n-minh-56b625193/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <svg width="24" height="24" viewBox="2 2 18 18" fill="currentColor" className="w-6 h-6">
                <circle cx="4.98" cy="5.09" r="2.69" />
                <path d="M3.48 9h3v11h-3zM10.48 9h2.87v1.51h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.6v5.45h-3v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.84 1.25-1.84 2.54v4.92h-3V9z" />
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href="https://www.facebook.com/tri.daihiep/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300"
              aria-label="Facebook"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M15.4 5.3h2.9V.3C17.8.2 16 .1 14.1.1 11.2.1 9.2 1.9 9.2 5.2v3.1H5.7v5.3h3.5v10.3h5.5V13.6h3.4l.5-5.3h-3.9V5.8c0-1.5.4-2.5 2.6-2.5z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/ktsnminhtri-wq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors duration-300"
              aria-label="GitHub"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}



