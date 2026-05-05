"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/cms";
import { Reveal } from "@/components/animations/Reveal";

export function FeaturedGrid({ works }: { works: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-2 grid-flow-dense w-full max-w-[1440px] mx-auto px-10">
      {works.map((work, i) => (
        <Reveal key={i} delay={0.1 + (i % 4) * 0.1} className={work.span}>
          <Link
            href={`/work/${work.slug}`}
            scroll={false}
            className="cursor-pointer text-left w-full h-full block group"
          >
            {/* Rule #3: rounded-[12px], overflow-hidden */}
            <div className="relative w-full h-full rounded-[12px] overflow-hidden bg-secondary shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
              <Image
                src={work.coverImage}
                alt={work.title}
                fill
                className="object-cover object-center rounded-[12px] transition-transform duration-700 group-hover:scale-105"
                style={{ filter: i % 3 === 0 ? "none" : "grayscale(100%) contrast(120%)" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
              />
              {/* Gradient overlay — visible on hover */}
              <div className="absolute inset-0 rounded-[12px] bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                  <div className="label-caps mb-2">{work.title}</div>
                  <div className="data-mono text-[10px] opacity-60 tracking-[0.1em]">{work.location}</div>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

