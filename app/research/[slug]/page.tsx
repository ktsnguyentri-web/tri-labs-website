import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { getResearchBySlug, getAllResearchInsights } from "@/lib/cms";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { Reveal } from "@/components/animations/Reveal";

export async function generateStaticParams() {
  const insights = await getAllResearchInsights();
  return insights.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getResearchBySlug(slug);
  if (!article) return { title: "Not Found | Tri Labs" };
  return {
    title: `${article.title} | Tri Labs`,
    description: article.excerpt,
  };
}

export default async function ResearchArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getResearchBySlug(slug);

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <div className="max-w-3xl mx-auto pt-0 pb-20 px-6 md:px-12">

          {/* Back Link */}
          <Reveal>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-[#4C4546] hover:text-black transition-colors mb-16"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Research
            </Link>
          </Reveal>

          {/* Article Header */}
          <Reveal delay={0.1}>
            <header className="mb-12 pb-12 border-b border-gray-100">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-[#4C4546]">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                  <span>{article.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-black leading-[1.1] font-sans">
                  {article.title}
                </h1>
                <div className="text-[#4C4546] font-sans text-lg italic">
                  By Tri Labs Team
                </div>
              </div>
            </header>
          </Reveal>

          {/* Article Body - Prose */}
          <Reveal delay={0.2}>
            <div
              className="prose prose-lg max-w-none prose-headings:text-black prose-headings:font-medium prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:font-sans prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-[12px] prose-strong:text-black"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </Reveal>

          {/* Footer */}
          <Reveal delay={0.3}>
            <div className="mt-20 pt-10 border-t border-gray-100">
              <Link
                href="/research"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-black hover:opacity-70 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Research
              </Link>
            </div>
          </Reveal>
        </div>

        <Contact />
      </main>
    </div>
  );
}
