"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronDown } from "lucide-react";
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
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 md:p-4">
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
        className="bg-white w-[96vw] max-w-[1600px] h-[93vh] rounded-[6px] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10 border border-black/10"
      >
        {/* Left Panel — Info (~35%) */}
        <div className={`w-full md:w-[35%] flex flex-col h-full overscroll-contain border-b md:border-b-0 md:border-r border-black/10 overflow-y-auto ${isExpanded ? 'custom-scrollbar-light' : 'no-scrollbar'}`}>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-white z-20 px-6 py-3.5 flex justify-between items-center border-b border-black/10">
            {project.slug ? (
              <button
                onClick={() => {
                  document.body.style.overflow = "auto";
                  document.documentElement.style.overflow = "auto";
                  window.location.href = `/work/${project.slug}`;
                }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 hover:text-black transition-colors"
              >
                Gallery ↗
              </button>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50">
                Gallery
              </span>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-black/5 transition-colors"
              aria-label="Close"
            >
              <X className="w-4.5 h-4.5 text-black" strokeWidth={1.2} />
            </button>
          </div>

          <div className="px-6 pt-5 pb-6 flex flex-col flex-grow">
            <h2 className="text-3xl md:text-[36px] font-light leading-[1.15] tracking-tight text-black mb-4">
              {project.title}
            </h2>

            <div className="flex flex-col gap-6 mt-2 mb-6">
              {/* 1. Information Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-black/50 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black/10 pb-2 mb-1">Information</h3>
                
                <div className="flex flex-col gap-3">
                  {project.category && (
                    <div className="flex flex-col gap-0.5">
                      <div className="text-black/90 text-[13px] font-bold">Project Type:</div>
                      <div className="text-black/60 text-[13px] font-light leading-snug">{project.category}</div>
                    </div>
                  )}

                  {(!project.author && project.architect) && (
                    <div className="flex flex-col gap-0.5">
                      <div className="text-black/90 text-[13px] font-bold">Location:</div>
                      <div className="text-black/60 text-[13px] font-light leading-snug">{project.location || "N/A"}</div>
                    </div>
                  )}

                  <div className="flex flex-col gap-0.5">
                    <div className="text-black/90 text-[13px] font-bold">Status:</div>
                    <div className="text-black/60 text-[13px] font-light leading-snug">{project.status || (project.completionYear ? `Completed in ${project.completionYear}` : "N/A")}</div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="text-black/90 text-[13px] font-bold">{(!!project.author || !project.architect) ? 'Work Type:' : 'Office:'}</div>
                    <div className="text-black/60 text-[13px] font-light leading-snug">{(!!project.author || !project.architect) ? (project.author ? `Author: ${project.author}` : 'Independent Work') : project.architect}</div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <div className="text-black/90 text-[13px] font-bold">Scope:</div>
                    <div className="text-black/60 text-[13px] font-light leading-snug">{project.scope || "N/A"}</div>
                  </div>
                </div>
              </div>

              {/* 2. Size Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-black/50 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black/10 pb-2 mb-1">Size</h3>
                <div className="flex flex-col gap-1.5 text-black/60 text-[13px] font-light leading-snug">
                  {project.size?.siteArea && <div>Site Area: {project.size.siteArea}</div>}
                  {project.size?.buildingHeight && <div>Building Height: {project.size.buildingHeight}</div>}
                  {project.size?.stories && <div>Number of Stories: {project.size.stories}</div>}
                  {project.size?.grossArea && <div>Building Gross Area: {project.size.grossArea}</div>}
                  {!project.size?.siteArea && !project.size?.buildingHeight && (
                    <>
                      <div>Site Area: 10 acres</div>
                      <div>Building Height: 130 feet</div>
                      <div>Number of Stories: 12</div>
                      <div>Building Gross Area: 2,200,000 square feet</div>
                    </>
                  )}
                </div>
              </div>

              {/* 3. Collaborators (Optional, keeping subtle) */}
              {project.collaborators && (
                <div className="flex flex-col gap-3">
                  <h3 className="text-black/50 text-[11px] font-bold uppercase tracking-[0.2em] border-b border-black/10 pb-2 mb-1">Collaborators</h3>
                  <div className="flex flex-col gap-1 text-black/60 text-[13px] font-light">
                    {project.collaborators.map((c, i) => <div key={i}>{c}</div>)}
                  </div>
                </div>
              )}
            </div>

            <div className="relative border-t border-black/5 pt-4 mt-2">
              <p className={`font-sans text-[13px] text-black/80 leading-[1.6] ${!isExpanded ? 'line-clamp-4' : ''}`}>
                {description}
              </p>
            </div>

            {!isExpanded && (
              <div className="mt-3">
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
              <div className="mt-6 pt-6 border-t border-black/10">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/50 hover:text-black transition-all"
                >
                  Show Less
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Scrollable Gallery (~65%) */}
        <div className="w-full md:w-[65%] h-full p-3.5 overflow-y-auto custom-scrollbar-light overscroll-contain">
          <div className="flex flex-col gap-3.5">
            {[project.heroImage, ...(project.architectureGallery || []), ...(project.interiorGallery || []), ...(project.drawingGallery || [])]
              .filter((url, index, self) => self.indexOf(url) === index) // Remove duplicates
              .map((imgUrl, idx) => (
                <div key={idx} className={`relative w-full overflow-hidden bg-gray-100 shrink-0 ${idx === 0 ? 'h-[60vh] md:h-[calc(93vh-30px)]' : 'aspect-[3/2]'}`}>
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


