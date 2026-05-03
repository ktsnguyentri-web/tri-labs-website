export function Statement() {
  return (
    <section className="bg-white pt-24 pb-12 px-[5vw] w-full mx-auto relative scroll-mt-[60px]" id="statement">


      <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-[1440px] mx-auto gap-12 md:gap-20">

        {/* Left Column (1/3) — Metadata */}
        <div className="col-span-1 pt-4">
          <div className="flex flex-col gap-2">
            <span className="label-caps text-[14px] font-bold tracking-[0.2em] text-[#4C4546]">
              TRI NGUYEN MINH
            </span>
            <span className="label-caps text-[11px] font-bold tracking-[0.2em] text-[#4C4546]/60">
              Architect & Design Tech Explorer
            </span>
          </div>
        </div>

        {/* Right Column (2/3) — Tagline */}
        <div className="col-span-1 md:col-span-2">
          <p className="text-[clamp(48px,6vw,84px)] font-light leading-[1.05] tracking-[-0.04em] text-black">
            Exploring the evolving intersection of architectural craft and digital innovation
          </p>
        </div>

      </div>
    </section>
  );
}

