import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { FeaturedWorks } from "@/components/sections/FeaturedWorks";
import { ResearchSection } from "@/components/sections/ResearchSection";
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
      <main className="w-full">
        <Hero />
        <div className="h-[1px] bg-black/10 my-20" />
        <Statement />
        <FeaturedWorks works={works} />
        <div className="h-[1px] bg-black/10 my-20" />
        <ResearchSection insights={insights} />
        <div className="h-[1px] bg-black/10 my-20" />
        <Contact />
      </main>
    </div>
  );
}
