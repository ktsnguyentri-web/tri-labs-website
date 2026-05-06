import type { Project } from "@/types/cms";
import Link from "next/link";
import { FeaturedGrid } from "@/components/gallery/FeaturedGrid";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/button";

interface FeaturedWorksProps {
  works: Project[];
}

export function FeaturedWorks({ works }: FeaturedWorksProps) {
  return (
    <section
      className="bg-card pt-4 pb-0 w-full mx-auto overflow-hidden relative"
      id="featured-works"
    >
      <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="flex justify-between items-end">
          <Reveal width="fit-content">
            <h2 className="text-[28px] md:text-[32px] font-light tracking-tight text-foreground">
              Featured Works
            </h2>
          </Reveal>
          <Reveal delay={0.2} width="fit-content">
            <Link 
              href="/work" 
              className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 hover:text-foreground transition-colors uppercase flex items-center gap-2 mb-2"
            >
              See all projects <span>&gt;</span>
            </Link>
          </Reveal>
        </div>

        <FeaturedGrid works={works} />
      </div>
    </section>
  );
}
