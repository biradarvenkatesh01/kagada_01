"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import AIChatCard from "@/components/features/AIChatCard";
import OrigamiIntro from "@/components/features/OrigamiIntro";
import KagathonPopup from "@/components/features/KagathonPopup";

const SESSION_KEY = "kagada_origami_intro_seen";
const KAGATHON_POPUP_KEY = "kagada_kagathon_popup_seen";

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
  const [isKagathonOpen, setIsKagathonOpen] = useState(false);

  const showIntro = sessionStatus === "unseen" && !dismissed;

  // Trigger Kagathon announcement popup after origami intro completes
  useEffect(() => {
    if (showIntro) return;
    try {
      const seen = sessionStorage.getItem(KAGATHON_POPUP_KEY);
      if (!seen) {
        const timer = setTimeout(() => {
          setIsKagathonOpen(true);
          try {
            sessionStorage.setItem(KAGATHON_POPUP_KEY, "true");
          } catch {
            // ignore storage errors
          }
        }, 900);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore storage errors
    }
  }, [showIntro]);

  const handleClose = useCallback(() => {
    setIsKagathonOpen(false);
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

      {/* Floating Header Navigation */}
      <Navbar isIntroActive={showIntro} />

      {/* Section 1: Hero */}
      <HeroSection isIntroActive={showIntro} />

      {/* AI Assistant Chatbot */}
      <AIChatCard isVisible={!showIntro && !isKagathonOpen} />

      {/* Kagathon Announcement Popup */}
      <KagathonPopup isOpen={isKagathonOpen} onClose={handleClose} />
    </>
  );
}
