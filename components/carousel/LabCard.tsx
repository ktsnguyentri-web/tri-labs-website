"use client";

import Image from "next/image";
import Link from "next/link";
import type { ResearchArticle } from "@/types/cms";

interface LabCardProps {
  article: ResearchArticle;
  index: number;
}

export function LabCard({ article, index }: LabCardProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");
  const href = article.category === "Tool" ? `/tool` : `/research/${article.slug}`;

  return (
    <Link
      href={href}
      className="group flex-shrink-0 w-[230px] sm:w-[260px] md:w-[280px] snap-start flex flex-col cursor-pointer select-none"
    >
      {/* ── Visual Media / Container ───────────────────────────────── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-950 border border-white/10 group-hover:border-white/40 transition-colors duration-500">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 230px, 280px"
            className="object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-white/[0.02]">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/30 mb-1">
              Computational Prototype
            </span>
            <span className="font-serif text-sm text-white/80 line-clamp-2">
              {article.title}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center pointer-events-none">
          <span className="font-mono text-[9px] tracking-[0.2em] bg-black/70 backdrop-blur-md px-1.5 py-0.5 text-white/90 border border-white/10">
            {formattedIndex}
          </span>
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase bg-white/10 backdrop-blur-md px-1.5 py-0.5 text-white/80 border border-white/10">
            {article.category}
          </span>
        </div>

        {/* Read / Run Trigger */}
        <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase bg-white text-black px-2 py-0.5 font-bold">
            Read →
          </span>
        </div>
      </div>

      {/* ── Meta Info ──────────────────────────────────────────────── */}
      <div className="mt-2.5 flex flex-col gap-0.5">
        <h3 className="font-serif text-sm md:text-base text-white group-hover:text-white/80 transition-colors line-clamp-1">
          {article.title}
        </h3>
        <p className="text-[11px] text-white/50 line-clamp-2 font-sans leading-relaxed">
          {article.excerpt}
        </p>
        <div className="mt-0.5 flex items-center justify-between font-mono text-[9px] text-white/40 tracking-wider">
          <span>{article.date}</span>
          <span className="uppercase">{article.category === "Tool" ? "Tool" : "Insight"}</span>
        </div>
      </div>
    </Link>
  );
}
