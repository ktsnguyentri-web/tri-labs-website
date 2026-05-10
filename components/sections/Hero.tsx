"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring, animate } from "framer-motion";

// Cinematic ease curve — premium, floating
const CINEMATIC_EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);

  // ─── Mouse Tracking ────────────────────────────────────────────────────────
  const mouseX = useMotionValue(50);
  const smoothMouseX = useSpring(mouseX, {
    stiffness: 80,
    damping: 25,
    mass: 1,
  });

  // Clip-path: drives the left-to-right split reveal
  const clipPath = useTransform(
    smoothMouseX,
    (value) => `inset(0 ${100 - value}% 0 0)`
  );

  // Inverse parallax: mouse moves right → container shifts left
  const parallaxX = useTransform(
    smoothMouseX,
    [0, 50, 100],
    [50, 0, -50]
  );

  // ─── Label Fading (contextual) ─────────────────────────────────────────────
  // 'architect' fades when mouse is far right
  const architectOpacity = useTransform(
    smoothMouseX,
    [0, 50, 75, 100],
    [1,  1,  0,   0]
  );
  // 'coder' fades when mouse is far left
  const coderOpacity = useTransform(
    smoothMouseX,
    [0,  25, 50, 100],
    [0,  0,  1,  1]
  );

  // Sub-labels follow the same pattern tighter
  const architectSubOpacity = useTransform(
    smoothMouseX,
    [0, 40, 60, 100],
    [1,  1,  0,  0]
  );
  const coderSubOpacity = useTransform(
    smoothMouseX,
    [0, 40, 60, 100],
    [0,  0,  1,  1]
  );

  // ─── Entrance Animation State ──────────────────────────────────────────────
  // We drive scale via animated MotionValues so they can hand off to
  // the interactive phase seamlessly once entrance is complete.
  const portraitScale = useMotionValue(1.2);
  const labelScale    = useMotionValue(1.4);
  const labelOpacity  = useMotionValue(0);

  useEffect(() => {
    setHasMounted(true);

    // Kick off entrance sequence
    const portraitAnim = animate(portraitScale, 1, {
      duration: 2,
      ease: CINEMATIC_EASE,
    });

    const labelAnim = animate(labelScale, 1, {
      duration: 2,
      delay: 0.3,
      ease: CINEMATIC_EASE,
      onComplete: () => setEntranceDone(true),
    });

    animate(labelOpacity, 1, {
      duration: 1.2,
      delay: 0.3,
      ease: "easeOut",
    });

    return () => {
      portraitAnim.stop();
      labelAnim.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Event Handlers ────────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!entranceDone || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    mouseX.set(pct);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!entranceDone || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
    mouseX.set(pct);
  };

  const handleLeave = () => {
    if (!entranceDone) return;
    mouseX.set(50);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleLeave}
      onTouchEnd={handleLeave}
      className="relative w-full h-screen min-h-[600px] overflow-hidden cursor-ew-resize"
    >
      {hasMounted && (
        <>
          {/* ── BACKGROUND IMAGE LAYERS ─────────────────────────────────── */}
          <motion.div
            className="absolute z-0"
            style={{
              top: 0,
              bottom: 0,
              left: "-60px",
              right: "-60px",
              scale: portraitScale,
              x: entranceDone ? parallaxX : 0,
            }}
          >
            {/* Layer A — Real photo (coder), always behind */}
            <div className="absolute inset-0 pointer-events-none select-none">
              <Image
                src="/coder.jpeg"
                alt="Coder"
                fill
                className="object-cover object-[center_25%]"
                priority
              />
            </div>

            {/* Layer B — Line-art (architect), clipped from left */}
            <motion.div
              className="absolute inset-0 pointer-events-none select-none"
              style={{ clipPath: entranceDone ? clipPath : "inset(0 50% 0 0)" }}
            >
              <Image
                src="/architect.jpeg"
                alt="Architect"
                fill
                className="object-cover object-[center_25%]"
                priority
              />
            </motion.div>
          </motion.div>

          {/* ── OVERLAY LABELS ──────────────────────────────────────────── */}
          <div className="relative z-10 w-full h-full flex flex-col pt-[60px] pointer-events-none">
            <div className="flex-1 flex flex-col py-10 md:py-20 max-w-[1440px] mx-auto w-full px-6 md:px-10">
              <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mt-4 md:mt-10 flex-1">

                {/* LEFT — architect */}
                <motion.div
                  style={{ scale: labelScale, opacity: labelOpacity, originX: 0, originY: 1 }}
                  className="select-none flex flex-col items-start"
                >
                  <motion.div style={{ opacity: entranceDone ? architectOpacity : 1 }}>
                    <span
                      className="font-sans font-light tracking-tight text-white/50 lowercase leading-none"
                      style={{ fontSize: "clamp(48px, 10vw, 120px)" }}
                    >
                      architect
                    </span>
                  </motion.div>
                  <motion.div style={{ opacity: entranceDone ? architectSubOpacity : 1 }} className="mt-2 md:mt-3">
                    <p className="font-sans text-[10px] md:text-sm text-white/50 tracking-widest uppercase">
                      Spatial &amp; Structural Design
                    </p>
                  </motion.div>
                </motion.div>

                {/* RIGHT — coder */}
                <motion.div
                  style={{ scale: labelScale, opacity: labelOpacity, originX: 1, originY: 1 }}
                  className="select-none flex flex-col items-end text-right mt-auto md:mt-0 pb-10 md:pb-0"
                >
                  <motion.div style={{ opacity: entranceDone ? coderOpacity : 1 }}>
                    <span
                      className="font-sans font-light tracking-tight text-white/50 lowercase leading-none"
                      style={{ fontSize: "clamp(48px, 10vw, 120px)" }}
                    >
                      coder
                    </span>
                  </motion.div>
                  <motion.div style={{ opacity: entranceDone ? coderSubOpacity : 1 }} className="mt-2 md:mt-3">
                    <p className="font-sans text-[10px] md:text-sm text-white/50 tracking-widest uppercase">
                      Creative &amp; Frontend Engineering
                    </p>
                  </motion.div>
                </motion.div>

              </div>
            </div>
          </div>

          {/* ── SCROLL INDICATOR ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
            className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/40">
              Scroll
            </span>
          </motion.div>
        </>
      )}
    </section>
  );
}
