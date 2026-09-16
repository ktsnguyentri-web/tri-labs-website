import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { getProjectBySlug, getProjects } from "@/lib/cms";
import { notFound } from "next/navigation";
import { ProjectDetailLayout } from "@/components/project/ProjectDetailLayout";
import { Metadata } from "next";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Tri Nguyen Minh",
    };
  }

  return {
    title: `${project.title} | Tri Nguyen Minh`,
    description:
      project.description ||
      `${project.title} — ${project.category || "Architecture"} in ${project.location}`,
    openGraph: {
      title: `${project.title} | Tri Nguyen Minh`,
      description:
        project.description ||
        `${project.title} — ${project.category || "Architecture"} in ${project.location}`,
      images: project.heroImage ? [{ url: project.heroImage }] : [],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <Navbar />

      <main className="w-full pt-16 sm:pt-20">
        <ProjectDetailLayout project={project} />
      </main>

      <Contact />
    </div>
  );
}
