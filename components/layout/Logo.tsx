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
      className={`flex items-center gap-2 select-none font-mono text-xs tracking-[0.25em] uppercase text-foreground/70 hover:text-foreground transition-colors ${className || ""}`}
    >
      <span className="font-semibold text-foreground">TNM.</span>
      <span className="text-foreground/30 text-[10px] hidden sm:inline-block">/ STUDIO</span>
    </div>
  );
}
