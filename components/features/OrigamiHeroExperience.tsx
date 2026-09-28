"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import AIChatCard from "@/components/features/AIChatCard";
import OrigamiIntro from "@/components/features/OrigamiIntro";
import KagathonPopup from "@/components/features/KagathonPopup";

const SESSION_KEY = "kagada_origami_intro_seen";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  try {
    return sessionStorage.getItem(SESSION_KEY) ? "seen" : "unseen";
  } catch {
    return "seen";
  }
}

function getServerSnapshot() {
  return "seen";
}

export default function OrigamiHeroExperience() {
  const sessionStatus = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [isBackgroundPaused, setIsBackgroundPaused] = useState(false);
  const [isKagathonOpen, setIsKagathonOpen] = useState(false);

  const showIntro = sessionStatus === "unseen" && !dismissed;

  const handleHeroReady = useCallback(() => {
    setIsHeroReady(true);
  }, []);

  // Trigger Kagathon announcement popup ONLY after the hero section is properly rendered and settled
  useEffect(() => {
    if (showIntro || !isHeroReady) return;

    // 1. Immediately pause background activity so CPU/GPU are completely freed before popup loads
    const pauseTimer = setTimeout(() => {
      setIsBackgroundPaused(true);
    }, 700);

    // 2. Preload only the 720w poster in idle state now that hero is completely rendered
    if (typeof window !== "undefined") {
      const img = new Image();
      img.src = "/optimized/kagathon/kagathon-poster-720.webp";
    }

    // 3. Gracefully open the popup once the background is fully stopped
    const openTimer = setTimeout(() => {
      setIsKagathonOpen(true);
    }, 950);

    return () => {
      clearTimeout(pauseTimer);
      clearTimeout(openTimer);
    };
  }, [showIntro, isHeroReady]);

  const handleClose = useCallback(() => {
    setIsKagathonOpen(false);
    // Resume background activity smoothly after popup exit animation finishes
    const timer = setTimeout(() => {
      setIsBackgroundPaused(false);
    }, 320);
    return () => clearTimeout(timer);
  }, []);

  // Listen for custom event to open Kagathon popup
  useEffect(() => {
    const handleOpen = () => {
      setIsBackgroundPaused(true);
      setIsKagathonOpen(true);
    };
    window.addEventListener("kagada:open-kagathon", handleOpen);
    return () => window.removeEventListener("kagada:open-kagathon", handleOpen);
  }, []);

  // Prevent background page scrolling while the origami intro is assembling
  useEffect(() => {
    if (!showIntro) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Stop Lenis smooth scroll engine
    const checkLenis = () => {
      const lenis = (
        window as unknown as {
          __lenis?: { stop: () => void; start: () => void };
        }
      ).__lenis;
      if (lenis) {
        lenis.stop();
        return true;
      }
      return false;
    };

    if (!checkLenis()) {
      const timer = setInterval(() => {
        if (checkLenis()) clearInterval(timer);
      }, 50);
      setTimeout(() => clearInterval(timer), 3000);
    }

    // Freeze native wheel and touch events on window so no scroll is physically possible
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    const preventKeyScroll = (e: KeyboardEvent) => {
      if (
        ["Space", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End"].includes(
          e.code
        ) ||
        [" ", "PageUp", "PageDown", "ArrowUp", "ArrowDown", "Home", "End"].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeyScroll);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      const lenis = (
        window as unknown as {
          __lenis?: { stop: () => void; start: () => void };
        }
      ).__lenis;
      if (lenis) {
        lenis.start();
      }
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeyScroll);
    };
  }, [showIntro]);

  const handleComplete = useCallback(() => {
    setDismissed(true);
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // ignore storage errors
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <OrigamiIntro onComplete={handleComplete} />
        )}
      </AnimatePresence>

      {/* Background layer container with disabled pointer events while popup is loading or active */}
      <div
        className={isKagathonOpen || isBackgroundPaused ? "pointer-events-none select-none" : undefined}
        aria-hidden={isKagathonOpen}
      >
        {/* Floating Header Navigation */}
        <Navbar isIntroActive={showIntro} />

        {/* Section 1: Hero */}
        <HeroSection
          isIntroActive={showIntro}
          isPaused={isBackgroundPaused || isKagathonOpen}
          onReady={handleHeroReady}
        />
      </div>

      {/* AI Assistant Chatbot */}
      <AIChatCard isVisible={!showIntro && !isKagathonOpen} />

      {/* Kagathon Announcement Popup */}
      <KagathonPopup isOpen={isKagathonOpen} onClose={handleClose} />
    </>
  );
}
