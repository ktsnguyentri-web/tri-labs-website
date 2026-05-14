"use client";

import Link from "next/link";
import Image from "next/image";
import type { WorkItem } from "@/types/cms";
import { Reveal } from "@/components/animations/Reveal";
import * as React from "react";

export function WorkGallery({ works }: { works: WorkItem[] }) {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const roles = React.useMemo(() => {
    const allRoles = works.map(w => w.role).filter(Boolean) as string[];
    return Array.from(new Set(allRoles));
  }, [works]);

  const categories = ["Architecture", "Interior", "Design"] as const;
  
  const groupedWorks = categories.map(cat => ({
    name: cat,
    projects: works.filter(w => w.category === cat && (!selectedRole || w.role === selectedRole))
  })).filter(g => g.projects.length > 0);

  return (
    <div className="w-full pb-32">
      {/* Role Filter Bar */}
      {roles.length > 0 && (
        <div className="px-6 md:px-10 mt-6 mb-4">
          <Reveal width="100%">
            <div className="flex flex-col gap-3.5 border-b border-white/10 pb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40">
                Filter by Role
              </span>
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setSelectedRole(null)}
                  className={`px-4 py-2 rounded-full text-[11px] font-sans tracking-wider transition-all duration-300 border uppercase flex items-center gap-1.5 ${
                    !selectedRole 
                      ? "bg-white text-black border-white font-medium shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                      : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>All Roles</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${!selectedRole ? 'bg-black/10 text-black' : 'bg-white/10 text-white/40'}`}>
                    {works.length}
                  </span>
                </button>
                {roles.map(role => {
                  const count = works.filter(w => w.role === role).length;
                  const isSelected = selectedRole === role;
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(isSelected ? null : role)}
                      className={`px-4 py-2 rounded-full text-[11px] font-sans tracking-wider transition-all duration-300 border uppercase flex items-center gap-1.5 ${
                        isSelected 
                          ? "bg-white text-black border-white font-medium shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                          : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{role}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-white/40'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {groupedWorks.map((group, groupIdx) => (
        <section key={group.name} className="mt-12 first:mt-6 px-6 md:px-10">
          {/* Section Header */}
          <Reveal width="100%">
            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4 uppercase font-sans text-[11px] tracking-[0.3em] text-white/30">
              <div className="flex items-center gap-6">
                <h2 className="text-[22px] md:text-[26px] font-light tracking-tight text-white normal-case">
                  {group.name}
                </h2>
                {selectedRole && (
                  <span className="px-3 py-1 bg-white/10 text-white/80 text-[9px] tracking-[0.2em] uppercase rounded-full border border-white/10">
                    Active: {selectedRole}
                  </span>
                )}
              </div>
              <div className="hidden md:block">
                <span className="text-white/60">{group.projects.length}</span> projects
              </div>
            </div>
          </Reveal>

          {/* Grid with Thin Gap */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
            {group.projects.map((work, i) => {
              const href = `/work/${work.slug}`;
              
              return (
                <Reveal 
                  key={work.id} 
                  delay={0.05 * (i % 8)} 
                  className="aspect-[4/3] md:aspect-square relative overflow-hidden group bg-white/5"
                >
                  <Link
                    href={href}
                    className="cursor-pointer relative w-full h-full block"
                  >
                    <Image
                      src={work.coverImage}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 16vw"
                    />
                    
                    {/* Editorial Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8 backdrop-blur-[2px]">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        {work.role && (
                          <div className="mb-2">
                            <span className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20">
                              {work.role}
                            </span>
                          </div>
                        )}
                        <h4 className="text-white text-[13px] font-bold uppercase tracking-[0.25em] mb-2 leading-tight">
                          {work.title}
                        </h4>
                        <p className="text-white/60 text-[9px] font-mono uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1 h-[1px] bg-white/40" />
                          {work.location || group.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

