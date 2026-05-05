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
    <div className="min-h-screen bg-[#F9F9F9] text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px] min-h-[calc(100vh-60px)]">
        <div className="max-w-[1440px] mx-auto w-full pt-12 pb-32 px-[5vw]">
          <div className="bg-white w-full max-w-7xl h-auto md:h-[85vh] rounded-[6px] overflow-hidden flex flex-col md:flex-row shadow-xl relative">

            {/* Left: Content (2/3 on desktop) */}
            <div className="w-full md:w-[40%] p-8 md:p-16 flex flex-col justify-between bg-white border-r border-black/5">
              <Reveal>
                <div>
                  <div className="label-caps text-[#4C4546]/40 mb-2">{project.location}</div>
                  <h1 className="text-[48px] md:text-[64px] font-light tracking-tight leading-none mb-8 text-black uppercase">
                    {project.title}
                  </h1>

                  <div className="flex flex-col gap-8">
                    <p className="text-base text-[#4C4546] leading-relaxed max-w-md opacity-80">
                      {project.description}
                    </p>

                    <div className="flex flex-col gap-2">
                      <div className="label-caps text-[10px] text-[#4C4546]/60">Year</div>
                      <div className="data-mono text-black">{project.completionYear}</div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-12 flex items-center gap-6">
                  <Button size="sm" variant="outline" className="text-[10px] h-8 px-4">
                    VISIT PROJECT
                  </Button>
                  <Link
                    href="/work"
                    className="label-caps text-[10px] hover:text-black transition-colors flex items-center gap-2"
                  >
                    ← BACK TO PROJECTS
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right: Cover Image (3/5 on desktop) */}
            <div className="w-full md:w-[60%] bg-secondary relative h-[400px] md:h-full">
              <Reveal delay={0.1} className="h-full">
                <div className="relative w-full h-full rounded-[6px] overflow-hidden">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover rounded-[6px]"
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Contact />
    </div>
  );
}

