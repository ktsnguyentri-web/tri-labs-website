import { Navbar } from "@/components/Navbar";
import { Contact } from "@/components/Contact";
import { WorkGallery, WorkItem } from "@/components/WorkGallery";

export default function WorkPage() {
  // Mock Data containing title, category, image, year, and bento box spans
  const mockWorks: WorkItem[] = [
    { id: 1, title: "Shenzhen Bay Culture Park", category: "Architecture", year: "2023", span: "md:col-span-2 md:row-span-2", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" },
    { id: 2, title: "Minimalist Loft", category: "Interior", year: "2023", span: "md:col-span-1 md:row-span-1", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" },
    { id: 3, title: "Harbin Opera House", category: "Architecture", year: "2022", span: "md:col-span-1 md:row-span-2", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" },
    { id: 4, title: "Urban Concrete Apartment", category: "Interior", year: "2022", span: "md:col-span-1 md:row-span-1", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80" },
    { id: 5, title: "Absolute Towers", category: "Architecture", year: "2021", span: "md:col-span-2 md:row-span-1", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" },
    { id: 6, title: "Ordos Museum", category: "Architecture", year: "2021", span: "md:col-span-1 md:row-span-2", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80" },
    { id: 7, title: "Huzhou Sheraton", category: "Architecture", year: "2020", span: "md:col-span-1 md:row-span-1", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" },
    { id: 8, title: "Nordic Office Space", category: "Interior", year: "2020", span: "md:col-span-2 md:row-span-1", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" },
    { id: 9, title: "Parametric Furniture", category: "Design", year: "2020", span: "md:col-span-1 md:row-span-1", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-black">
      <Navbar />
      <main className="w-full">
        <WorkGallery works={mockWorks} />
        <Contact />
      </main>
    </div>
  );
}
