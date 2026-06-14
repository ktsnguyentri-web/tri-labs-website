"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Reveal } from '@/components/animations/Reveal';

interface LightboxGalleryProps {
  images: string[];
  projectName: string;
}

export function LightboxGallery({ images, projectName }: LightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Keep refs array size in sync
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, images.length);
  }, [images]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    // Needs a slight delay to allow the modal to render before scrolling to the correct item
    setTimeout(() => {
      if (itemRefs.current[index]) {
        itemRefs.current[index]?.scrollIntoView({ behavior: 'instant', inline: 'center' });
      }
    }, 10);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      itemRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      itemRefs.current[newIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  // Setup intersection observer to update current index based on native horizontal scroll
  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setCurrentIndex(index);
            }
          }
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.6, // Trigger when 60% of the image is visible
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [isOpen]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Static Grid View */}
      <section className="w-full flex justify-center bg-black py-20">
        <div className="w-full max-w-[1440px] px-4 md:px-10 flex flex-col items-center">
          <Reveal>
            <h2 className="text-center font-sans font-light text-[32px] sm:text-[40px] md:text-[48px] uppercase tracking-[0.25em] text-white mb-16 select-none leading-none">
              GALLERY
            </h2>
          </Reveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 w-full">
            {images.map((imgUrl, idx) => (
              <div key={idx} className="w-full">
                <Reveal>
                  <div 
                    className="relative w-full aspect-[3/2] overflow-hidden bg-white/5 group cursor-pointer"
                    onClick={() => openLightbox(idx)}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${projectName} - Gallery ${idx + 1}`}
                      fill
                      sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col justify-between"
          >
            {/* Top Bar: Close Button */}
            <div className="absolute top-0 left-0 w-full h-24 flex items-center justify-end px-6 md:px-10 z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
              <button 
                onClick={closeLightbox}
                className="text-white/60 hover:text-white transition-colors p-2 pointer-events-auto mix-blend-difference"
                aria-label="Close Gallery"
              >
                <X size={36} strokeWidth={1} />
              </button>
            </div>

            {/* Scrollable Carousel Area */}
            <div 
              ref={scrollContainerRef}
              className="flex-grow flex items-center overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full"
            >
              {/* Padding block so the first item can perfectly snap to center */}
              <div className="min-w-[5vw] md:min-w-[15vw] h-full shrink-0" />
              
              {images.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  data-index={idx}
                  className="snap-center shrink-0 w-[90vw] md:w-[70vw] h-[70vh] md:h-[80vh] relative px-2 md:px-6 flex items-center justify-center transition-all duration-500 ease-out"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={imgUrl}
                      alt={`${projectName} - Lightbox ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 90vw, 70vw"
                      quality={90}
                    />
                  </div>
                </div>
              ))}
              
              {/* Padding block so the last item can perfectly snap to center */}
              <div className="min-w-[5vw] md:min-w-[15vw] h-full shrink-0" />
            </div>

            {/* Bottom Bar: Navigation */}
            <div className="absolute bottom-0 left-0 w-full h-24 flex items-center justify-center z-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
              <div className="flex items-center gap-6 text-white font-mono text-[13px] tracking-widest pointer-events-auto mix-blend-difference">
                <button 
                  onClick={goToPrev}
                  className={`p-2 transition-opacity ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'opacity-60 hover:opacity-100'}`}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={24} strokeWidth={1} />
                </button>
                
                <span className="select-none min-w-[60px] text-center opacity-80">
                  {currentIndex + 1} / {images.length}
                </span>

                <button 
                  onClick={goToNext}
                  className={`p-2 transition-opacity ${currentIndex === images.length - 1 ? 'opacity-20 cursor-not-allowed' : 'opacity-60 hover:opacity-100'}`}
                  disabled={currentIndex === images.length - 1}
                >
                  <ChevronRight size={24} strokeWidth={1} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
