"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModalProject } from "@/types/cms";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProjectModalProps {
  project: ModalProject;
  onClose?: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);

  const defaultDescription =
    "Exploring the intersection of architectural scale and digital fidelity. This project represents a comprehensive investigation into material, light, and geometry to establish a new paradigm in spatial experience.";

  const description = project.description || defaultDescription;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal Window */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full max-w-7xl h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10"
      >
        {/* Left Panel — Info (~35%) */}
        <div className={`w-full md:w-[35%] flex flex-col h-full overscroll-contain custom-scrollbar ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white z-20 p-8 pb-4 flex justify-between items-center">
            {project.slug ? (
              <button
                onClick={() => {
                  document.body.style.overflow = "auto";
                  document.documentElement.style.overflow = "auto";
                  window.location.href = `/work/${project.slug}`;
                }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4C4546]/60 hover:text-black transition-colors"
              >
                Gallery ↗
              </button>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4C4546]/60">
                Gallery
              </span>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-black" strokeWidth={1.2} />
            </button>
          </div>

          <div className="px-8 pb-8 flex flex-col flex-grow">
            <h2 className="text-3xl md:text-[42px] font-light leading-[1.1] tracking-tight text-black mb-6">
              {project.title}
            </h2>

            <div className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#4C4546] mb-8 border-l border-black/20 pl-4">
              {project.location && <div>LOC: {project.location}</div>}
              {project.category && <div>TYP: {project.category}</div>}
              {project.completionYear && <div>YEA: {project.completionYear}</div>}
              {project.architect && <div>ARC: {project.architect}</div>}
              {project.status && <div>STA: {project.status}</div>}
              {project.scope && <div>SCO: {project.scope}</div>}
            </div>

            <div className="relative">
              <p className={`font-sans text-[15px] text-[#4C4546] leading-[1.6] ${!isExpanded ? 'line-clamp-6' : ''}`}>
                {description}
              </p>
            </div>

            {!isExpanded && (
              <div className="mt-6">
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-black hover:opacity-50 transition-all flex items-center gap-2 group"
                >
                  Read More 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            )}

            {isExpanded && (
              <div className="mt-12 pt-12 border-t border-gray-100">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4C4546] hover:text-black transition-all"
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Scrollable Gallery (~65%) */}
        <div className="w-full md:w-[65%] h-full pr-4 pt-0 pl-0 pb-0 overflow-y-auto custom-scrollbar overscroll-contain">
          <div className="flex flex-col gap-4">
            {[project.coverImage, ...(project.gallery || [])]
              .filter((url, index, self) => self.indexOf(url) === index) // Remove duplicates
              .map((imgUrl, idx) => (
                <div key={idx} className="relative w-full aspect-[3/2] overflow-hidden bg-gray-50">
                  <Image
                    src={imgUrl}
                    alt={`${project.title} - image ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 65vw"
                    priority={idx === 0}
                  />
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}


