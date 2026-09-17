"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// ─── High-Performance Centralized IntersectionObserver (Singleton) ─────────
// A single observer handles all scroll-reveals across the entire application,
// eliminating 30+ separate observers, React state polling, and layout calculations.
type RevealCallback = () => void;
const observerCallbacks = new WeakMap<Element, RevealCallback>();

let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = observerCallbacks.get(entry.target);
            if (cb) {
              cb();
              observerCallbacks.delete(entry.target);
              sharedObserver?.unobserve(entry.target);
            }
          }
        });
      },
      {
        // Pre-trigger well BELOW the viewport so content is already revealed by
        // the time it scrolls up into view. rootMargin is top/right/bottom/left,
        // so the large value has to be on `bottom` to grow the observation box
        // downwards, in the direction content arrives from.
        rootMargin: "200px 0px 400px 0px",
        // threshold 0 fires as soon as any part crosses the (expanded) box.
        // A non-zero threshold delays tall elements and made sections appear
        // late during fast scrolling.
        threshold: 0,
      }
    );
  }
  return sharedObserver;
}

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds (e.g. 50, 100)
  duration?: number; // Duration in seconds (e.g. 0.45) or milliseconds (e.g. 450)
  direction?: "up" | "down" | "left" | "right" | "scale";
  x?: number; // Distance to translate on X axis
  y?: number; // Distance to translate on Y axis
  scale?: number; // Initial scale
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.45,
  direction,
  x,
  y,
  scale,
  as: Component = "div",
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference instantly
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.revealed = "true";
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      el.dataset.revealed = "true";
      return;
    }

    observerCallbacks.set(el, () => {
      el.dataset.revealed = "true";
    });
    observer.observe(el);

    return () => {
      observerCallbacks.delete(el);
      observer.unobserve(el);
    };
  }, []);

  // Compute translation and scale based on direction and explicit offsets
  let initX = x ?? 0;
  let initY = y ?? 0;
  let initScale = scale ?? 1;

  if (direction === "up") {
    initY = y ?? 20;
  } else if (direction === "down") {
    initY = y !== undefined ? -Math.abs(y) : -20;
  } else if (direction === "left") {
    initX = x ?? 20;
  } else if (direction === "right") {
    initX = x !== undefined ? -Math.abs(x) : -20;
  } else if (direction === "scale") {
    initScale = scale ?? 0.96;
  } else if (y === undefined && x === undefined && scale === undefined) {
    // Default to subtle 18px upward reveal
    initY = 18;
  }

  // Normalize duration to seconds (e.g. 500ms -> 0.5s, 0.45s -> 0.45s)
  const normDuration = duration > 10 ? duration / 1000 : duration;

  const cssVars = {
    "--reveal-x": `${initX}px`,
    "--reveal-y": `${initY}px`,
    "--reveal-scale": `${initScale}`,
    "--reveal-duration": `${normDuration}s`,
    "--reveal-delay": `${delay}ms`,
    ...style,
  } as React.CSSProperties;

  return (
    <Component
      ref={ref}
      className={cn("scroll-reveal transform-gpu", className)}
      style={cssVars}
      {...props}
    >
      {children}
    </Component>
  );
}

export default ScrollReveal;
