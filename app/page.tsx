"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoFading, setIsVideoFading] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {
        // Fallback to muted autoplay if browser blocks audio autoplay
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, []);

  // Monitor video playback and update small red loading bar
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 1;
      const cur = videoRef.current.currentTime || 0;
      const progress = Math.min((cur / dur) * 100, 100);
      setVideoProgress(progress);

      if (!isVideoFading) {
        const remainingTime = dur - cur;
        if (remainingTime <= 1.5 && remainingTime > 0) {
          setIsVideoFading(true);
          setTimeout(() => {
            setIsVideoHidden(true);
          }, 1800);
        }
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

  const handleTapToUnmute = () => {
    if (videoRef.current && videoRef.current.muted) {
      videoRef.current.muted = false;
    }
  };

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center p-0 m-0">
      
      {/* Sleek Small Red Video Loading Progress Bar */}
      {!isVideoHidden && (
        <div className="fixed top-0 left-0 right-0 z-30 h-1 bg-black/40 overflow-hidden pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-red-700 via-red-600 to-[#8a1c1c] transition-all duration-300 ease-out shadow-[0_0_8px_rgba(220,38,38,0.8)]"
            style={{ width: `${videoProgress}%` }}
          />
        </div>
      )}

      {/* Background Image Layer */}
      <img
        src="/hero-bg.jpg"
        alt="UVCE Building"
        className="fixed inset-0 w-full h-full object-cover z-0 transform-gpu"
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

      {/* Video Layer (Dissolves 1.5s before end with 1.8s soft blur-fade) */}
      {!isVideoHidden && (
        <video
          ref={videoRef}
          src="/video-intro.mp4"
          autoPlay
          playsInline
          onCanPlay={() => setIsVideoReady(true)}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onClick={handleTapToUnmute}
          className={`fixed inset-0 w-full h-full object-cover z-20 cursor-pointer transform-gpu transition-all duration-[1800ms] ease-in-out ${
            isVideoFading
              ? "opacity-0 scale-105 filter blur-[3px] pointer-events-none"
              : isVideoReady
              ? "opacity-100 scale-100 filter blur-0"
              : "opacity-95 scale-100 filter blur-0"
          }`}
        />
      )}
    </main>
  );
}
