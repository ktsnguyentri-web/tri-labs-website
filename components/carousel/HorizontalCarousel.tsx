"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HorizontalCarouselProps {
  children: React.ReactNode;
  totalItems: number;
}

export function HorizontalCarousel({ children, totalItems }: HorizontalCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dynamic circular arrow cursor direction ("left" | "right")
  const [cursorDirection, setCursorDirection] = useState<"left" | "right">("right");
  const cursorDirectionRef = useRef<"left" | "right">("right");

  // Drag-to-scroll & momentum physics state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const hasDraggedRef = useRef(false);
  const [, setIsDragging] = useState(false);

  // Audio feedback state
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevIndexRef = useRef(0);
  const isInitializedRef = useRef(false);

  // ── Web Audio API: Synthesized tactile mechanical click ──────
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  const playMechanicalClick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // High-grade tactile mechanical click (similar to a luxury camera dial or Apple Watch crown)
      osc.type = "sine";
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.015);

      // Delicate, non-fatiguing volume envelope
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.016);
    } catch {
      // Gracefully handle browser autoplay policies
    }
  }, [getAudioContext]);

  // ── Update scroll position & active index ────────────────────
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active index accurately based on child cards offset
    const childrenNodes = Array.from(el.children) as HTMLElement[];
    if (childrenNodes.length > 0) {
      const elOffsetLeft = el.offsetLeft;
      let closestIdx = 0;
      let minDiff = Infinity;

      childrenNodes.forEach((child, idx) => {
        const childLeft = child.offsetLeft - elOffsetLeft;
        const diff = Math.abs(childLeft - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      const clampedIndex = Math.min(Math.max(0, closestIdx), totalItems - 1);
      if (clampedIndex !== prevIndexRef.current) {
        if (isInitializedRef.current) {
          playMechanicalClick();
        }
        prevIndexRef.current = clampedIndex;
        setCurrentIndex(clampedIndex);
      }
    }
  }, [totalItems, playMechanicalClick]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    // Allow sound only after initial mount positioning is completed
    const initTimer = setTimeout(() => {
      isInitializedRef.current = true;
    }, 150);

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      clearTimeout(initTimer);
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
      if (typeof document !== "undefined") {
        document.body.classList.remove("cursor-arrow-left", "cursor-arrow-right");
      }
    };
  }, [updateScrollState]);

  // ── Manual Navigation (Left / Right Arrows) ─────────────────
  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    el.style.scrollSnapType = "";
    el.style.scrollBehavior = "";

    // Wake audio context on button interaction
    getAudioContext();

    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // ── Track Hover Cursor Direction (Left vs Right) ─────────────
  const handleTrackMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) return;
    const el = scrollRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const newDir: "left" | "right" = relX < rect.width * 0.5 ? "left" : "right";

    if (newDir !== cursorDirectionRef.current) {
      cursorDirectionRef.current = newDir;
      setCursorDirection(newDir);
    }
  };

  // ── Drag & Momentum Handlers ────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only primary mouse button (left click)
    if (e.button !== 0) return;

    const el = scrollRef.current;
    if (!el) return;

    // Cancel any active momentum animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Wake up audio context on user gesture
    getAudioContext();

    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftStartRef.current = el.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    setIsDragging(true);
    if (typeof document !== "undefined") {
      document.body.classList.remove("cursor-arrow-left", "cursor-arrow-right");
      document.body.classList.add(
        cursorDirectionRef.current === "left" ? "cursor-arrow-left" : "cursor-arrow-right"
      );
    }

    // Disable CSS snap and smooth scrolling during drag to prevent stuttering
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";

    // Bind global listeners so mouse movements outside the container are captured
    const handleGlobalMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const container = scrollRef.current;
      if (!container) return;

      const currentX = moveEvent.pageX;
      const delta = currentX - startXRef.current;

      if (Math.abs(delta) > 5) {
        hasDraggedRef.current = true;
      }

      const now = performance.now();
      const dt = now - lastTimeRef.current;
      if (dt > 8) {
        const dx = currentX - lastXRef.current;
        // Velocity in px/ms (negative because moving mouse right scrolls left)
        velocityRef.current = -dx / dt;
        lastXRef.current = currentX;
        lastTimeRef.current = now;

        // Dynamically change cursor arrow direction based on dragging movement
        if (dx < -2 && cursorDirectionRef.current !== "left") {
          cursorDirectionRef.current = "left";
          setCursorDirection("left");
          if (typeof document !== "undefined") {
            document.body.classList.remove("cursor-arrow-right");
            document.body.classList.add("cursor-arrow-left");
          }
        } else if (dx > 2 && cursorDirectionRef.current !== "right") {
          cursorDirectionRef.current = "right";
          setCursorDirection("right");
          if (typeof document !== "undefined") {
            document.body.classList.remove("cursor-arrow-left");
            document.body.classList.add("cursor-arrow-right");
          }
        }
      }

      // 1:1 direct tracking for tactile, responsive dragging
      container.scrollLeft = scrollLeftStartRef.current - delta;
    };

    const handleGlobalMouseUp = () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);

      isDraggingRef.current = false;
      setIsDragging(false);
      if (typeof document !== "undefined") {
        document.body.classList.remove("cursor-arrow-left", "cursor-arrow-right");
      }

      const container = scrollRef.current;
      if (!container) return;

      // Check if release has momentum
      let v = velocityRef.current;
      // Clamp maximum momentum to prevent runaway spinning
      v = Math.max(-2.2, Math.min(2.2, v));

      if (Math.abs(v) > 0.08) {
        // Friction-decay momentum loop
        const stepMomentum = () => {
          const c = scrollRef.current;
          if (!c) return;

          v *= 0.94; // Smooth friction decay
          c.scrollLeft += v * 16;

          if (Math.abs(v) > 0.04) {
            animationFrameRef.current = requestAnimationFrame(stepMomentum);
          } else {
            // Restore snap & smooth behavior smoothly
            c.style.scrollSnapType = "";
            c.style.scrollBehavior = "";
            animationFrameRef.current = null;
            // Short delay before clearing hasDraggedRef so child click handlers don't fire
            setTimeout(() => {
              hasDraggedRef.current = false;
            }, 60);
          }
        };
        animationFrameRef.current = requestAnimationFrame(stepMomentum);
      } else {
        // Low velocity: restore snap immediately
        container.style.scrollSnapType = "";
        container.style.scrollBehavior = "";
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 60);
      }
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);
  };

  // Intercept child clicks if the user was dragging to prevent opening project pages by mistake
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="w-full py-1">
      {/* ── Carousel Header Controls (Constrained to max-w-3xl) ──── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 flex items-center justify-between mb-3">
        {/* Slide Counter */}
        <div className="flex items-center gap-1.5 font-mono text-[12px] text-neutral-400 dark:text-neutral-500 tracking-normal">
          <span className="text-neutral-800 dark:text-neutral-200 font-medium">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{String(totalItems).padStart(2, "0")}</span>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-7 h-7 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white disabled:opacity-20 disabled:hover:border-neutral-200 dark:disabled:hover:border-neutral-800 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed bg-neutral-100/80 dark:bg-neutral-900/50 flex items-center justify-center active:scale-90 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-7 h-7 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white disabled:opacity-20 disabled:hover:border-neutral-200 dark:disabled:hover:border-neutral-800 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed bg-neutral-100/80 dark:bg-neutral-900/50 flex items-center justify-center active:scale-90 shadow-sm"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Full-Width Horizontal Scroll Track with Edge Fade Mask ── */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleTrackMouseMove}
        onClickCapture={handleClickCapture}
        className={`w-full flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth pb-3 select-none pointer-events-auto px-6 md:px-16 lg:px-24 ${
          cursorDirection === "left" ? "cursor-arrow-left" : "cursor-arrow-right"
        }`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
        }}
      >
        {children}
      </div>

      {/* ── Bottom Track Progress Bar (Constrained to max-w-3xl) ─── */}
      <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 mt-1">
        <div className="w-full h-[1px] bg-neutral-200 dark:bg-white/10 relative overflow-hidden">
          <div
            className="h-full bg-neutral-900 dark:bg-white/50 transition-all duration-300 ease-out"
            style={{
              width: `${totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
