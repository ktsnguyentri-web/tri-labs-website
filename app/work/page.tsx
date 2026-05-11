import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { WorkGallery } from "@/components/gallery/WorkGallery";
import { getProjects } from "@/lib/cms";
import { Suspense } from "react";

export default async function WorkPage() {
  const projects = await getProjects();

  // Map Project to the shape expected by WorkGallery (WorkItem)
  const works = projects.map(p => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    category: (p.category || 'Architecture') as 'Architecture' | 'Interior' | 'Design',
    completionYear: p.completionYear || '2023',
    coverImage: p.coverImage,
    span: p.span,
    location: p.location
  }));

  return (
    <div className="min-h-screen bg-black text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <Suspense fallback={<div className="pt-40 px-10">Loading gallery...</div>}>
          <WorkGallery works={works} />
        </Suspense>
        <Contact />
      </main>
    </div>
  );
}

