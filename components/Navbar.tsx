"use client";

import { useEffect } from "react";
import { Menu, Search, X } from "lucide-react";
import { useMenu } from "./MenuContext";
import Link from "next/link";

export function Navbar() {
  const { isMenuOpen, setIsMenuOpen } = useMenu();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const links = [
    { label: "PROJECTS", href: "/work" },
    { label: "NEWS", href: "/#news" },
    { label: "CV", href: "/cv" },
    { label: "CONTACT", href: "/#contact" }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none pb-[80px]">
        <div className="flex justify-between items-center px-[20px] h-[40px]">
          <Link href="/" className="text-lg font-bold tracking-[0.2em] text-black pointer-events-auto" onClick={() => setIsMenuOpen(false)}>
            TRI NGUYEN
          </Link>
          <div className="flex items-center gap-4 pointer-events-auto text-black">
            <button 
              className="hover:text-accent transition-colors duration-200 cursor-pointer" 
              aria-label="Search"
            >
              <Search className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button 
              className="hover:text-accent transition-colors duration-200 cursor-pointer" 
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-8 h-8" strokeWidth={1.5} /> : <Menu className="w-8 h-8" strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Global Menu Wrapper (Traps all interaction/scroll) */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-500 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Split-Screen Menu Panel */}
        <div 
          className={`absolute top-0 right-0 h-screen w-full md:w-1/2 bg-white transition-transform duration-500 ease-in-out flex flex-col p-12 lg:p-24 justify-center shadow-2xl ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the panel
        >
          <div className="flex flex-col gap-8">
            {links.map((item) => (
              <Link 
                key={item.label} 
                href={item.href}
                className="text-4xl md:text-5xl lg:text-7xl font-light hover:text-accent transition-colors tracking-tighter"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="absolute bottom-12 left-12 lg:left-24 flex gap-6">
            {["INSTAGRAM", "LINKEDIN", "TWITTER"].map((social) => (
              <a key={social} href="#" className="font-mono text-xs tracking-widest hover:text-accent transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
