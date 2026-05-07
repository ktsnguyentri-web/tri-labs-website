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
        fontFamily: '"Rockwell", serif',
        fontWeight: 700, // Bold
        fontSize: '32px',
        textTransform: 'lowercase',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      tri labs
    </div>
  );
}
