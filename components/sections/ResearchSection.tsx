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
      className="bg-black pt-4 pb-0 w-full mx-auto relative"
      id={sectionId}
    >
      <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="flex justify-between items-end">
          <Reveal width="fit-content">
            <Link 
              href={title.toLowerCase().includes('tool') ? "/tool" : "/research"}
              className="group relative block overflow-hidden"
            >
              <h2 className="text-[22px] md:text-[26px] font-light tracking-tight text-foreground transition-transform duration-500 group-hover:-translate-y-full whitespace-nowrap">
                {title}
              </h2>
              <div className="absolute inset-0 flex items-center">
                <h2 className="text-[22px] md:text-[26px] font-light tracking-tight text-foreground translate-y-full transition-transform duration-500 group-hover:translate-y-0 whitespace-nowrap">
                  See All
                </h2>
              </div>
            </Link>
          </Reveal>
        </div>

        <ResearchSectionClient insights={insights} />
      </div>
    </section>
  );
}
