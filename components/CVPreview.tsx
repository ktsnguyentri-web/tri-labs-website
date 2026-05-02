import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CVPreview() {
  return (
    <section className="bg-background py-32 px-[5vw] w-full mx-auto relative scroll-mt-[60px]" id="about">
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center w-full max-w-[1440px] mx-auto">
        {/* Left Column (Text) */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <h2 className="text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-light text-foreground mb-8">
            Inspired by<br/>Nature, Driven by<br/>Innovation
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-md leading-relaxed mb-12">
            Tri Nguyen is a multidisciplinary designer working across architecture, urbanism, and technology from large-scale cities and buildings to computational design.
          </p>
          <div className="flex flex-row gap-4 items-center">
            <Link href="/cv" className="px-6 py-3 bg-[#F3F4F6] text-black hover:bg-[#E5E7EB] text-[10px] font-sans font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-3 w-max">
              VIEW MY CV <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
            </Link>
            <Link href="/work" className="px-6 py-3 bg-[#F3F4F6] text-black hover:bg-[#E5E7EB] text-[10px] font-sans font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-3 w-max">
              VIEW MY WORK <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* Right Column (Image) */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="w-full max-w-[500px] aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
            <img 
              src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1200&q=80" 
              alt="Portrait Preview" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
