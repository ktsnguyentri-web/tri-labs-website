import Link from "next/link";
import type { ResearchArticle } from "@/types/cms";
import { ResearchSectionClient } from "@/components/gallery/ResearchSectionClient";
import { Button } from "@/components/ui/button";

interface ResearchSectionProps {
  insights: ResearchArticle[];
}

export function ResearchSection({ insights }: ResearchSectionProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <section
      className="bg-background py-24 px-[5vw] w-full mx-auto relative"
      id="research-section"
    >
      <div className="flex flex-col gap-16 w-full max-w-[1440px] mx-auto">
        <h2 className="text-5xl md:text-[80px] font-light tracking-[-0.04em] leading-none text-center text-black mb-8">
          Research and Insights
        </h2>

        <ResearchSectionClient insights={insights} />

        <div className="pt-8 flex justify-center">
          <Button asChild>
            <Link href="/research">Read more</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
