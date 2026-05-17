import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { WorkGallery } from "@/components/gallery/WorkGallery";
import { getProjects } from "@/lib/cms";
import { Suspense } from "react";

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#61F9E9] selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        {/* Intro / Disclaimer Header */}
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-20 pb-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white mb-6 uppercase">
            Work
          </h1>
          <p className="font-mono text-[11px] text-white/50 max-w-xl uppercase tracking-widest leading-relaxed">
            Selected professional and independent works. Credits and individual contributions are noted per project.
          </p>
        </div>

        <Suspense fallback={<div className="pt-20 px-10 font-mono text-[10px] text-white/40 uppercase tracking-widest">Loading visual chronicles...</div>}>
          <WorkGallery works={projects} />
        </Suspense>
        <Contact />
      </main>
    </div>
  );
}
