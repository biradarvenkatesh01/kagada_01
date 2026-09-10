"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Initialize Lenis smooth momentum scrolling for ultra-fluid, butter-smooth navigation
    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.08,
      duration: prefersReducedMotion ? 0 : 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.0,
      syncTouch: false,
      autoResize: true,
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    let rafId: number | null = null;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    if (!document.hidden) {
      rafId = requestAnimationFrame(raf);
    }

    // Lifecycle: Pause RAF loop when tab is hidden to save battery & CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        if (rafId === null) {
          rafId = requestAnimationFrame(raf);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Handle smooth anchor clicks site-wide
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.hash && anchor.hash.startsWith("#")) {
        const elem = document.querySelector(anchor.hash);
        if (elem) {
          e.preventDefault();
          lenis.scrollTo(elem as HTMLElement, { offset: -80, duration: 1.2 });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleAnchorClick);
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis.destroy();
      if (typeof window !== "undefined") {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
    };
  }, []);

  return <>{children}</>;
}
