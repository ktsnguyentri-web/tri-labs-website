import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CVSection() {
  return (
    <section className="bg-card pt-0 pb-32 px-[5vw] w-full mx-auto relative" id="cv-section">
      <div className="flex flex-col gap-24 w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row gap-12 w-full">
          <div className="w-full md:w-1/3">
            <h2 className="text-6xl md:text-8xl font-light tracking-tighter text-foreground relative inline-block group cursor-default">
              CV
              <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-accent -rotate-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </h2>
          </div>
          <div className="w-full md:w-2/3">
            <p className="font-sans text-2xl md:text-3xl text-foreground/80 leading-tight tracking-tight mb-12">
              A multidisciplinary architect and designer dedicated to the intersection of physical space and computational tools.
            </p>
            <Button icon={<Download className="w-5 h-5" strokeWidth={1.5} />}>
              DOWNLOAD FULL CV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="md:col-span-2">
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-10 font-bold border-b border-border/20 pb-4">Experience</h3>
            <div className="flex flex-col gap-12">
              <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                <div className="font-mono text-xs text-muted-foreground w-32 shrink-0">2020 — PRES.</div>
                <div>
                  <h4 className="font-sans text-2xl font-medium text-foreground mb-1">Founder & Principal Architect</h4>
                  <p className="font-sans text-lg text-muted-foreground mb-4">TRI NGUYEN Studio, Ho Chi Minh City</p>
                  <p className="font-sans text-sm text-foreground/70 leading-relaxed max-w-xl">Leading a studio focused on experimental architectural forms and custom BIM plugins.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                <div className="font-mono text-xs text-muted-foreground w-32 shrink-0">2015 — 2020</div>
                <div>
                  <h4 className="font-sans text-2xl font-medium text-foreground mb-1">Senior Associate / Lead Designer</h4>
                  <p className="font-sans text-lg text-muted-foreground mb-4">Global Design Partners, London / HK</p>
                  <p className="font-sans text-sm text-foreground/70 leading-relaxed max-w-xl">Headed the Computational Design Group. Awarded "Young Architect of the Year" in 2018.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                <div className="font-mono text-xs text-muted-foreground w-32 shrink-0">2013 — 2015</div>
                <div>
                  <h4 className="font-sans text-2xl font-medium text-foreground mb-1">Architectural Designer</h4>
                  <p className="font-sans text-lg text-muted-foreground mb-4">Format & Scale, New York</p>
                  <p className="font-sans text-sm text-foreground/70 leading-relaxed max-w-xl">Focused on parametric façade optimization and sustainable material sourcing.</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-10 font-bold border-b border-border/20 pb-4">Education</h3>
            <div className="flex flex-col gap-12">
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-2">2011 — 2013</div>
                <h4 className="font-sans text-xl font-medium text-foreground">M.Arch II</h4>
                <p className="font-sans text-sm text-muted-foreground">Graduate School of Design, Harvard University</p>
              </div>
              <div>
                <div className="font-mono text-xs text-muted-foreground mb-2">2006 — 2011</div>
                <h4 className="font-sans text-xl font-medium text-foreground">Bachelor of Architecture</h4>
                <p className="font-sans text-sm text-muted-foreground">Southern California Institute of Architecture</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
