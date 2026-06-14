import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";

export function CVPreview() {
  return (
    <section
      className="bg-black pt-0 pb-32 px-6 md:px-10 w-full mx-auto relative scroll-mt-[60px]"
      id="about"
    >
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center w-full max-w-[1440px] mx-auto">
        
        {/* Left Column — Portrait */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-start">
          <Reveal delay={0.2}>
            <div className="w-full max-w-[500px] aspect-[4/5] overflow-hidden bg-black relative">
              <Image
                src="/portrait.jpg"
                alt="Portrait of Tri Nguyen Minh"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
          </Reveal>
        </div>

        {/* Right Column — Text */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <Reveal delay={0.3}>
            <h2 className="text-[clamp(48px,6vw,84px)] font-light leading-[1.05] tracking-[-0.04em] text-white mb-16">
              Architecture as Foundation Tech as Playground
            </h2>

            <p className="font-sans text-lg text-white/50 max-w-md leading-relaxed mb-12">
              I weave architectural rigour with emerging tech—from real-time rendering to automation—to discover new ways of visualizing our world. At Tri-Labs, every project is a lab for exploration.
            </p>

            <div className="flex flex-row gap-4 items-center">
              <Button asChild variant="outline" className="text-[10px] h-9 px-6 border-white/20 hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                <Link href="/cv">VIEW MY CV</Link>
              </Button>
              <Button asChild variant="outline" className="text-[10px] h-9 px-6 border-white/20 hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                <Link href="/work">VIEW MY WORK</Link>
              </Button>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
