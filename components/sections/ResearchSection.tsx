import Link from "next/link";
import type { ResearchArticle } from "@/types/cms";
import { ResearchSectionClient } from "@/components/gallery/ResearchSectionClient";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";

interface ResearchSectionProps {
  insights: ResearchArticle[];
  title?: string;
}

export function ResearchSection({ insights, title = "Research & Tools" }: ResearchSectionProps) {
  if (!insights || insights.length === 0) return null;

  const sectionId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <section
      className="bg-background pt-8 pb-0 w-full mx-auto relative"
      id={sectionId}
    >
      <div className="flex flex-col gap-12 w-full max-w-[1440px] mx-auto px-10">
        <div className="flex justify-start items-start">
          <Reveal>
            <h2 className="text-[28px] font-light tracking-[-0.02em] text-foreground">
              {title}
            </h2>
          </Reveal>
        </div>

        <ResearchSectionClient insights={insights} />

        <div className="mt-4 flex justify-center">
          <Button asChild>
            <Link href="/research">Read more</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
