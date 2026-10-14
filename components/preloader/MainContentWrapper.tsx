"use client";

import React, { ReactNode } from "react";
import { usePreloader } from "@/lib/preloader-context";

interface MainContentWrapperProps {
  children: ReactNode;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { isLoading } = usePreloader();

  return (
    <div
      id="main-content"
      className={`flex-grow flex flex-col transition-opacity duration-500 ease-out ${
        isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}
