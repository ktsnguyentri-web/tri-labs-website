import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug } from "@/lib/cms";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans selection:bg-white selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px] min-h-screen flex flex-col items-center">
        <div className="w-full max-w-[1440px] px-4 md:px-10 flex flex-col md:flex-row flex-grow">
          
          {/* Left: Content Panel */}
          <div className="w-full md:w-[35%] pr-8 py-8 md:pr-12 md:py-12 flex flex-col justify-between overflow-y-auto custom-scrollbar h-auto md:h-[calc(100vh-60px)]">
            <Reveal>
              <div>
                <Link
                  href="/work"
                  className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors flex items-center gap-2 mb-12"
                >
                  ← Back to works
                </Link>

                <h1 className="text-4xl md:text-[52px] font-light leading-[1.1] tracking-tight text-white mb-10">
                  {project.title}
                </h1>

                <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-12 border-l border-white/20 pl-4">
                  {project.location && <div>LOC: {project.location}</div>}
                  {project.category && <div>TYP: {project.category}</div>}
                  {project.completionYear && <div>YEA: {project.completionYear}</div>}
                  {project.architect && <div>ARC: {project.architect}</div>}
                  {project.status && <div>STA: {project.status}</div>}
                  {project.scope && <div>SCO: {project.scope}</div>}
                </div>

                <div className="relative">
                  <p className="font-sans text-[15px] text-white/70 leading-[1.7]">
                    {project.description || "Exploring the intersection of architectural scale and digital fidelity. This project represents a comprehensive investigation into material, light, and geometry to establish a new paradigm in spatial experience."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Scrollable Gallery Panel */}
          <div className="w-full md:w-[65%] h-auto md:h-[calc(100vh-60px)] overflow-y-auto custom-scrollbar md:pl-8">
            <div className="flex flex-col gap-4 py-8 md:py-12">
              {[project.coverImage, ...(project.gallery || [])]
                .filter((url, index, self) => self.indexOf(url) === index)
                .map((imgUrl, idx) => (
                  <div key={idx} className="relative w-full aspect-[3/2] overflow-hidden bg-[#111]">
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
        </div>
      </main>
    </div>
  );
}

