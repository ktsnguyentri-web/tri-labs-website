import { ArrowRight } from "lucide-react";
import { getFeaturedLog } from "@/lib/cms";

export async function LogSection() {
  const featuredLog = await getFeaturedLog();

  if (!featuredLog) return null;

  return (
    <section className="bg-card py-24 px-[5vw] w-full mx-auto relative" id="blog-section">
      <div className="flex flex-col gap-12 w-full max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end border-b border-border pb-4">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight text-foreground">Log</h2>
        </div>

        {/* Magazine Split Layout */}
        <div className="flex flex-col md:flex-row w-full overflow-hidden rounded-xl">
          {/* Left Column - 65% Image */}
          <div className="w-full md:w-[65%] h-[400px] md:h-[600px] relative">
            <img
              src={featuredLog.img}
              alt={featuredLog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Column - 35% Dark Text Box */}
          <div className="w-full md:w-[35%] bg-foreground text-background p-8 md:p-12 flex flex-col justify-center">
            <span className="font-mono text-xs tracking-widest text-background/60 mb-6">
              {featuredLog.date}
            </span>
            <h3 className="font-sans text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {featuredLog.title}
            </h3>
            <div 
              className="font-sans text-base text-background/80 leading-relaxed mb-10"
              dangerouslySetInnerHTML={{ __html: featuredLog.contentHtml }}
            />
            <button className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors w-max group">
              READ MORE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Global Button */}
        <div className="pt-4 flex justify-center md:justify-end">
          <button className="px-6 py-3 bg-card border border-foreground hover:bg-foreground hover:text-background text-foreground text-xs font-mono uppercase tracking-widest rounded-full transition-all flex items-center gap-3 w-max">
            ALL LOGS <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
