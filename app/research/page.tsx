import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { getAllResearchInsights } from "@/lib/cms";
import { ResearchGallery } from "@/components/sections/ResearchGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research & Insights | Tri Labs",
  description: "Updates and news from the Tri Labs team.",
};

export default async function ResearchPage() {
  const insights = await getAllResearchInsights();
  const researchArticles = insights.filter(item => item.category === 'Research');

  return (
    <div className="min-h-screen bg-black text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <ResearchGallery researchArticles={researchArticles} />
        <Contact />
      </main>
    </div>
  );
}
