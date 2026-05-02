"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { label: "About", href: "/#about" },
    { label: "CV", href: "/cv" },
    { label: "Work", href: "/work" },
    { label: "Research & Insights", href: "/research" },
    { label: "Contact", href: "/#contact" }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white h-[60px]">
        <div className="flex h-full items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-[0.2em] text-black"
            onClick={() => setIsMenuOpen(false)}
          >
            TRI LABS
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8 items-center h-full">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-sans text-sm text-gray-500 hover:text-black transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
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
        className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
