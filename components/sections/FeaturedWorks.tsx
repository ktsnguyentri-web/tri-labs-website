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
      className="bg-black pt-4 pb-0 w-full mx-auto overflow-hidden relative"
      id="featured-works"
    >
      <div className="flex flex-col gap-6 md:gap-10 w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="flex justify-between items-end">
          <Reveal width="fit-content">
            <Link 
              href="/work" 
              className="group relative block overflow-hidden"
            >
              <h2 className="text-[22px] md:text-[26px] font-light tracking-tight text-foreground transition-transform duration-500 group-hover:-translate-y-full whitespace-nowrap">
                Featured Works
              </h2>
              <div className="absolute inset-0 flex items-center">
                <h2 className="text-[22px] md:text-[26px] font-light tracking-tight text-foreground translate-y-full transition-transform duration-500 group-hover:translate-y-0 whitespace-nowrap">
                  See All
                </h2>
              </div>
            </Link>
          </Reveal>
        </div>

        <FeaturedGrid works={works} />
      </div>
    </section>
  );
}
