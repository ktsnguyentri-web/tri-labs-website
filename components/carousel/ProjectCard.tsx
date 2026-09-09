"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/cms";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");
  const cardWidth = index % 2 === 0 ? "w-[320px] sm:w-[420px]" : "w-[260px] sm:w-[340px]";

  return (
    <Link
      href={`/work/${project.slug}`}
      scroll={false}
      className={`group flex-shrink-0 ${cardWidth} snap-start flex flex-col cursor-pointer select-none rounded-none shadow-none`}
    >
      {/* ── Image Container ────────────────────────────────────────── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 group-hover:border-neutral-400 dark:group-hover:border-white/40 transition-colors duration-300 rounded-none shadow-none">
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 340px, 420px"
            className="object-cover grayscale hover:grayscale-0 group-hover:grayscale-0 transition duration-300 ease-out rounded-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-white/20 font-mono text-xs">
            NO IMAGE
          </div>
        )}
      </div>

      {/* ── Meta Info ──────────────────────────────────────────────── */}
      <div className="mt-2.5 flex flex-col gap-1">
        {/* Line 1: [01] (font-mono text-xs) + [Project Title] (font-sans font-medium text-sm) */}
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 flex-shrink-0">
            {formattedIndex}
          </span>
          <h3 className="font-sans font-medium text-sm text-neutral-900 dark:text-[#EDEDED] group-hover:text-black dark:group-hover:text-white transition-colors truncate">
            {project.title}
          </h3>
        </div>

        {/* Line 2: [LOCATION] (font-mono text-[11px] text-neutral-400) + [Role] (font-sans text-[11px] text-neutral-500) */}
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-neutral-400 uppercase truncate">
            {project.location}
          </span>
          <span className="font-sans text-[11px] text-neutral-500 truncate flex-shrink-0">
            {project.role || project.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
