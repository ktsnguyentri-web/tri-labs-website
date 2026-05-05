import type { Project } from "@/types/cms";
import Link from "next/link";
import { FeaturedGrid } from "@/components/gallery/FeaturedGrid";
import { Button } from "@/components/ui/button";

interface FeaturedWorksProps {
  works: Project[];
}

export function FeaturedWorks({ works }: FeaturedWorksProps) {
  return (
    <section
      className="bg-card pt-6 pb-0 w-full mx-auto overflow-hidden relative"
      id="featured-works"
    >
      <div className="flex justify-start items-start mb-12 max-w-[1440px] mx-auto w-full px-10">
        <h2 className="text-[28px] font-light tracking-[-0.02em] text-foreground">
          Featured Works
        </h2>

      </div>


      <FeaturedGrid works={works} />

      <div className="mt-16 flex justify-center w-full">
        <Button asChild>
          <Link href="/work">ALL WORK</Link>
        </Button>
      </div>
    </section>
  );
}
