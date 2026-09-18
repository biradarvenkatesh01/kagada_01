"use client";

import { useEffect } from "react";

/**
 * Pauses every marquee animation on the page while it is off-screen.
 *
 * A CSS animation keeps running at full rate even when its element is nowhere
 * near the viewport — the browser does not stop it for you. The gallery and
 * sponsor marquees animate ~4000px-wide composited layers, and were measured
 * still reporting `playState: "running"` while scrolled entirely out of view.
 *
 * On a low-end device this was one of the two dominant costs: stopping the
 * marquees took dropped frames from 90.1% to 55.9% at 6x CPU throttle
 * (390x844 @DPR3). Pausing something the user cannot see is invisible to them,
 * and a paused CSS animation resumes from exactly where it left off.
 *
 * This is a single mounted client component rather than a hook so that
 * GallerySection and SponsorsSection can stay Server Components — using a hook
 * inside them would have forced the whole subtree (and all those <img> tags)
 * to hydrate on the client for no benefit.
 */
export default function OffscreenAnimationPause() {
  useEffect(() => {
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>(".animate-marquee, .animate-marquee-reverse, .animate-gear-spin")
    );
    if (rows.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          (entry.target as HTMLElement).classList.toggle("anim-paused", !entry.isIntersecting);
        }
      },
      // Generous margin so a row is already moving before any part of it is
      // visible — no "starts on arrival" pop.
      { rootMargin: "300px 0px 300px 0px", threshold: 0 }
    );

    rows.forEach((row) => io.observe(row));

    // Also stop them when the tab is backgrounded.
    const onVisibility = () => {
      if (document.hidden) rows.forEach((r) => r.classList.add("anim-paused"));
      else rows.forEach((r) => io.observe(r)); // re-evaluate against the viewport
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      rows.forEach((r) => r.classList.remove("anim-paused"));
    };
  }, []);

  return null;
}
