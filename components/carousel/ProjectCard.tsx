"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types/cms";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={`/work/${project.slug}`}
      scroll={false}
      className="group flex-shrink-0 w-[240px] sm:w-[270px] md:w-[300px] snap-start flex flex-col cursor-pointer select-none"
    >
      {/* ── Image Container ────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 group-hover:border-neutral-400 dark:group-hover:border-white/40 transition-colors duration-500">
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 240px, 300px"
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-white/20 font-mono text-xs">
            NO IMAGE
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center pointer-events-none">
          <span className="font-mono text-[10px] tracking-normal bg-black/75 backdrop-blur-md px-1.5 py-0.5 text-white/90 border border-white/10 rounded-sm">
            {formattedIndex}
          </span>
          {project.completionYear && (
            <span className="font-mono text-[10px] tracking-normal bg-black/75 backdrop-blur-md px-1.5 py-0.5 text-white/70 border border-white/10 rounded-sm">
              {project.completionYear}
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="font-sans text-[11px] font-medium tracking-normal bg-neutral-900 text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-sm">
            Inspect →
          </span>
        </div>
      </div>

      {/* ── Meta Info ──────────────────────────────────────────────── */}
      <div className="mt-2.5 flex flex-col gap-0.5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-sans font-medium text-sm text-neutral-900 dark:text-[#EDEDED] group-hover:text-black dark:group-hover:text-white transition-colors truncate">
            {project.title}
          </h3>
          <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 flex-shrink-0">
            {project.category || "Arch"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 tracking-normal">
          <span className="truncate max-w-[65%]">
            {project.location}
          </span>
          <span className="text-neutral-400 dark:text-neutral-500">
            {project.role || project.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
