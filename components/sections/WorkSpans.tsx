import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const SPANS = [
  {
    title: "Architecture",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    href: "/work?category=Architecture",
  },
  {
    title: "Design",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    href: "/work?category=Design",
  },
  {
    title: "Tool",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    href: "/research#tool",
  },
];

export function WorkSpans() {
  return (
    <section className="bg-card pt-12 pb-32 px-[5vw] w-full mx-auto overflow-hidden relative">

      <div className="flex flex-col gap-16 items-start w-full max-w-[1440px] mx-auto">
        <div className="w-full text-left">
          <h2 className="text-[28px] font-light tracking-[-0.02em] text-black">
            My work spans
          </h2>



        </div>

        <div className="w-full flex gap-4 items-start justify-between h-[450px] md:h-[600px] group/container">
          {SPANS.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="w-full h-full relative cursor-pointer flex-1 transition-all duration-700 ease-in-out group-hover/container:opacity-40 hover:!opacity-100 hover:!flex-[2.5] flex flex-col group/item"
            >
              {/* Image container — relative + h-full enables fill — Rule #3: rounded-[24px] */}
              <div className="relative w-full flex-1 overflow-hidden rounded-[24px] bg-secondary shadow-sm transition-shadow duration-700 group-hover/item:shadow-xl">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover rounded-[24px] transition-all duration-700 group-hover/item:scale-110"
                  style={{ filter: "grayscale(100%) contrast(120%)" }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              {/* Image Labels — Left Aligned + Large Scale (40px) */}
              <div className="mt-8 text-left w-full">
                <h3 className="text-[clamp(32px,3vw,40px)] font-light tracking-[-0.02em] text-foreground flex items-center gap-2 group-hover/item:gap-4 transition-all duration-700">
                  {item.title}
                  <ArrowRight
                    className="w-0 h-8 opacity-0 group-hover/item:w-8 group-hover/item:opacity-100 transition-all duration-700 overflow-hidden"
                    strokeWidth={1}
                  />
                </h3>
              </div>

            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

