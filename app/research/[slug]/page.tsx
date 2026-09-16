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
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <Navbar />
      <main className="w-full pt-[60px]">
        <div className="max-w-3xl mx-auto pt-0 pb-20 px-6 md:px-12">

          {/* Back Link */}
          <Reveal>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-16"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Research
            </Link>
          </Reveal>

          {/* Article Header */}
          <Reveal delay={0.1}>
            <header className="mb-12 pb-12 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
                  <span>{article.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 leading-[1.1] font-sans">
                  {article.title}
                </h1>
                <div className="text-neutral-500 dark:text-neutral-400 font-sans text-lg italic">
                  By Tri Labs Team
                </div>
              </div>
            </header>
          </Reveal>

          {/* Article Body - Prose */}
          <Reveal delay={0.2}>
            <div
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-medium prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100 prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-p:leading-[1.8] prose-p:font-sans prose-a:text-neutral-900 dark:prose-a:text-neutral-100 prose-a:underline hover:opacity-70 prose-img:rounded-none prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          </Reveal>

          {/* Footer */}
          <Reveal delay={0.3}>
            <div className="mt-20 pt-10 border-t border-neutral-200 dark:border-neutral-800">
              <Link
                href="/research"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity"
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
