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
      className="bg-card pt-24 pb-16 px-[5vw] w-full mx-auto overflow-hidden relative"
      id="featured-works"
    >
      <div className="flex justify-between items-center mb-12 max-w-[1440px] mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
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
