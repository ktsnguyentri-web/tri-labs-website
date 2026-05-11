import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { CVSection } from "@/components/sections/CVSection";

export default function CVPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <CVSection theme="light" />
        <Contact theme="light" />
      </main>
    </div>
  );
}
