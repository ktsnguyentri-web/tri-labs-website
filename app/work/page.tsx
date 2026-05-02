import { Navbar } from "@/components/layout/Navbar";
import { Contact } from "@/components/sections/Contact";
import { WorkGallery } from "@/components/gallery/WorkGallery";
import type { WorkItem } from "@/types/cms";
import { Suspense } from "react";

export default function WorkPage() {
  /**
   * Mock data — will be replaced by a CMS fetch (e.g. getProjects()) once
   * slugs and completionYear are provided by the Headless CMS.
   */
  const mockWorks: WorkItem[] = [
    {
      id: 1,
      slug: "shenzhen-bay-culture-park",
      title: "Shenzhen Bay Culture Park",
      category: "Architecture",
      completionYear: "2023",
      span: "md:col-span-2 md:row-span-2",
      coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      slug: "minimalist-loft",
      title: "Minimalist Loft",
      category: "Interior",
      completionYear: "2023",
      span: "md:col-span-1 md:row-span-1",
      coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      slug: "harbin-opera-house",
      title: "Harbin Opera House",
      category: "Architecture",
      completionYear: "2022",
      span: "md:col-span-1 md:row-span-2",
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      slug: "urban-concrete-apartment",
      title: "Urban Concrete Apartment",
      category: "Interior",
      completionYear: "2022",
      span: "md:col-span-1 md:row-span-1",
      coverImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 5,
      slug: "absolute-towers",
      title: "Absolute Towers",
      category: "Architecture",
      completionYear: "2021",
      span: "md:col-span-2 md:row-span-1",
      coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 6,
      slug: "ordos-museum",
      title: "Ordos Museum",
      category: "Architecture",
      completionYear: "2021",
      span: "md:col-span-1 md:row-span-2",
      coverImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 7,
      slug: "huzhou-sheraton",
      title: "Huzhou Sheraton",
      category: "Architecture",
      completionYear: "2020",
      span: "md:col-span-1 md:row-span-1",
      coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 8,
      slug: "nordic-office-space",
      title: "Nordic Office Space",
      category: "Interior",
      completionYear: "2020",
      span: "md:col-span-2 md:row-span-1",
      coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 9,
      slug: "parametric-furniture",
      title: "Parametric Furniture",
      category: "Design",
      completionYear: "2020",
      span: "md:col-span-1 md:row-span-1",
      coverImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full pt-[60px]">
        <Suspense fallback={<div className="pt-40 px-10">Loading gallery...</div>}>
          <WorkGallery works={mockWorks} />
        </Suspense>
        <Contact />
      </main>
    </div>
  );
}
