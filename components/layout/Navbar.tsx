"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
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

  const { scrollY } = useScroll();

  useEffect(() => {
    setHasMounted(true);
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

  const isCVPage = pathname === "/cv";
  const isLight = isCVPage;

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
    { label: "Projects", href: "/work" },
    { label: "Ideas", href: "/research" },
    { label: "Tool", href: "/tool" },
    { label: "About", href: "/cv" },
  ];

  // Prevent hydration mismatch: render a static shell on server/first-pass
  if (!hasMounted) {
    return (
      <nav className={`fixed top-0 left-0 w-full z-50 ${isLight ? "bg-white/50" : "bg-black/50"} backdrop-blur-md h-[60px] px-4 md:px-10`}>
        <div className="flex h-full items-center justify-between max-w-[1440px] mx-auto w-full opacity-0">
          <Logo className={isLight ? "text-black" : "text-foreground"} />
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
        className={`fixed top-0 left-0 w-full z-50 ${isLight ? "bg-white/50 text-black" : "bg-black/50 text-white"} backdrop-blur-md h-[60px] px-4 md:px-10`}
      >
        <div className="flex h-full items-center justify-between max-w-[1440px] mx-auto w-full relative">
          
          {/* 1. Left Section: Logo */}
          <div className="flex-1 flex justify-start">
            <motion.div
              variants={logoVariants}
              initial={shouldAnimate ? "initial" : "static"}
              animate={shouldAnimate ? "animate" : "static"}
            >
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Logo className={isLight ? "text-black" : "text-foreground"} />
              </Link>
            </motion.div>
          </div>

          {/* 2. Center Section: Desktop Menu */}
          <motion.div 
            className="hidden md:flex gap-10 items-center justify-center flex-1 h-full"
            variants={menuContainerVariants}
            initial={shouldAnimate ? "initial" : "static"}
            animate={shouldAnimate ? "animate" : "static"}
          >
            {links.map((item) => (
              <motion.div key={item.label} variants={menuItemVariants}>
                <Link
                  href={item.href}
                  className={`label-caps normal-case text-[13px] font-normal ${isLight ? "text-black/60 hover:text-black" : "text-foreground/60 hover:text-foreground"} transition-all duration-300 hover:tracking-[0.3em]`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* 3. Right Section: Search + Language + Mobile Toggle */}
          <div className="flex-1 flex justify-end items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <button className={`${isLight ? "text-black/60 hover:text-black" : "text-foreground/60 hover:text-foreground"} transition-colors cursor-pointer`} aria-label="Search">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <button className={`label-caps text-[11px] ${isLight ? "text-black/60 hover:text-black" : "text-foreground/60 hover:text-foreground"} transition-colors cursor-pointer`}>
                VN / EN
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className={`block md:hidden ${isLight ? "text-black" : "text-foreground"} flex items-center h-full`}>
              <button
                className="hover:opacity-60 transition-colors duration-200 cursor-pointer"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown — Solid Opaque per Rule 1 */}
      <div
        className={`fixed inset-0 z-40 ${isLight ? "bg-white" : "bg-black"} transition-opacity duration-300 md:hidden ${
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
              className={`font-sans text-2xl ${isLight ? "text-black hover:text-black/60" : "text-foreground hover:text-foreground/60"} transition-colors duration-300`}
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



