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
  const projectHref = `/work/${project.slug}`;

  return (
    <div
      className={`group flex-shrink-0 ${cardWidth} snap-start flex flex-col select-none rounded-none shadow-none`}
    >
      {/* ── Image Container (Clickable: opens project) ──────────────── */}
      <Link
        href={projectHref}
        scroll={false}
        className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-[#151515] border border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/40 transition-colors duration-300 rounded-none shadow-none cursor-pointer block"
      >
        {project.heroImage ? (
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 340px, 420px"
            draggable={false}
            className="object-cover grayscale hover:grayscale-0 group-hover:grayscale-0 transition duration-300 ease-out rounded-none pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 dark:text-white/20 font-mono text-xs">
            NO IMAGE
          </div>
        )}
      </Link>

      {/* ── Meta Info ──────────────────────────────────────────────── */}
      <div className="mt-2.5 flex flex-col">
        {/* Top Caption Row (Index + Project Name) */}
        <div className="flex items-baseline min-w-0">
          <span className="font-mono text-[11px] text-neutral-400 dark:text-[#686662] mr-2 flex-shrink-0">
            {formattedIndex}
          </span>
          <Link
            href={projectHref}
            scroll={false}
            className="cursor-pointer group/title min-w-0 truncate"
          >
            <h3 className="font-sans font-normal text-[14px] tracking-[-0.01em] text-neutral-900 dark:text-[#EAE8E1] group-hover/title:underline underline-offset-4 decoration-neutral-400 dark:decoration-neutral-500 transition-colors truncate">
              {project.title}
            </h3>
          </Link>
        </div>

        {/* Bottom Caption Row (Location + Role) */}
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-neutral-400 dark:text-[#686662] truncate">
            {project.location}
          </span>
          <span className="font-mono text-[11px] text-neutral-500 dark:text-[#8A8884] truncate flex-shrink-0">
            {project.role || project.status}
          </span>
        </div>
      </div>
    </div>
  );
}
