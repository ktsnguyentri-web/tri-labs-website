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
      className="bg-background pt-4 pb-0 w-full mx-auto relative"
      id={sectionId}
    >
      <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="flex justify-between items-end">
          <Reveal width="fit-content">
            <h2 className="text-[28px] md:text-[32px] font-light tracking-tight text-foreground">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.2} width="fit-content">
            <Link 
              href="/research" 
              className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors uppercase flex items-center gap-2 mb-2"
            >
              See all {title} <span>&gt;</span>
            </Link>
          </Reveal>
        </div>

        <ResearchSectionClient insights={insights} />
      </div>
    </section>
  );
}
