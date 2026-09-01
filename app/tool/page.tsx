import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { getAllResearchInsights } from "@/lib/cms";
import { ToolGallery } from "@/components/sections/ToolGallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | Tri Labs",
  description: "Internal tools and computational workflows developed by Tri Labs.",
};

export default async function ToolPage() {
  const insights = await getAllResearchInsights();
  const toolArticles = insights.filter(item => item.category === 'Tool');

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <Navbar />
      <main className="w-full pt-[60px]">
        <ToolGallery toolArticles={toolArticles} />
        <Contact />
      </main>
    </div>
  );
}
