"use client";

import { useEffect } from "react";

/**
 * Ensures all marquees and rotating animations on the page run uninterrupted
 * while visible in the viewport, and stop completely when scrolled out of view
 * to consume 0% CPU/GPU.
 */
export default function OffscreenAnimationPause() {
  useEffect(() => {
    // 1. Gather all stationary track containers and animated elements
    const rawElements = document.querySelectorAll<HTMLElement>(
      "[data-marquee-track], .animate-marquee, .animate-marquee-reverse, .animate-gear-spin"
    );

    const containers: HTMLElement[] = [];

    rawElements.forEach((el) => {
      // Observe the stationary container (rather than the horizontally transforming inner div)
      // to eliminate any bounding-box jitter or false intersection triggers during translation
      const container = el.hasAttribute("data-marquee-track")
        ? el
        : el.closest<HTMLElement>("[data-marquee-track]") || el.parentElement || el;

      if (container && !containers.includes(container)) {
        containers.push(container);
      }
    });

    if (containers.length === 0) return;

    // 2. Geometry check with a generous 80px vertical buffer
    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const buffer = 80;
      return rect.bottom >= -buffer && rect.top <= vh + buffer;
    };

    const updatePlayState = (el: HTMLElement, inView: boolean) => {
      if (inView) {
        el.classList.remove("anim-paused");
        // Also clear any descendant with anim-paused
        el.querySelectorAll(".anim-paused").forEach((inner) =>
          inner.classList.remove("anim-paused")
        );
      } else {
        el.classList.add("anim-paused");
      }
    };

    // 3. IntersectionObserver: 80px buffer above & below ensures smooth continuous playback
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          updatePlayState(entry.target as HTMLElement, entry.isIntersecting);
        }
      },
      {
        rootMargin: "80px 0px 80px 0px",
        threshold: 0,
      }
    );

    containers.forEach((c) => {
      io.observe(c);
      // Immediately evaluate and set proper initial state on mount
      updatePlayState(c, isElementInViewport(c));
    });

    // 4. Tab visibility changes: pause when tab is backgrounded, instantly resume when tab is active
    const onVisibilityChange = () => {
      if (document.hidden) {
        containers.forEach((c) => c.classList.add("anim-paused"));
      } else {
        containers.forEach((c) => updatePlayState(c, isElementInViewport(c)));
      }
    };

    // 5. Window resize / orientation change safety listener
    const onResize = () => {
      containers.forEach((c) => updatePlayState(c, isElementInViewport(c)));
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      containers.forEach((c) => c.classList.remove("anim-paused"));
    };
  }, []);

  return null;
}
