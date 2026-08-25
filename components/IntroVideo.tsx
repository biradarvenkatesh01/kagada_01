"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  ChevronDown,
  Trophy,
  FileText,
  Users,
  Award,
  X
} from "lucide-react";

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const theaterVideoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);

  // Sync video timeline
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (!newMutedState) {
        setShowUnmuteHint(false);
      }
    }
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const openTheaterMode = () => {
    setIsTheaterMode(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const closeTheaterMode = () => {
    setIsTheaterMode(false);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <section id="intro" className="relative min-h-screen pt-24 pb-16 flex flex-col justify-between bg-slate-950 text-white overflow-hidden">
      {/* Dynamic Background Glow FX */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 my-auto">
        
        {/* Intro Badge & Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "6s" }} />
            IEEE UVCE Presents • 21st Edition
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight">
            KAGADA <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">2026</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            National Level Student Conference, Technical Paper & Project Presentation
          </p>
        </div>

        {/* Video Hero Frame / Screen Card */}
        <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden border border-cyan-500/30 bg-slate-900/90 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl transition-all duration-500 group">
          
          {/* Unmute Prompt Floating Badge */}
          {showUnmuteHint && isMuted && (
            <button
              onClick={toggleMute}
              className="absolute top-5 right-5 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/40 backdrop-blur-md transition-all transform hover:scale-105 animate-bounce"
            >
              <VolumeX className="w-4 h-4 text-slate-950" />
              <span>Click to Unmute Audio</span>
            </button>
          )}

          {/* Core Video Element */}
          <div className="relative aspect-video w-full bg-black">
            <video
              ref={videoRef}
              src="/video-intro.mp4"
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
            />

            {/* Video Subtle Vignette & Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

            {/* Center Play Overlay (Visible when paused) */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-20 transition-all">
                <button
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-cyan-500/90 hover:bg-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 transform hover:scale-110 transition-all"
                  aria-label="Play Intro Video"
                >
                  <Play className="w-9 h-9 fill-current ml-1" />
                </button>
              </div>
            )}

            {/* Bottom Overlay Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent z-20 space-y-3">
              
              {/* Scrubbable Timeline Bar */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-cyan-300 min-w-[36px]">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300 transition-all"
                />
                <span className="text-[11px] font-mono text-slate-400 min-w-[36px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Control Buttons & Actions */}
              <div className="flex items-center justify-between pt-1">
                {/* Left Playback Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-slate-900/80 hover:bg-cyan-500/20 text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all"
                    title={isPlaying ? "Pause Video" : "Play Video"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className={`p-2 rounded-lg transition-all border ${
                      isMuted
                        ? "bg-slate-900/80 text-slate-400 border-slate-700 hover:text-cyan-400"
                        : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                    }`}
                    title={isMuted ? "Unmute Sound" : "Mute Sound"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <button
                    onClick={handleReplay}
                    className="p-2 rounded-lg bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-all"
                    title="Replay Video"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Right Action & Theater Mode */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={openTheaterMode}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30 hover:brightness-110 transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Cinema Mode</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#tracks"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transform hover:-translate-y-0.5 transition-all"
          >
            <Trophy className="w-4 h-4" />
            View Competition Tracks
          </a>
          <a
            href="#register"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 shadow-md transition-all"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            Submit Abstract / Paper
          </a>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">₹1,00,000+</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Cash Prize Pool</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">4 Tracks</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Papers, Expo, WIE & Poster</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">50+ Colleges</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Nationwide Representation</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">IEEE UVCE</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Organizing Body</p>
          </div>
        </div>

      </div>

      {/* Down Scroll Indicator */}
      <div className="text-center pt-8">
        <a
          href="#tracks"
          className="inline-flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 text-xs font-medium transition-colors group"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400" />
        </a>
      </div>

      {/* Theater / Fullscreen Cinema Modal */}
      {isTheaterMode && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
          <button
            onClick={closeTheaterMode}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-slate-900/80 hover:bg-cyan-500 text-slate-300 hover:text-slate-950 border border-slate-700 transition-all shadow-xl"
            aria-label="Close Cinema Mode"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 bg-black">
            <video
              ref={theaterVideoRef}
              src="/video-intro.mp4"
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
