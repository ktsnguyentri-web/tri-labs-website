import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "@/lib/cms";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/animations/Reveal";
import { LightboxGallery } from "@/components/gallery/LightboxGallery";

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  // Filter out the cover image from the remaining gallery to avoid redundancy
  const remainingImages = [...(project.architectureGallery || []), ...(project.interiorGallery || []), ...(project.drawingGallery || [])].filter(
    (imgUrl) => imgUrl !== project.heroImage
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#61F9E9] selection:text-black">
      <Navbar />

      {/* 1. Full Screen Hero Image Header */}
      <section className="relative w-full h-screen overflow-hidden bg-[#111]">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        
        {/* Cinematic dark gradients to ground the text legibly */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Hero Content Overlay at the bottom */}
        <div className="absolute bottom-0 left-0 w-full z-10 pb-16 pt-32">
          <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10">
            <Reveal>
              <div className="flex flex-col items-start">
                <Link
                  href="/work"
                  className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50 hover:text-[#61F9E9] transition-all duration-300 hover:tracking-[0.3em] flex items-center mb-6"
                >
                  ← Back to works
                </Link>

                <h1 className="text-4xl md:text-[72px] font-light leading-[1.05] tracking-tight text-white mb-6 max-w-4xl uppercase">
                  {project.title}
                </h1>

                {project.category && (
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#61F9E9]">
                    {project.category} {project.completionYear && `// YEAR: ${project.completionYear}`}
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    {/* 2. Metadata & Description Section */}
    <section className="w-full flex justify-center bg-black py-20 border-b border-white/5">
      <div className="w-full max-w-[800px] px-6 flex flex-col gap-12 text-left">
        
        {/* Top Block: Narrative Description */}
        <Reveal>
          <p className="font-sans text-[16px] md:text-[18px] text-white/75 font-light leading-[1.7] md:leading-[1.8] tracking-wide">
            {project.description || "Exploring the intersection of architectural scale and digital fidelity. This project represents a comprehensive investigation into material, light, and geometry to establish a new paradigm in spatial experience."}
          </p>
        </Reveal>

        {/* Bottom Block: Technical Specifications */}
        <Reveal>
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-8 w-full pt-8 border-t border-white/10">
            {/* Typology */}
            {project.category && (
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em]">Typology</span>
                <span className="text-white text-[13px] font-sans font-light leading-relaxed">{project.category}</span>
              </div>
            )}

            {/* Location */}
            {(project.location && (!project.author && project.architect)) && (
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em]">Location</span>
                <span className="text-white text-[13px] font-sans font-light leading-relaxed">{project.location}</span>
              </div>
            )}

            {/* Year / Status */}
            {(project.completionYear || project.status) && (
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em]">{project.completionYear ? "Year" : "Status"}</span>
                <span className="text-white text-[13px] font-sans font-light leading-relaxed">{project.completionYear || project.status}</span>
              </div>
            )}

            {/* Office / Author */}
            {project.architect && !project.author ? (
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em]">Office</span>
                <span className="text-white text-[13px] font-sans font-light leading-relaxed">{project.architect}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em]">{project.author ? "Author" : "Work Type"}</span>
                <span className="text-white text-[13px] font-sans font-light leading-relaxed">{project.author || "Independent Work"}</span>
              </div>
            )}

            {/* Scope */}
            {project.scope && (
              <div className="flex flex-col gap-1.5 min-w-[120px]">
                <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.2em]">Scope</span>
                <span className="text-white text-[13px] font-sans font-light leading-relaxed">{project.scope}</span>
              </div>
            )}
          </div>
        </Reveal>

      </div>
    </section>

      {/* 3. Detail Gallery Images (Interactive Lightbox) */}
      <LightboxGallery images={remainingImages} projectName={project.title} />

      {/* 4. Footer Contact Section */}
      <Contact />
    </div>
  );
}
