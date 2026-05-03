"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { ModalProject } from "@/types/cms";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
  project: ModalProject;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const defaultDescription =
    "Exploring the intersection of architectural scale and digital fidelity. This project represents a comprehensive investigation into material, light, and geometry to establish a new paradigm in spatial experience.";

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-label="Close modal background"
      />

      <div className="bg-white w-full max-w-7xl h-[85vh] rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10 scale-in-95 duration-300">

        {/* Left Panel — Info (~35%) */}
        <div className="w-full md:w-[35%] p-10 flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-16">
            <span className="font-mono text-xs uppercase tracking-widest text-[#4C4546]">
              Gallery
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-black" strokeWidth={1.5} />
            </button>
          </div>

          <h2 className="text-4xl md:text-[52px] font-normal leading-none tracking-tight text-black mb-8">
            {project.title}
          </h2>

          <div className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#4C4546] mb-10 border-l-2 border-black pl-4">
            {project.location && <div>LOC: {project.location}</div>}
            {project.category && <div>TYP: {project.category}</div>}
            {project.completionYear && <div>YEA: {project.completionYear}</div>}
          </div>

          <p className="font-sans text-base text-[#4C4546] leading-[1.6]">
            {project.description || defaultDescription}
          </p>

          <div className="mt-auto pt-12">
            <Button size="sm">
              Read More
            </Button>
          </div>
        </div>

        {/* Right Panel — Image (~65%) */}
        <div className="w-full md:w-[65%] h-full p-4 pl-0">
          <div className="w-full h-full rounded-[24px] overflow-hidden relative">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover rounded-[24px]"
              sizes="(max-width: 768px) 100vw, 65vw"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
