import { Navbar } from "@/components/Navbar";
import { Contact } from "@/components/Contact";
import { CVSection } from "@/components/CVSection";

export default function CVPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-16">
        <CVSection />
        <Contact />
      </main>
    </div>
  );
}
