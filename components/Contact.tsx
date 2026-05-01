import { ArrowRight } from "lucide-react";

export function Contact() {
  return (
    <section 
      className="bg-card py-32 px-[5vw] w-full mx-auto relative border-t border-border" 
      id="contact-section"
    >
      <div className="flex flex-col gap-16 w-full max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-8 items-start">
          <h2 className="text-6xl md:text-[100px] font-bold tracking-tighter text-foreground leading-none">
            Let's build<br />something.
          </h2>
          <a 
            className="text-2xl md:text-4xl font-medium text-foreground hover:text-accent transition-colors inline-flex items-center gap-4 group" 
            href="mailto:hello@tringuyen.studio"
          >
            hello@tringuyen.studio
            <ArrowRight className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-2 transition-transform" strokeWidth={1.5} />
          </a>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end pt-16 border-t border-foreground w-full gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
              Social
            </h4>
            <div className="flex flex-col gap-2">
              <a className="font-sans text-lg text-foreground hover:text-accent transition-colors" href="#">
                Instagram
              </a>
              <a className="font-sans text-lg text-foreground hover:text-accent transition-colors" href="#">
                LinkedIn
              </a>
            </div>
          </div>
          
          <div className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            © 2024 Tri Nguyen Studio. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
}
