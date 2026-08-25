"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
            setShowUnmuteHint(false);
          })
          .catch(() => {
            // Autoplay with audio was blocked by browser security policy
            if (video) {
              video.muted = true;
              setIsMuted(true);
              setShowUnmuteHint(true);
              video.play();
            }
          });
      }
    }

    // Global listener: First click or touch anywhere on the page instantly enables full audio
    const enableAudioOnInteraction = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
        setShowUnmuteHint(false);
      }
      window.removeEventListener("click", enableAudioOnInteraction);
      window.removeEventListener("touchstart", enableAudioOnInteraction);
      window.removeEventListener("keydown", enableAudioOnInteraction);
    };

    window.addEventListener("click", enableAudioOnInteraction);
    window.addEventListener("touchstart", enableAudioOnInteraction);
    window.addEventListener("keydown", enableAudioOnInteraction);

    return () => {
      window.removeEventListener("click", enableAudioOnInteraction);
      window.removeEventListener("touchstart", enableAudioOnInteraction);
      window.removeEventListener("keydown", enableAudioOnInteraction);
    };
  }, []);

  // Monitor timeline to start crossfade 1.5s BEFORE video finishes for a seamless film dissolve
  const handleTimeUpdate = () => {
    if (videoRef.current && !isVideoFading) {
      const remainingTime = videoRef.current.duration - videoRef.current.currentTime;
      if (remainingTime <= 1.5 && remainingTime > 0) {
        setIsVideoFading(true);
        setTimeout(() => {
          setIsVideoHidden(true);
        }, 1800);
      }
    }
  };

  const handleVideoEnded = () => {
    if (!isVideoFading) {
      setIsVideoFading(true);
      setTimeout(() => {
        setIsVideoHidden(true);
      }, 1800);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMute = !videoRef.current.muted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
      setShowUnmuteHint(false);
    }
  };

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center p-0 m-0">
      
      {/* Background Image Layer (100% Invisible during video playback; smoothly fades in during dissolve) */}
      <img
        src="/hero-bg.jpg"
        alt="UVCE Building"
        className={`fixed inset-0 w-full h-full object-cover z-0 transform-gpu transition-opacity duration-1000 ease-out ${
          isVideoFading ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Textured White Overlay Screen with Clean Soft White Grid (Fade-in Entrance) */}
      <div
        className={`fixed inset-0 bg-white/30 bg-tech-grid pointer-events-none z-[1] transition-opacity duration-1000 ease-out ${
          isVideoFading ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Floating Glassmorphic Pill Navbar */}
      <header
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-7xl h-16 rounded-2xl sm:rounded-full bg-slate-950/30 backdrop-blur-xl border border-white/70 shadow-lg shadow-white/10 transition-all duration-1000 ease-out delay-100 px-6 sm:px-10 flex items-center justify-between ${
          isVideoFading
            ? "translate-y-0 opacity-100"
            : "-translate-y-16 opacity-0 pointer-events-none"
        }`}
      />

      {/* Hero Title & Subtitle Glass Box Container */}
      <div
        className={`fixed top-[26%] sm:top-[35%] left-1/2 -translate-x-1/2 z-15 w-[95%] sm:w-auto max-w-lg sm:max-w-none flex flex-col items-center justify-center text-center transition-all duration-1000 ease-out delay-300 pointer-events-none ${
          isVideoFading
            ? "-translate-y-1/2 opacity-100 scale-100"
            : "translate-y-[20px] opacity-0 scale-95"
        }`}
      >
        {/* Title Glass Box containing Title + Subtitle */}
        <div className="w-full px-3 sm:px-10 py-5 sm:py-8 rounded-2xl sm:rounded-3xl bg-white/30 backdrop-blur-md border border-white/50 shadow-xl shadow-black/10 flex flex-col items-center justify-center text-center mx-auto overflow-hidden">
          <h1 className="whitespace-nowrap font-saman font-normal text-[3.9rem] sm:text-6xl md:text-7xl lg:text-[8.5rem] text-[#8a1c1c]/80 tracking-[-0.015em] drop-shadow-sm select-none leading-none text-center mx-auto">
            K<span className="inline-block ml-[0.03em]">a</span>g<span className="inline-block ml-[0.03em]">a</span>d<span className="inline-block ml-[0.03em]">a</span> 2026
          </h1>

          {/* Subtitle in Roboto Mono Font */}
          <p className="font-roboto-mono text-xs sm:text-base md:text-xl lg:text-2xl text-[#8a1c1c]/95 font-bold tracking-wider sm:tracking-widest mt-4 sm:mt-7 uppercase drop-shadow-sm select-none whitespace-normal sm:whitespace-nowrap leading-snug sm:leading-none max-w-[90%] sm:max-w-none mx-auto">
            Annual National-Level Technical Student Conference
          </p>
        </div>
      </div>

      {/* Floating Sound Toggle Pill & Unmute Indicator */}
      {!isVideoHidden && !isVideoFading && (
        <button
          onClick={toggleMute}
          className="fixed top-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-lg hover:bg-slate-900/80 transition-all active:scale-95 cursor-pointer"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Tap to Unmute Audio</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Audio On</span>
            </>
          )}
        </button>
      )}

      {/* Video Layer (Solid 100% opacity during playback; dissolves 1.5s before end with 1.8s soft blur-fade) */}
      {!isVideoHidden && (
        <video
          ref={videoRef}
          src="/video-intro.mp4"
          autoPlay
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className={`fixed inset-0 w-full h-full object-cover z-20 cursor-pointer transform-gpu transition-all duration-[1800ms] ease-in-out ${
            isVideoFading
              ? "opacity-0 scale-105 filter blur-[3px] pointer-events-none"
              : "opacity-100 scale-100 filter blur-0"
          }`}
        />
      )}
    </main>
  );
}
