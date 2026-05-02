"use client";

import { useState } from "react";
import { ProjectData } from "@/lib/cms";
import { ProjectModal, ModalProject } from "./ProjectModal";

export function FeaturedGrid({ works }: { works: ProjectData[] }) {
  const [selectedProject, setSelectedProject] = useState<ModalProject | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4 grid-flow-dense w-full max-w-[1440px] mx-auto">
        {works.map((work, i) => (
          <button 
            key={i} 
            onClick={() => setSelectedProject({
              title: work.title,
              img: work.img,
              location: work.location
            })}
            className={`${work.span} overflow-hidden rounded-xl bg-secondary relative group cursor-pointer text-left w-full h-full`}
          >
            <img
              alt={work.title}
              className="w-full h-full object-cover object-center transition-opacity duration-700"
              src={work.img}
              style={{ filter: i % 3 === 0 ? "none" : "grayscale(100%) contrast(120%)" }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="font-mono text-white">
                <div className="text-sm font-bold uppercase tracking-wider mb-1">{work.title}</div>
                <div className="text-[10px] opacity-70 uppercase tracking-widest">{work.location}</div>
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
