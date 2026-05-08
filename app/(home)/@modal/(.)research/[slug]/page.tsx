import { getResearchBySlug } from "@/lib/cms";
import { ArticleModal } from "@/components/modals/ArticleModal";
import { notFound } from "next/navigation";

export default async function ResearchInterceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getResearchBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticleModal article={article} />;
}
