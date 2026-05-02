import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getResearchInsights } from "@/lib/cms";
import { ResearchSectionClient } from "./ResearchSectionClient";

export async function ResearchSection() {
  const insights = await getResearchInsights();

  if (!insights || insights.length === 0) return null;

  return (
    <section className="bg-background py-24 px-[5vw] w-full mx-auto relative" id="research-section">
      <div className="flex flex-col gap-16 w-full max-w-[1440px] mx-auto">
        <h2 className="text-5xl md:text-[80px] font-light tracking-[-0.04em] leading-none text-center text-black mb-8">
          Research and Insights
        </h2>

        {/* 3-Column Grid */}
        <ResearchSectionClient insights={insights} />

        {/* Global Button */}
        <div className="pt-8 flex justify-center">
          <Link 
            href="/research"
            className="px-6 py-3 bg-[#4C4546] hover:bg-black text-white text-[12px] font-bold uppercase tracking-[0.1em] rounded-full transition-all flex items-center gap-2 w-max"
          >
            Read more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
