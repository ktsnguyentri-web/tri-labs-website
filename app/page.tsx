import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { FeaturedWorks } from "@/components/sections/FeaturedWorks";
import { ResearchSection } from "@/components/sections/ResearchSection";
import { Contact } from "@/components/sections/Contact";
import { getProjects, getToolArticles, getResearchArticles } from "@/lib/cms";

export default async function Home() {
  const [works, toolArticles, researchArticles] = await Promise.all([
    getProjects(),
    getToolArticles(),
    getResearchArticles(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full">
        <Hero />
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="h-[1px] bg-white/10 mt-6 mb-6" />
        </div>
        <Statement />
        <FeaturedWorks works={works} />
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="h-[1px] bg-white/10 mt-8 mb-6" />
        </div>
        
        {/* Section: Research & Tools */}
        <ResearchSection insights={toolArticles} title="Research & Tools" />
        
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="h-[1px] bg-white/10 mt-8 mb-6" />
        </div>

        {/* Section: Insights */}
        <ResearchSection insights={researchArticles} title="Insights" />

        <Contact />
      </main>
    </div>
  );
}
