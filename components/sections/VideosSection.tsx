'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useState, useRef, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import { ScrollReveal } from '@/components/ui/scroll-reveal'

interface AftermovieItem {
  id: string
  title: string
  year: string
  duration: string
  videoSrc: string
  description: string
}

const AFTERMOVIES: AftermovieItem[] = [
  {
    id: "kagada-2024",
    title: "KAGADA 2024",
    year: "2024",
    duration: "1:30",
    videoSrc: "/kagada2024.mp4",
    description: "Relive the excitement and energy of KAGADA 2024 with highlights from all events, competitions and celebrations.",
  },
  {
    id: "kagada-2025",
    title: "KAGADA 2025",
    year: "2025",
    duration: "1:35",
    videoSrc: "/kagada2025.mp4",
    description: "Relive the excitement and energy of KAGADA 2025 with highlights from all events, competitions and celebrations.",
  },
]

function VideoCard({
  movie,
  idx,
  onOpenModal,
}: {
  movie: AftermovieItem;
  idx: number;
  onOpenModal: (movie: AftermovieItem) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playPromise: Promise<void> | null = null;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playPromise = video.play();
          if (playPromise) {
            playPromise.catch(() => {
              // Autoplay gracefully prevented or aborted
            });
          }
        } else {
          if (playPromise) {
            playPromise.then(() => video.pause()).catch(() => video.pause());
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.15 }
    );

    io.observe(video);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, []);

  return (
    <ScrollReveal direction="up" delay={idx * 100} className="w-full">
      <div
        className={cn(
          "relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 sm:p-6",
          "bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/35",
          "transform-gpu hover:scale-[1.02] hover:bg-white/40 hover:border-white transition-all duration-500"
        )}
      >
        {/* Glass Interior Reflective Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-3xl" />

        {/* Video Thumbnail Preview Window with Glowing Glass Play Button */}
        <div
          onClick={() => onOpenModal(movie)}
          className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-white/80 bg-black/40 group cursor-pointer z-10 shadow-xl"
        >
          {/* HTML5 Video Preview */}
          <video
            ref={videoRef}
            src={movie.videoSrc}
            muted
            playsInline
            loop
            preload="metadata"
            className="w-full h-full object-cover transform-gpu transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />

          {/* Dark Ambient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:bg-black/30 transition-colors" />

          {/* Center Glowing Glass Play Button Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8a1c1c]/75 backdrop-blur-2xl border-2 border-white text-white flex items-center justify-center shadow-2xl shadow-black/50 group-hover:scale-110 group-hover:bg-[#8a1c1c]/90 transition-all duration-300 transform-gpu">
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white text-white translate-x-0.5 drop-shadow-md" />
            </div>
          </div>

          {/* Bottom Right Duration Badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-white/30 backdrop-blur-xl text-white font-roboto-mono text-xs font-bold border border-white/80 shadow-lg">
            {movie.duration}
          </div>
        </div>

        {/* Card Content Footer inside Translucent Glass Badge */}
        <div className="flex flex-col gap-2 mt-5 z-10 text-left p-4 sm:p-5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/60 shadow-inner">
          <h3 className="font-smooch text-4xl sm:text-5xl font-semibold text-white tracking-wide leading-none drop-shadow-md">
            {movie.title}
          </h3>
          <p className="font-jakarta text-xs sm:text-sm font-medium text-white/90 leading-relaxed drop-shadow-sm">
            {movie.description}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

export const VideosSection = memo(function VideosSection() {
  const [activeModalVideo, setActiveModalVideo] = useState<AftermovieItem | null>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  const handleOpenModal = (movie: AftermovieItem) => {
    setActiveModalVideo(movie)
    setIsPlaying(true)
    setIsMuted(false)
  }

  const handleCloseModal = () => {
    setActiveModalVideo(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }
   if (activeModalVideo) {
  window.addEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'hidden' // Added to prevent background scroll
} else {
  document.body.style.overflow = 'unset' // Added to restore scroll
}
return () => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'unset' // Added to clean up on unmount
}
  }, [activeModalVideo])


  const togglePlayPause = () => {
    if (modalVideoRef.current) {
      if (isPlaying) {
        modalVideoRef.current.pause()
      } else {
        modalVideoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section id="videos" className="relative w-full max-w-6xl mx-auto flex flex-col items-center select-none px-4 py-8 sm:py-12 scroll-mt-6 z-10">
      {/* Main Title: KAGADA - From the previous years! */}
      <ScrollReveal direction="up" duration={500}>
        <h2 className="font-saman text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-lg tracking-tight text-center select-none leading-tight mb-4">
          KAGADA - <span className="text-amber-400 drop-shadow-md">From the previous years!</span>
        </h2>
      </ScrollReveal>

      {/* Subtitle */}
      <ScrollReveal direction="up" delay={60} duration={500}>
        <p className="font-roboto-mono text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest text-center drop-shadow-sm mb-10 sm:mb-14 max-w-2xl">
          Experience the magic of KAGADA through our cinematic after movies.
        </p>
      </ScrollReveal>

      {/* 2 Video Aftermovie Glassmorphic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 w-full">
        {AFTERMOVIES.map((movie, idx) => (
          <VideoCard
            key={movie.id}
            movie={movie}
            idx={idx}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>

      {/* FULLSCREEN INTERACTIVE CINEMATIC VIDEO MODAL */}
       <AnimatePresence>
          {activeModalVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl rounded-3xl overflow-hidden border-2 border-white/80 bg-[#3d0b0b]/95 backdrop-blur-2xl shadow-2xl shadow-black/90 flex flex-col"
              >
                {/* Modal Header Bar */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/30 bg-[#8a1c1c]/50 backdrop-blur-md">
                  <h3 className="font-saman text-2xl sm:text-4xl text-white tracking-wide">
                    {activeModalVideo.title} <span className="font-roboto-mono text-sm text-white/80">({activeModalVideo.year} Aftermovie)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/40"
                    aria-label="Close video"
                  >
                    <X className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Main Video Viewport */}
                <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                  <video
                    ref={modalVideoRef}
                    src={activeModalVideo.videoSrc}
                    autoPlay
                    controls
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </div>

                {/* Modal Footer Controls Bar */}
                <div className="p-4 sm:p-6 bg-[#8a1c1c]/50 backdrop-blur-md border-t border-white/30 flex items-center justify-between">
                  <p className="font-jakarta text-xs sm:text-sm font-medium text-white/90 max-w-2xl">
                    {activeModalVideo.description}
                  </p>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-white border border-white/40 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-white border border-white/40 transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  )
});

export default VideosSection;
