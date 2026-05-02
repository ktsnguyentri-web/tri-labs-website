import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { CVSection } from "@/components/sections/CVSection";

export default function CVPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <CVSection />
        <Contact />
      </main>
    </div>
  );
}
