"use client";

import React from "react";

interface LogoProps {
  className?: string;
}

/**
 * Logo component rendering the text "tri" in American Typewriter font.
 */
export function Logo({ className }: LogoProps) {
  return (
    <div 
      className={`flex items-center gap-2 select-none font-sans text-sm tracking-tight text-neutral-900 dark:text-neutral-100 hover:opacity-80 transition-opacity ${className || ""}`}
    >
      <span className="font-semibold text-neutral-900 dark:text-white">tri-labs</span>
      <span className="text-neutral-400 dark:text-neutral-600 text-xs font-normal hidden sm:inline-block">/ studio</span>
    </div>
  );
}
