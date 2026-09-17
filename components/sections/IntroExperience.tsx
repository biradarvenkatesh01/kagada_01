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

  useEffect(() => {
    // Lock document scroll while intro video is playing.
    if (isVideoHidden) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVideoHidden]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  const triggerFade = useCallback(() => {
    if (!isVideoFading) {
      setIsVideoFading(true);
      setTimeout(() => {
        setIsVideoHidden(true);
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
