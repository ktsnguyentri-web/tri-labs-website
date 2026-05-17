import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug } from "@/lib/cms";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/animations/Reveal";

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
  const remainingImages = (project.gallery || []).filter(
    (imgUrl) => imgUrl !== project.coverImage
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#61F9E9] selection:text-black">
      <Navbar />

      {/* 1. Full Screen Hero Image Header */}
      <section className="relative w-full h-screen overflow-hidden bg-[#111]">
        <Image
          src={project.coverImage}
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
        <div className="w-full max-w-[1440px] px-4 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          
          {/* Left Block: Technical Specifications */}
          <div className="col-span-12 md:col-span-4">
            <Reveal>
              <div>
                <h2 className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 mb-8 border-b border-white/10 pb-3">
                  PROJECT SPECIFICATIONS
                </h2>
                
                <div className="flex flex-col gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/80">
                  {/* Typology */}
                  {project.category && (
                    <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/40 shrink-0">Typology</span>
                      <span className="text-right text-white font-medium leading-relaxed">{project.category}</span>
                    </div>
                  )}

                  {/* Location */}
                  {project.location && (
                    <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/40 shrink-0">Location</span>
                      <span className="text-right text-white font-medium leading-relaxed">{project.location}</span>
                    </div>
                  )}

                  {/* Year / Status */}
                  {(project.completionYear || project.status) && (
                    <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/40 shrink-0">{project.completionYear ? "Year" : "Status"}</span>
                      <span className="text-right text-white font-medium leading-relaxed">{project.completionYear || project.status}</span>
                    </div>
                  )}

                  {/* Office / Author */}
                  {project.architect ? (
                    <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/40 shrink-0">Office</span>
                      <span className="text-right text-white font-medium leading-relaxed">{project.architect}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/40 shrink-0">Author</span>
                      <span className="text-right text-white font-medium leading-relaxed">{project.author || "Tri Nguyen"}</span>
                    </div>
                  )}

                  {/* Role */}
                  {project.role && (
                    <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/40 shrink-0">My Role</span>
                      <span className="text-right text-white font-medium leading-relaxed">{project.role}</span>
                    </div>
                  )}

                  {/* Scope */}
                  {project.scope && (
                    <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/40 shrink-0">Scope</span>
                      <span className="text-right text-white font-medium leading-relaxed">{project.scope}</span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Block: Narrative Description */}
          <div className="col-span-12 md:col-span-8 flex flex-col justify-start">
            <Reveal>
              <div className="max-w-3xl">
                <h2 className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 mb-8 border-b border-white/10 pb-3">
                  PROJECT NARRATIVE
                </h2>
                <p className="font-sans text-[16px] md:text-[18px] text-white/75 font-light leading-[1.7] md:leading-[1.8] tracking-wide">
                  {project.description || "Exploring the intersection of architectural scale and digital fidelity. This project represents a comprehensive investigation into material, light, and geometry to establish a new paradigm in spatial experience."}
                </p>
              </div>
            </Reveal>
          </div>

        </div>
      </section>

      {/* 3. Detail Gallery Images Staggered Feed */}
      {remainingImages.length > 0 && (
        <section className="w-full flex flex-col items-center bg-black py-20 border-b border-white/5">
          <div className="w-full max-w-[1440px] px-4 md:px-10 flex flex-col gap-12 md:gap-16">
            <h2 className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 border-b border-white/10 pb-3 mb-4">
              VISUAL CHRONICLES
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {remainingImages.map((imgUrl, idx) => {
                // Stagger system: first image is full-width (col-span-2), remaining ones alternate aspect ratios
                const isFullWidth = idx === 0 || idx % 3 === 0;
                return (
                  <div
                    key={idx}
                    className={`relative w-full overflow-hidden bg-[#111] group ${
                      isFullWidth 
                        ? "col-span-1 md:col-span-2 aspect-[16/9]" 
                        : "col-span-1 aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${project.title} - detail image ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-101"
                      sizes={isFullWidth ? "(max-width: 1200px) 100vw, 1440px" : "(max-width: 768px) 100vw, 700px"}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. Footer Contact Section */}
      <Contact />
    </div>
  );
}
