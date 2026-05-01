export function Statement() {
  return (
    <section className="bg-card py-12 px-[5vw] w-full mx-auto relative">
      <div className="flex flex-col md:flex-row gap-12 items-start w-full pt-12 max-w-[1440px] mx-auto">
        <div className="w-full md:w-1/3 pt-2">
          <div className="font-mono text-xs uppercase text-foreground tracking-widest flex flex-col gap-1">
            <span className="font-bold inline-block w-fit relative group cursor-default">
              TRI NGUYEN
              <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-accent -rotate-1 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </span>
            <span className="text-muted-foreground">FOUNDER & PRINCIPLE PARTNER</span>
          </div>
        </div>
        <div className="w-full md:w-2/3">
          <p className="font-sans text-3xl md:text-5xl lg:text-5xl font-light leading-tight text-foreground tracking-tight">
            Building spaces and tools that bridge the gap between physical and digital experiences
          </p>
        </div>
      </div>
    </section>
  );
}
