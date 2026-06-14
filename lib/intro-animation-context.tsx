"use client";

/**
 * IntroAnimationContext
 *
 * Shared context that gates the cinematic entrance animation to the
 * FIRST page load in each browser session (sessionStorage-based).
 *
 * Key design decision — synchronous lazy initializer:
 *   useState(() => { ... }) runs synchronously on the very first client
 *   render, BEFORE the component paints. This eliminates the two-render
 *   "flash" that a useEffect approach causes (render fully-visible → animate
 *   from hidden). There is no intermediate null/unknown state.
 *
 * SSR behaviour:
 *   On the server, `typeof window === 'undefined'` → returns false.
 *   The first client render then executes the initializer synchronously
 *   and gets the correct value, so hydration is seamless.
 *
 * Session persistence:
 *   The sessionStorage key `tri_labs_intro_played` is written
 *   synchronously during the initializer so that any other component
 *   mounting in the same tick also sees `false` from the context if
 *   they mounted after the key was written (they share this provider).
 */

import { createContext, useContext, useState, ReactNode } from "react";

const SESSION_KEY = "tri_labs_intro_played";

interface IntroAnimationContextValue {
  /** true = first visit this session → play full cinematic intro.
   *  false = already played → render all components at their final
   *          visible state immediately, zero animation overhead. */
  shouldAnimate: boolean;
}

const IntroAnimationContext = createContext<IntroAnimationContextValue>({
  shouldAnimate: false,
});

export function IntroAnimationProvider({ children }: { children: ReactNode }) {
  /**
   * Lazy initializer — runs ONCE, synchronously, before first paint.
   * No useEffect needed. No flash. No null state.
   */
  const [shouldAnimate] = useState<boolean>(() => {
    // Guard for SSR — sessionStorage is browser-only
    if (typeof window === "undefined") return false;

    if (!sessionStorage.getItem(SESSION_KEY)) {
      // First visit this session: mark it immediately so subsequent
      // consumers in the same render tree all read shouldAnimate=false
      // from the context (only this provider returns true, once).
      sessionStorage.setItem(SESSION_KEY, "1");
      return true;
    }

    return false; // Already played this session
  });

  return (
    <IntroAnimationContext.Provider value={{ shouldAnimate }}>
      {children}
    </IntroAnimationContext.Provider>
  );
}

/** Consume in any client component that needs to know whether to animate. */
export function useIntroAnimation() {
  return useContext(IntroAnimationContext);
}
