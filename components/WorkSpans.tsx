import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function WorkSpans() {
  return (
    <section className="bg-card pt-24 pb-16 px-[5vw] w-full mx-auto overflow-hidden relative">
      <div className="flex flex-col gap-12 items-center w-full mb-16 md:mb-32 max-w-[1440px] mx-auto">
        <div className="w-full text-center pt-4">
          <h2 className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
            My work spans
          </h2>
        </div>
        
        <div className="w-full flex gap-1 md:gap-4 items-start justify-center h-[450px] md:h-[550px] group/container">
          {[
            { title: "Architecture", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", href: "/work?category=Architecture" },
            { title: "Design", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", href: "/work?category=Design" },
            { title: "Tool", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", href: "/research#tool" }
          ].map((item, i) => (
            <Link 
              key={i} 
              href={item.href}
              className="w-full h-full relative cursor-pointer flex-1 transition-all duration-700 ease-in-out group-hover/container:opacity-40 hover:!opacity-100 hover:!flex-[3] flex flex-col group/item"
            >
              <div className="relative w-full h-full overflow-hidden rounded-2xl bg-secondary shadow-lg transition-shadow duration-700 group-hover/item:shadow-2xl">
                <img 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover/item:scale-110" 
                  src={item.img} 
                  style={{ filter: "grayscale(100%) contrast(120%)" }}
                />
              </div>
              <div className="mt-6 text-center w-full flex justify-center">
                <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-0 group-hover/item:gap-2 transition-all duration-700">
                  {item.title}
                  <ArrowRight className="w-0 h-6 opacity-0 group-hover/item:w-6 group-hover/item:opacity-100 transition-all duration-700 overflow-hidden" strokeWidth={1.5} />
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
