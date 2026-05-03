import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug } from "@/lib/cms";
import { notFound } from "next/navigation";

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
    <div className="min-h-screen bg-[#F9F9F9] text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px] min-h-[calc(100vh-60px)] flex items-center justify-center p-4 md:p-10">
        <div className="bg-white w-full max-w-7xl h-auto md:h-[85vh] rounded-[24px] overflow-hidden flex flex-col md:flex-row shadow-xl relative">
          
          {/* Left Panel — Info (~35%) */}
          <div className="w-full md:w-[35%] p-10 flex flex-col h-full overflow-y-auto">
            <div className="mb-16">
              <span className="font-mono text-xs uppercase tracking-widest text-[#4C4546]">
                Project Detail
              </span>
            </div>

            <h1 className="text-4xl md:text-[52px] font-light leading-none tracking-tight text-black mb-8">
              {project.title}
            </h1>

            <div className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-[#4C4546] mb-10 border-l-2 border-black pl-4">
              {project.location && <div>LOC: {project.location}</div>}
              {project.category && <div>TYP: {project.category}</div>}
              {project.completionYear && <div>YEA: {project.completionYear}</div>}
            </div>

            <p className="font-sans text-base text-[#4C4546] leading-[1.6]">
              {project.description || "Exploring the intersection of architectural scale and digital fidelity. This project represents a comprehensive investigation into material, light, and geometry to establish a new paradigm in spatial experience."}
            </p>

            <div className="mt-auto pt-12">
              <Link href="/work" className="label-caps inline-block border-b border-black pb-1 hover:opacity-50 transition-opacity">
                Back to Gallery
              </Link>
            </div>
          </div>

          {/* Right Panel — Image (~65%) */}
          <div className="w-full md:w-[65%] h-[50vh] md:h-full p-4 pl-0">
            <div className="relative w-full h-full rounded-[24px] overflow-hidden">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                className="object-cover rounded-[24px]"
                sizes="(max-width: 768px) 100vw, 65vw"
                priority
              />
            </div>
          </div>
        </div>
      </main>
      <Contact />
    </div>
  );
}


