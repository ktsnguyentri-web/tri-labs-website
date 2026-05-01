import { ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/cms";
import Link from "next/link";

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
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[280px] gap-4 grid-flow-dense w-full max-w-[1440px] mx-auto">
        {works.map((work, i) => (
          <div key={i} className={`${work.span} overflow-hidden rounded-xl bg-secondary relative group cursor-pointer`}>
            <img
              alt={work.title}
              className="w-full h-full object-cover object-center transition-opacity duration-700"
              src={work.img}
              style={{ filter: i % 3 === 0 ? "none" : "grayscale(100%) contrast(120%)" }}
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="font-mono text-white">
                <div className="text-sm font-bold uppercase tracking-wider mb-1">{work.title}</div>
                <div className="text-[10px] opacity-70 uppercase tracking-widest">{work.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
