import { ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/cms";
import Link from "next/link";
import { FeaturedGrid } from "./FeaturedGrid";

export async function FeaturedWorks() {
  const works = await getProjects();

  return (
    <section className="bg-card pt-24 pb-16 px-[5vw] w-full mx-auto overflow-hidden relative" id="featured-works">
      <div className="flex justify-between items-center mb-6 max-w-[1440px] mx-auto w-full">
        <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">Featured Works</h2>
        <Link href="/work" className="px-4 py-1.5 bg-secondary hover:bg-muted text-[10px] font-mono uppercase tracking-widest rounded-full transition-colors flex items-center gap-2 text-muted-foreground border border-transparent hover:border-border">
          ALL WORK <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      </div>
      <FeaturedGrid works={works} />
    </section>
  );
}
