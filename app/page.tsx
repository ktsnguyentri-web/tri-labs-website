import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Statement } from "@/components/Statement";
import { WorkSpans } from "@/components/WorkSpans";
import { FeaturedWorks } from "@/components/FeaturedWorks";
import { ResearchSection } from "@/components/ResearchSection";
import { CVPreview } from "@/components/CVPreview";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <Hero />
        <Statement />
        <WorkSpans />
        <FeaturedWorks />
        <ResearchSection />
        <CVPreview />
        <Contact />
      </main>
    </div>
  );
}


