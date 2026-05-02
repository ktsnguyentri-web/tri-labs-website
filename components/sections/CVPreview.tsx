import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CVPreview() {
  return (
    <section
      className="bg-background pt-0 pb-32 px-[5vw] w-full mx-auto relative scroll-mt-[60px]"
      id="about"
    >
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center w-full max-w-[1440px] mx-auto">

        {/* Left Column — Text */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <h2 className="text-5xl md:text-6xl lg:text-[72px] leading-[1.1] font-light text-foreground mb-8">
            Inspired by<br />Nature, Driven by<br />Innovation
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-md leading-relaxed mb-12">
            Tri Nguyen is a multidisciplinary designer working across architecture,
            urbanism, and technology from large-scale cities and buildings to computational design.
          </p>
          <div className="flex flex-row gap-4 items-center">
            <Button asChild>
              <Link href="/cv">VIEW MY CV</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/work">VIEW MY WORK</Link>
            </Button>
          </div>
        </div>

        {/* Right Column — Portrait */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="w-full max-w-[500px] aspect-[4/5] rounded-2xl overflow-hidden bg-secondary relative">
            <Image
              src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1200&q=80"
              alt="Portrait of Tri Nguyen"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              style={{ filter: "grayscale(100%)" }}
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
