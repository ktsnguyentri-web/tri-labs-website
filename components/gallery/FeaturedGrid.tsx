"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project, ModalProject } from "@/types/cms";
import { ProjectModal } from "@/components/modals/ProjectModal";

export function FeaturedGrid({ works }: { works: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<ModalProject | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4 grid-flow-dense w-full max-w-[1440px] mx-auto">
        {works.map((work, i) => (
          <button
            key={i}
            onClick={() =>
              setSelectedProject({
                title: work.title,
                coverImage: work.coverImage,
                location: work.location,
              })
            }
            className={`${work.span} cursor-pointer text-left w-full h-full`}
          >
            {/* Inner wrapper: consistent rounding + overflow-hidden clips everything */}
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
                <div className="absolute inset-x-0 bottom-0 p-6 font-mono text-white">
                  <div className="text-sm font-bold uppercase tracking-wider mb-1">{work.title}</div>
                  <div className="text-[10px] opacity-70 uppercase tracking-widest">{work.location}</div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </>
  );
}
