"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

const SESSION_KEY = "hasLoadedBefore";

export interface PreloaderContextValue {
  isLoading: boolean;
  isDocked: boolean;
  hasLoadedBefore: boolean;
  completePreloader: () => void;
}

const PreloaderContext = createContext<PreloaderContextValue>({
  isLoading: false,
  isDocked: true,
  hasLoadedBefore: true,
  completePreloader: () => {},
});

export function PreloaderProvider({ children }: { children: ReactNode }) {
  // Initialize loading as true by default per specification so SSR renders preloader overlay
  const [hasLoadedBefore, setHasLoadedBefore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDocked, setIsDocked] = useState<boolean>(false);

  useEffect(() => {
    try {
      const search = window.location.search;
      const isForced = search.includes("preload=true");
      if (isForced) {
        sessionStorage.removeItem(SESSION_KEY);
        setHasLoadedBefore(false);
        setIsLoading(true);
        setIsDocked(false);
        document.documentElement.classList.add("preloader-active");
        document.documentElement.classList.remove("preloader-done");
      } else if (sessionStorage.getItem(SESSION_KEY) === "true") {
        setHasLoadedBefore(true);
        setIsLoading(false);
        setIsDocked(true);
        document.documentElement.classList.remove("preloader-active");
        document.documentElement.classList.add("preloader-done");
      }
    } catch {
      // ignore
    }

    // Expose convenient test helper in dev
    if (typeof window !== "undefined") {
      (window as unknown as { __replayPreloader?: () => void }).__replayPreloader = () => {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.reload();
      };
    }
  }, []);

  const completePreloader = useCallback(() => {
    setIsDocked(true);
    setIsLoading(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
      document.documentElement.classList.remove("preloader-active");
      document.documentElement.classList.add("preloader-done");
    } catch {
      // ignore
    }
  }, []);

  return (
    <PreloaderContext.Provider
      value={{
        isLoading,
        isDocked,
        hasLoadedBefore,
        completePreloader,
      }}
    >
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  return useContext(PreloaderContext);
}
