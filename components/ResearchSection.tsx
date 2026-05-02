import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getResearchInsights } from "@/lib/cms";

export async function ResearchSection() {
  const insights = await getResearchInsights();

  if (!insights || insights.length === 0) return null;

  return (
    <section className="bg-background py-24 px-[5vw] w-full mx-auto relative" id="research-section">
      <div className="flex flex-col gap-16 w-full max-w-[1440px] mx-auto">
        <h2 className="text-5xl md:text-[80px] font-light tracking-[-0.04em] leading-none text-center text-black mb-8">
          Research and Insights
        </h2>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {insights.map((item) => (
            <Link 
              key={item.slug} 
              href={`/research/${item.slug}`}
              className="flex flex-col gap-4 group cursor-pointer h-full"
            >
              <div className="flex flex-col gap-2 flex-grow">
                <span className="font-mono text-[14px] uppercase tracking-[0.05em] text-[#4C4546]">
                  {item.date} | {item.category}
                </span>
                <h3 className="font-sans text-[32px] font-medium tracking-[-0.02em] leading-[1.2] text-black group-hover:text-[#4C4546] transition-colors truncate">
                  {item.title}
                </h3>
                <p className="font-sans text-[16px] leading-[1.6] text-[#4C4546] line-clamp-2">
                  {item.excerpt}
                </p>
              </div>
              <div className="w-full aspect-video relative overflow-hidden rounded-2xl mt-auto">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Global Button */}
        <div className="pt-8 flex justify-center">
          <Link 
            href="/research"
            className="px-6 py-3 bg-[#4C4546] hover:bg-black text-white text-[12px] font-bold uppercase tracking-[0.1em] rounded-full transition-all flex items-center gap-2 w-max"
          >
            Read more <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
