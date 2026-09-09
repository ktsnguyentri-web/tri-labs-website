"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LogoProps {
  className?: string;
  pathname?: string;
  onHomeClick?: () => void;
}

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

function getBreadcrumbs(path?: string): BreadcrumbSegment[] {
  if (!path || path === "/") return [];

  const parts = path.split("/").filter(Boolean);
  if (parts.length === 0) return [];

  const first = parts[0]?.toLowerCase();
  let categoryLabel = first;
  let categoryHref = `/${first}`;

  if (first === "work" || first === "works") {
    categoryLabel = "works";
    categoryHref = "/works";
  } else if (first === "tool" || first === "tools" || first === "labs" || first === "lab") {
    categoryLabel = "labs";
    categoryHref = "/labs";
  } else if (first === "research" || first === "writing" || first === "writings") {
    categoryLabel = "writing";
    categoryHref = "/writing";
  }

  // Top-level subpage (e.g. /works, /labs, /writing, /about)
  if (parts.length === 1) {
    return [{ label: categoryLabel }];
  }

  // Deep detail page (e.g. /work/chavana-boutique-hotel)
  const detailSlug = parts.slice(1).join("/");
  return [
    { label: categoryLabel, href: categoryHref },
    { label: detailSlug },
  ];
}

export function Logo({ className, pathname: propPathname, onHomeClick }: LogoProps) {
  const hookPathname = usePathname();
  const currentPath = propPathname !== undefined ? propPathname : hookPathname;
  const breadcrumbs = getBreadcrumbs(currentPath);

  return (
    <div 
      className={`flex items-center select-none font-sans text-sm tracking-tight ${className || ""}`}
    >
      <Link
        href="/"
        onClick={onHomeClick}
        className="font-semibold text-neutral-900 dark:text-white hover:opacity-70 transition-opacity whitespace-nowrap"
      >
        tri-labs
      </Link>

      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return (
          <React.Fragment key={idx}>
            <span className="text-neutral-400 dark:text-neutral-600 mx-1.5 font-normal flex-shrink-0">
              /
            </span>
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="font-normal text-neutral-900 dark:text-neutral-100 hover:opacity-70 transition-opacity whitespace-nowrap"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-neutral-500 dark:text-neutral-400 font-normal truncate max-w-[130px] sm:max-w-[200px] md:max-w-[280px]">
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
