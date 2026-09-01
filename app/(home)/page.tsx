import { Navbar } from "@/components/layout/Navbar";
import { HeroPersonal } from "@/components/sections/HeroPersonal";
import { PortfolioAccordion } from "@/components/accordion/PortfolioAccordion";
import { Contact } from "@/components/sections/Contact";
import {
  getProjects,
  getAllResearchInsights,
  getCareerExperiences,
  getEducation,
  getToolkits,
  getProfile,
} from "@/lib/cms";

export default async function Home() {
  const [
    projects,
    labArticles,
    careerExperiences,
    education,
    toolkits,
    profile,
  ] = await Promise.all([
    getProjects(),
    getAllResearchInsights(),
    getCareerExperiences(),
    getEducation(),
    getToolkits(),
    getProfile(),
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col justify-between transition-colors duration-300">
      <Navbar />
      <main className="w-full flex-1 flex flex-col justify-start">
        {/* ── Above the Fold: Identity & Actionable Bio ──────────── */}
        <HeroPersonal profile={profile} />

        {/* ── Interactive Collapsible Accordion & Carousels ──────── */}
        <div className="w-full mt-2 sm:mt-3">
          <PortfolioAccordion
            projects={projects}
            labArticles={labArticles}
            careerExperiences={careerExperiences}
            education={education}
            toolkits={toolkits}
            profile={profile}
          />
        </div>
      </main>

      {/* ── Bottom Contact & Editorial Footer ──────────────────── */}
      <Contact email={profile.contact.email} />
    </div>
  );
}

