import Link from "next/link";
import type { ResearchArticle } from "@/types/cms";
import { ResearchSectionClient } from "@/components/gallery/ResearchSectionClient";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";

interface ResearchSectionProps {
  insights: ResearchArticle[];
}

export function ResearchSection({ insights }: ResearchSectionProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <section
      className="bg-background py-24 w-full mx-auto relative"
      id="research-section"
    >
      <div className="flex flex-col gap-12 w-full max-w-[1440px] mx-auto">
        <div className="flex justify-start items-start">
          <Reveal>
            <h2 className="text-[28px] font-light tracking-[-0.02em] text-black">
              Research and Insights
            </h2>
          </Reveal>
        </div>



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
