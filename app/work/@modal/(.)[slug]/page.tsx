import { getProjectBySlug } from "@/lib/cms";
import { ProjectModal } from "@/components/modals/ProjectModal";
import { notFound } from "next/navigation";

export default async function ProjectInterceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectModal project={project} />;
}
