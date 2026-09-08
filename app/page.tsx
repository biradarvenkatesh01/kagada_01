"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import TracksSection from "@/components/sections/TracksSection";
import PrizePoolSection from "@/components/sections/PrizePoolSection";
import WinnersSection from "@/components/sections/WinnersSection";
import GallerySection from "@/components/sections/GallerySection";
import AftermoviesSection from "@/components/ui/aftermovies-section";
import SponsorsSection from "@/components/ui/sponsors-section";
import FAQSection from "@/components/ui/faq-section";
import ContactSection from "@/components/ui/contact-section";
import Footer from "@/components/ui/footer";
import AIChatCard from "@/components/ui/ai-chat";
import AuroraBackground from "@/components/ui/aurora-background";
import IntroVideoOverlay from "@/components/sections/IntroVideoOverlay";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);

  useEffect(() => {
    // Lock document scroll while video intro is active
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
      {/* Background Layer */}
      <AuroraBackground />

      {/* Floating Navbar */}
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

      {/* SECTION 6: GALLERY */}
      <GallerySection />

      {/* SECTION 7: AFTERMOVIES */}
      <section
        id="videos"
        className="relative w-full mt-2 sm:mt-4 pt-2 sm:pt-4 pb-12 sm:pb-16 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <AftermoviesSection />
      </section>

      {/* SECTION 8: SPONSORS */}
      <section
        id="sponsors"
        className="relative w-full mt-4 sm:mt-8 pt-4 sm:pt-8 pb-12 sm:pb-16 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <SponsorsSection />
      </section>

      {/* SECTION 9: FAQ */}
      <section
        id="faq"
        className="relative w-full mt-4 sm:mt-8 pt-4 sm:pt-8 pb-12 sm:pb-16 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <FAQSection />
      </section>

      {/* SECTION 10: CONTACT */}
      <section
        id="contact"
        className="relative w-full mt-4 sm:mt-8 pt-4 sm:pt-8 pb-12 sm:pb-16 overflow-hidden z-20 flex flex-col items-center justify-start scroll-mt-24"
      >
        <ContactSection />
      </section>

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

      {/* AI CHATBOT CARD */}
      <AIChatCard isVisible={isVideoHidden} />
    </main>
  );
}
