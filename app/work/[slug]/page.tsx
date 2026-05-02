import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Format the slug for display (e.g. "shenzhen-bay" → "Shenzhen Bay")
  const title = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <div className="max-w-3xl mx-auto pt-0 pb-20 px-6 md:px-12">

          {/* Back Link */}
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#4C4546] hover:text-black transition-colors mb-16"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Work
          </Link>

          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-black leading-[1.1] font-sans mb-8">
            {title}
          </h1>

          <p className="font-sans text-lg text-[#4C4546] leading-relaxed">
            This project detail page is coming soon. Full CMS integration is in progress — check back after the Headless CMS is connected.
          </p>
        </div>

        <Contact />
      </main>
    </div>
  );
}
