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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <Navbar />
      <main className="w-full pt-[60px]">
        <ResearchGallery researchArticles={researchArticles} />
        <Contact />
      </main>
    </div>
  );
}
