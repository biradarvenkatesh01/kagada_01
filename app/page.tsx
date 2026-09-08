"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TracksSection from "@/components/sections/TracksSection";
import PrizePoolSection from "@/components/sections/PrizePoolSection";
import WinnersSection from "@/components/sections/WinnersSection";
import GallerySection from "@/components/sections/GallerySection";
import VideosSection from "@/components/sections/VideosSection";
import SponsorsSection from "@/components/sections/SponsorsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import IntroVideoOverlay from "@/components/sections/IntroVideoOverlay";
import AuroraBackground from "@/components/ui/aurora-background";
import AIChatCard from "@/components/features/AIChatCard";
import BackToTop from "@/components/ui/back-to-top";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);

  useEffect(() => {
    // Lock document scroll while intro video is playing
    if (!isVideoHidden) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVideoHidden]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
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
    <main
      className={`relative w-full bg-transparent overflow-x-hidden ${
        !isVideoHidden ? "h-screen min-h-[100dvh] overflow-hidden" : "min-h-screen"
      }`}
    >
      {/* Dynamic Background Atmosphere */}
      <AuroraBackground />

      {/* Floating Pill Header Navigation */}
      <Navbar isVideoFading={isVideoFading} />

      {/* SECTION 1: HERO */}
      <HeroSection isVideoFading={isVideoFading} />

      {/* SECTION 2: ABOUT US */}
      <AboutSection />

      {/* SECTION 3: TRACKS */}
      <TracksSection />

      {/* SECTION 4: PRIZE POOL */}
      <PrizePoolSection />

      {/* SECTION 5: PREVIOUS WINNERS */}
      <WinnersSection />

      {/* SECTION 6: GALLERY MARQUEE */}
      <GallerySection />

      {/* SECTION 7: AFTERMOVIES */}
      <VideosSection />

      {/* SECTION 8: SPONSORS */}
      <SponsorsSection />

      {/* SECTION 9: FAQ ACCORDION */}
      <FAQSection />

      {/* SECTION 10: CONTACT ORGANIZERS & MAP */}
      <ContactSection />

      {/* FOOTER */}
      <Footer />

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
      <AIChatCard isVisible={isVideoHidden} />

      {/* FLOATING BACK TO TOP BUTTON */}
      <BackToTop />
    </main>
  );
}
