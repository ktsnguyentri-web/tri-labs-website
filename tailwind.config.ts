import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'on-surface-variant': '#4C4546',
        'background': '#000000',
        'card': '#000000',
        'popover': '#000000',
        'secondary': '#000000',
        'muted': '#000000',
      },
      fontSize: {
        'display-2xl': ['144px', { lineHeight: '1.0', letterSpacing: '-0.04em', fontWeight: '700' }],
        'display-xl': ['96px', { lineHeight: '1.0', letterSpacing: '-0.04em', fontWeight: '300' }],
        'heading-lg': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'body-md': ['16px', { lineHeight: '1.625', fontWeight: '400' }],
        'data-mono': ['11px', { letterSpacing: '0.2em', fontWeight: '400' }],
        'label-caps': ['11px', { letterSpacing: '0.2em', fontWeight: '700' }],
      },
      letterSpacing: {
        'architectural': '-0.04em',
        'foster': '0.2em',
      },
      lineHeight: {
        'relaxed-premium': '1.625',
      },
      borderRadius: {
        'architectural': '12px',
      }
    },
  },
  plugins: [],
} satisfies Config;
