"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import AIChatCard from "@/components/features/AIChatCard";
import OrigamiIntro from "@/components/features/OrigamiIntro";

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

  const showIntro = sessionStatus === "unseen" && !dismissed;

  // Prevent background page scrolling while the origami intro is assembling
  useEffect(() => {
    if (!showIntro) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
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
      <AIChatCard isVisible={!showIntro} />
    </>
  );
}
