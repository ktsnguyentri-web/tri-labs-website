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
  // Synchronous lazy initialization on client avoids flash of content
  const [hasLoadedBefore, setHasLoadedBefore] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const search = window.location.search;
      if (search.includes("preload=true")) {
        sessionStorage.removeItem(SESSION_KEY);
        return false;
      }
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      return true;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const search = window.location.search;
      if (search.includes("preload=true")) {
        return true;
      }
      return sessionStorage.getItem(SESSION_KEY) !== "true";
    } catch {
      return false;
    }
  });

  const [isDocked, setIsDocked] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const search = window.location.search;
      if (search.includes("preload=true")) {
        return false;
      }
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
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
