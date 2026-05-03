"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/cms";

export function FeaturedGrid({ works }: { works: Project[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-2 grid-flow-dense w-full max-w-[1440px] mx-auto">
      {works.map((work, i) => (
        <Link
          key={i}
          href={`/work/${work.slug}`}
          scroll={false}
          className={`${work.span} cursor-pointer text-left w-full h-full block`}
        >
          <div className="relative w-full h-full rounded-[24px] overflow-hidden group bg-secondary">
            <Image
              src={work.coverImage}
              alt={work.title}
              fill
              className="object-cover object-center rounded-[24px] transition-transform duration-500 group-hover:scale-105"
              style={{ filter: i % 3 === 0 ? "none" : "grayscale(100%) contrast(120%)" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw"
            />
            {/* Gradient overlay — rounded to match container, opacity-0 → visible on hover */}
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="label-caps mb-1">{work.title}</div>
                <div className="data-mono opacity-70">{work.location}</div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

