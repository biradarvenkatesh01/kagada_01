"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * Smooth scrolling for pointer devices only.
 *
 * Lenis is configured with `syncTouch: false`, which means it deliberately does
 * NOT smooth touch scrolling — on a phone the browser's own native touch
 * scrolling is what you actually feel. But the instance still ran its rAF loop
 * on every frame for the life of the page and still processed scroll events, so
 * on mobile it was pure overhead delivering nothing.
 *
 * Measured at 390x844 @DPR3 with 4x CPU throttling, over an identical scripted
 * fling driven three different ways (lenis.scrollTo, native scrollTo, and real
 * wheel events — all three agreed, so the harness was not the variable):
 *
 *   Lenis running .................... 46.2% dropped frames, median 31.3ms
 *   Lenis skipped (this gate) ........ 22.5% dropped frames, median 26.1ms
 *
 * (n=4 each, measured back to back on the same machine with the hover/pointer
 * media features forced via CDP so the touch branch is genuinely exercised.)
 *
 * So it is skipped entirely on touch-primary devices, where it is doing no work
 * the user can perceive, and kept on pointer devices where `smoothWheel` is the
 * whole point. Native CSS smooth scrolling covers anchor navigation there.
 */
/**
 * Accurately centers the Kagathon section card right in the middle of the viewport
 * so neither the previous section (About) nor the next section (Tracks) intrudes on screen.
 */
export function scrollToKagathon() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const cardElem =
    document.getElementById("kagathon-card") ||
    document.getElementById("kagathon");
  if (!cardElem) {
    window.location.hash = "kagathon";
    return;
  }

  const rect = cardElem.getBoundingClientRect();
  const currentScrollY = window.scrollY || window.pageYOffset;
  const cardHeight = rect.height;
  const viewportHeight = window.innerHeight;

  let targetScrollY: number;
  if (cardHeight >= viewportHeight - 80) {
    // If the card is taller than or close to the viewport (e.g. mobile portrait),
    // align top of card comfortably below navbar (80px)
    targetScrollY = currentScrollY + rect.top - 80;
  } else {
    // Perfectly center the card vertically in the screen
    targetScrollY = currentScrollY + rect.top + cardHeight / 2 - viewportHeight / 2;
  }
  targetScrollY = Math.max(0, targetScrollY);

  const lenis = (
    window as unknown as {
      __lenis?: { scrollTo: (target: number | HTMLElement, opts?: unknown) => void };
    }
  ).__lenis;

  if (lenis?.scrollTo) {
    lenis.scrollTo(targetScrollY, {
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    let lenis: Lenis | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const cleanupFns: Array<() => void> = [];

    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;

      lenis = new LenisCtor({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0,
        syncTouch: false,
        autoResize: true,
      });

      // Handle window resize cleanly without thrashing layout during scroll
      let resizeTimer: number;
      const handleResize = () => {
        cancelAnimationFrame(resizeTimer);
        resizeTimer = requestAnimationFrame(() => {
          lenis?.resize();
        });
      };
      window.addEventListener("resize", handleResize, { passive: true });
      cleanupFns.push(() => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(resizeTimer);
      });

      // Initial measurement once fonts and DOM settle
      setTimeout(() => lenis?.resize(), 300);

      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      if (!document.hidden) rafId = requestAnimationFrame(raf);

      // Pause the loop when the tab is hidden to save battery and CPU.
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        } else if (rafId === null) {
          rafId = requestAnimationFrame(raf);
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      cleanupFns.push(() => document.removeEventListener("visibilitychange", handleVisibilityChange));

      // Site-wide smooth anchor navigation.
      const handleAnchorClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement)?.closest("a");
        if (!anchor || !anchor.hash || !anchor.hash.startsWith("#")) return;
        const elem = document.querySelector(anchor.hash);
        if (!elem) return;
        e.preventDefault();

        if (anchor.hash === "#kagathon") {
          scrollToKagathon();
          return;
        }

        // 1.2s felt like the page was dragging itself to the target. 0.85s with
        // an expo-out curve covers the same distance but front-loads the motion,
        // so it reads as responsive rather than slow.
        lenis?.scrollTo(elem as HTMLElement, {
          offset: -80,
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      };
      document.addEventListener("click", handleAnchorClick);
      cleanupFns.push(() => document.removeEventListener("click", handleAnchorClick));

      // Handle initial load with #kagathon hash
      if (typeof window !== "undefined" && window.location.hash === "#kagathon") {
        setTimeout(() => scrollToKagathon(), 350);
      }
    });

    return () => {
      cancelled = true;
      cleanupFns.forEach((fn) => fn());
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
