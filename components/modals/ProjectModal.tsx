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
        className="bg-black w-full max-w-7xl h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10 border border-white/10"
      >
        {/* Left Panel — Info (~35%) */}
        <div className={`w-full md:w-[35%] flex flex-col h-full overscroll-contain custom-scrollbar ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {/* Sticky Header */}
          <div className="sticky top-0 bg-black z-20 p-8 pb-4 flex justify-between items-center border-b border-white/10">
            {project.slug ? (
              <button
                onClick={() => {
                  document.body.style.overflow = "auto";
                  document.documentElement.style.overflow = "auto";
                  window.location.href = `/work/${project.slug}`;
                }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
              >
                Gallery ↗
              </button>
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                Gallery
              </span>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-white" strokeWidth={1.2} />
            </button>
          </div>

          <div className="px-8 pb-8 flex flex-col flex-grow">
            <h2 className="text-3xl md:text-[42px] font-light leading-[1.1] tracking-tight text-white mb-6">
              {project.title}
            </h2>

            <div className="flex flex-col gap-12 mt-8 mb-12">
              {/* 1. Information Section */}
              <div className="flex flex-col gap-6">
                <h3 className="text-white text-[16px] font-bold uppercase tracking-[0.15em] border-b border-white/10 pb-4 mb-2">Information</h3>
                
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <div className="text-white text-[15px] font-bold">Location:</div>
                    <div className="text-white/40 text-[15px] font-light leading-snug">{project.location || "24-26 Phan Dinh Giot Street, Tan Binh Dist."}</div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-white text-[15px] font-bold">Lead Architect:</div>
                    <div className="text-white/40 text-[15px] font-light leading-snug">{project.architect || "Di+ Architects"}</div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-white text-[15px] font-bold">Status:</div>
                    <div className="text-white/40 text-[15px] font-light leading-snug">{project.status || `Completed in ${project.completionYear || "2022"}`}</div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-white text-[15px] font-bold">My scope:</div>
                    <div className="text-white/40 text-[15px] font-light leading-snug">{project.scope || "Facade design & Construction Documentation"}</div>
                  </div>
                </div>
              </div>

              {/* 2. Size Section */}
              <div className="flex flex-col gap-6">
                <h3 className="text-white text-[16px] font-bold uppercase tracking-[0.15em] border-b border-white/10 pb-4 mb-2">Size</h3>
                <div className="flex flex-col gap-2 text-white/40 text-[15px] font-light leading-snug">
                  {project.siteArea && <div>Site Area: {project.siteArea}</div>}
                  {project.buildingHeight && <div>Building Height: {project.buildingHeight}</div>}
                  {project.stories && <div>Number of Stories: {project.stories}</div>}
                  {project.grossArea && <div>Building Gross Area: {project.grossArea}</div>}
                  {!project.siteArea && !project.buildingHeight && (
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
                <div className="flex flex-col gap-6">
                  <h3 className="text-white text-[16px] font-bold uppercase tracking-[0.15em] border-b border-white/10 pb-4 mb-2">Collaborators</h3>
                  <div className="flex flex-col gap-4 text-white/40 text-[15px] font-light">
                    {project.collaborators.map((c, i) => <div key={i}>{c}</div>)}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <p className={`font-sans text-[15px] text-white/80 leading-[1.6] ${!isExpanded ? 'line-clamp-6' : ''}`}>
                {description}
              </p>
            </div>

            {!isExpanded && (
              <div className="mt-6">
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:opacity-50 transition-all flex items-center gap-2 group"
                >
                  Read More 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            )}

            {isExpanded && (
              <div className="mt-12 pt-12 border-t border-white/10">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all"
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


