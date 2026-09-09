"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Project } from "@/types/cms";

interface ProjectStageViewportProps {
  project: Project;
  onOpenGallery?: () => void;
}

export function ProjectStageViewport({ project, onOpenGallery }: ProjectStageViewportProps) {
  const [mode, setMode] = useState<"2d" | "3d">("2d");

  return (
    <div className="aspect-[16/10] w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden rounded-none">
      {/* Minimal Toggle Pill in Top-Right Corner */}
      <div className="absolute top-3 right-3 z-10 flex items-center bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm border border-neutral-300 dark:border-neutral-700 select-none">
        <button
          type="button"
          onClick={() => setMode("2d")}
          className={`font-mono text-[11px] tracking-wide px-2.5 py-1 rounded-none transition-colors cursor-pointer ${
            mode === "2d"
              ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          }`}
        >
          2D Photos
        </button>
        <span className="w-[1px] h-3.5 bg-neutral-300 dark:bg-neutral-700" />
        <button
          type="button"
          onClick={() => setMode("3d")}
          className={`font-mono text-[11px] tracking-wide px-2.5 py-1 rounded-none transition-colors cursor-pointer ${
            mode === "3d"
              ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-medium"
              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          }`}
        >
          3D Interactive
        </button>
      </div>

      {/* 2D Photos Stage */}
      {mode === "2d" && project.heroImage && (
        <div
          onClick={onOpenGallery}
          className={`w-full h-full relative ${onOpenGallery ? "cursor-pointer group/stage" : ""}`}
        >
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
            className="object-cover rounded-none group-hover/stage:scale-[1.01] transition-transform duration-500"
          />
          {onOpenGallery && (
            <div className="absolute inset-0 bg-black/0 group-hover/stage:bg-black/15 transition-colors flex items-center justify-center">
              <span className="font-mono text-[10px] text-white bg-black/75 px-2.5 py-1 opacity-0 group-hover/stage:opacity-100 transition-opacity tracking-wider">
                EXPAND GALLERY ↗
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3D Interactive Stage (Prepared Three.js Viewport Slot) */}
      {mode === "3d" && (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative bg-[#0D0D0D] text-neutral-400 select-none">
          {/* Subtle architectural coordinate grid background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          {/* Central reticle */}
          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className="w-10 h-10 border border-neutral-700 rounded-full flex items-center justify-center text-neutral-300 animate-pulse">
              <span className="font-mono text-xs">3D</span>
            </div>
            <div className="font-mono text-[11px] tracking-wider text-neutral-300 uppercase">
              WebGL 3D Viewport
            </div>
            <div className="font-mono text-[10px] text-neutral-500 tracking-wide">
              Three.js Canvas Component Ready
            </div>
          </div>
          {/* Coordinate telemetry in bottom left */}
          <div className="absolute bottom-3 left-3 font-mono text-[9px] text-neutral-600 tracking-widest uppercase pointer-events-none">
            x: 0.000 / y: 0.000 / z: 1.000
          </div>
        </div>
      )}
    </div>
  );
}
