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
      className={className}
      style={{ 
        fontFamily: 'var(--font-titan)',
        fontWeight: 400,
        fontSize: '28px',
        textTransform: 'lowercase',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
        height: '100%'
      }}
    >
      tri-labs
    </div>
  );
}
