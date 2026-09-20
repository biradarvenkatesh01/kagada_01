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
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // A touch-primary device: no hover capability and a coarse pointer. This
    // deliberately excludes touch-screen laptops, which have a fine pointer and
    // therefore do benefit from smoothWheel.
    const isTouchPrimary = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (isTouchPrimary || prefersReducedMotion) {
      // Touch-primary mobile devices: Preserve 120Hz OS-native momentum touch panning.
      // Do NOT set root.style.scrollBehavior = 'smooth' globally on touch screens,
      // as it causes finger flick momentum to jitter/fight browser physics.
      const handleTouchAnchor = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement)?.closest("a");
        if (!anchor || !anchor.hash || !anchor.hash.startsWith("#")) return;
        const elem = document.querySelector(anchor.hash);
        if (!elem) return;
        e.preventDefault();
        elem.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      };
      document.addEventListener("click", handleTouchAnchor);
      return () => document.removeEventListener("click", handleTouchAnchor);
    }

    let lenis: Lenis | null = null;
    let rafId: number | null = null;
    let cancelled = false;

    const cleanupFns: Array<() => void> = [];

    // Loaded on demand so the library is not in the critical path for the phones
    // that will never instantiate it.
    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;

      lenis = new LenisCtor({
        // Left at 0.14 deliberately. Raising it to 0.18 to make the viewport
        // chase the wheel more closely measurably made things WORSE, not
        // better: at 6x CPU throttle the navbar dropdown went from 27.8ms p95
        // / 1.5% dropped to 34.7ms / 9.8%, and the FAQ answer from 20.8ms /
        // 1.5% to 27.6ms / 4.9%. A tighter lerp keeps Lenis actively
        // integrating for more frames, and that work lands on the same main
        // thread the panel animations need.
        lerp: 0.14,
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.0,
        syncTouch: false,
        autoResize: false,
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
        // 1.2s felt like the page was dragging itself to the target. 0.85s with
        // an expo-out curve covers the same distance but front-loads the motion,
        // so it reads as responsive rather than slow.
        lenis?.scrollTo(elem as HTMLElement, {
          offset: -80,
          duration: 0.85,
          easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
        });
      };
      document.addEventListener("click", handleAnchorClick);
      cleanupFns.push(() => document.removeEventListener("click", handleAnchorClick));
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
