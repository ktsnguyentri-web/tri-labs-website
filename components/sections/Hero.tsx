"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden rounded-[24px]">
      {hasMounted && (
        <>
          {/* BACKGROUND LAYER */}
          <motion.div 
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 pointer-events-none select-none">
              <Image
                src="/coder.jpeg"
                alt="Portrait"
                fill
                className="object-cover object-[center_25%]"
                priority
              />
            </div>
          </motion.div>

          {/* OVERLAY CONTENT */}
          <div className="relative z-10 w-full h-full flex flex-col pt-[60px] pointer-events-none">
            
            <div className="flex-1 flex flex-col items-center justify-between py-10 md:py-20 max-w-[1440px] mx-auto w-full px-6 md:px-10 pb-20 md:pb-20">
              <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mt-4 md:mt-10 flex-1">
                {/* LEFT LABEL — architect */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.3 }}
                  animate={{ opacity: 1, scale: 1.0 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="select-none flex flex-col items-start origin-left"
                >
                  <span
                    className="font-sans font-light tracking-tight text-white/50 lowercase leading-none"
                    style={{ fontSize: "clamp(48px, 10vw, 120px)" }}
                  >
                    architect
                  </span>
                  <p className="font-sans text-[10px] md:text-sm text-white/50 tracking-widest uppercase mt-2 md:mt-3">
                    Spatial & Structural Design
                  </p>
                </motion.div>

                {/* RIGHT LABEL — coder */}
                <motion.div
                  initial={{ opacity: 0, scale: 1.3 }}
                  animate={{ opacity: 1, scale: 1.0 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="select-none flex flex-col items-end text-right origin-right mt-auto md:mt-0 pb-10 md:pb-0"
                >
                  <span
                    className="font-sans font-light tracking-tight text-white/50 lowercase leading-none"
                    style={{ fontSize: "clamp(48px, 10vw, 120px)" }}
                  >
                    coder
                  </span>
                  <p className="font-sans text-[10px] md:text-sm text-white/50 tracking-widest uppercase mt-2 md:mt-3">
                    Creative & Frontend Engineering
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
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
