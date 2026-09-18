"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import IntroVideoOverlay from "@/components/sections/IntroVideoOverlay";
import AIChatCard from "@/components/features/AIChatCard";

/**
 * Owns the intro-video lifecycle and the few pieces of chrome that depend on it
 * (navbar reveal, hero fade-in, chat launcher). Everything below the hero is
 * passed through as `children` so it can stay server-rendered — this component
 * exists purely so the rest of the page doesn't have to be a Client Component.
 */
export default function IntroExperience({
  children,
}: {
  children: React.ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);

  // 🔒 STRICT SCROLL LOCK: Prevent all scrolling while intro video is playing
  // and guarantee users always end up at the top in the Hero section.
  useEffect(() => {
    if (isVideoHidden) {
      // Restore Lenis and ensure user lands at top of Hero section
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const lenis = (window as unknown as { __lenis?: { start: () => void; scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        lenis.start();
      }
      return;
    }

    // 1. Force scroll position to top
    window.scrollTo(0, 0);

    // 2. Disable browser automatic scroll restoration during video
    const prevScrollRestoration = "scrollRestoration" in window.history ? window.history.scrollRestoration : undefined;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 3. Lock document and body overflow
    const previousBodyOverflow = document.body.style.overflow;
    const previousDocOverflow = document.documentElement.style.overflow;
    const previousBodyOverscroll = document.body.style.overscrollBehavior;
    const previousDocOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overscrollBehavior = "none";

    // 4. Lock Lenis smooth scroll instance
    const lockLenis = () => {
      const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void; scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        lenis.stop();
      }
    };
    lockLenis();
    const lenisCheckId = setInterval(lockLenis, 120);

    // 5. Block all user scroll inputs (wheel, touch gestures, keyboard scroll keys)
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ([" ", "PageUp", "PageDown", "End", "Home", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      clearInterval(lenisCheckId);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", handleKeyDown);

      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscroll;
      document.documentElement.style.overscrollBehavior = previousDocOverscroll;

      if ("scrollRestoration" in window.history && prevScrollRestoration) {
        window.history.scrollRestoration = prevScrollRestoration;
      }

      // Re-enable Lenis and guarantee landing at top Hero section
      const lenis = (window as unknown as { __lenis?: { start: () => void; scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
        lenis.start();
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };
  }, [isVideoHidden]);

  useEffect(() => {
    if (isVideoHidden) return;
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isVideoHidden]);

  const triggerFade = useCallback(() => {
    if (!isVideoFading) {
      setIsVideoFading(true);
      // Ensure viewport stays locked at top Hero section as fade commences
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }

      setTimeout(() => {
        setIsVideoHidden(true);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        if (lenis) {
          lenis.scrollTo(0, { immediate: true });
        }
      }, 1800);
    }
  }, [isVideoFading]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && !isVideoFading) {
      const remainingTime = videoRef.current.duration - videoRef.current.currentTime;
      if (remainingTime <= 1.5 && remainingTime > 0) {
        triggerFade();
      }
    }
  }, [isVideoFading, triggerFade]);

  const handleTapToUnmute = useCallback(() => {
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
    }
  }, []);

  return (
    <>
      {/* Floating Pill Header Navigation */}
      <Navbar isVideoFading={isVideoFading} />

      {/* SECTION 1: HERO (Untouched, with original background) */}
      <HeroSection isVideoFading={isVideoFading} />

      {/* SECTIONS 2-10 + FOOTER (server-rendered) */}
      {children}

      {/* INTRO VIDEO OVERLAY */}
      <IntroVideoOverlay
        isVideoHidden={isVideoHidden}
        isVideoFading={isVideoFading}
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerFade}
        onUnmute={handleTapToUnmute}
        videoRef={videoRef}
      />

      {/* AI CHATBOT ASSISTANT */}
      <AIChatCard isVisible={isVideoHidden || isVideoFading} />
    </>
  );
}
