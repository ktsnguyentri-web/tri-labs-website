import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { WorkSpans } from "@/components/sections/WorkSpans";
import { FeaturedWorks } from "@/components/sections/FeaturedWorks";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { CVPreview } from "@/components/sections/CVPreview";
import { Contact } from "@/components/sections/Contact";
import { getProjects, getResearchInsights } from "@/lib/cms";

export default async function Home() {
  const [works, insights] = await Promise.all([
    getProjects(),
    getResearchInsights(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <Hero />
        <Statement />
        <WorkSpans />
        <FeaturedWorks works={works} />
        <ResearchSection insights={insights} />
        <CVPreview />
        <Contact />
      </main>
    </div>
  );
}
