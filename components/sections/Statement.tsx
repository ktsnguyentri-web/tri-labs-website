import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";

export function Statement() {
  return (
    <section className="bg-background pt-8 pb-12 w-full mx-auto relative scroll-mt-[60px]" id="statement">


      <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-[1440px] mx-auto gap-8 md:gap-20 px-4 md:px-10">

        {/* Left Column (1/3) — Metadata */}
        <div className="col-span-1 pt-4">
          <Reveal>
            <div className="flex flex-col gap-2">
              <span className="label-caps text-[14px] font-bold tracking-[0.2em] text-foreground">
                TRI NGUYEN MINH
              </span>
              <span className="label-caps text-[11px] font-bold tracking-[0.2em] text-foreground/60">
                Architect & Design Tech Explorer
              </span>
              <div className="mt-8">
                <Button asChild variant="outline" className="h-9 text-[10px] tracking-[0.2em] border-white/20 hover:bg-white hover:text-black transition-all duration-300">
                  <Link href="/cv">VIEW MY CV</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right Column (2/3) — Tagline */}
        <div className="col-span-1 md:col-span-2">
          <Reveal delay={0.2}>
            <p className="text-[clamp(48px,6vw,84px)] font-light leading-[1.05] tracking-[-0.04em] text-foreground">
              Exploring the evolving intersection of architectural craft and digital innovation
            </p>
          </Reveal>
        </div>

      </div>
    </section>
  );
}

