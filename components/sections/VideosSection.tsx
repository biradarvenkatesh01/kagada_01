'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useState, useRef, useEffect, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react'
import { cn } from '@/lib/utils'


interface AftermovieItem {
  id: string
  title: string
  year: string
  duration: string
  videoSrc: string
  posterSrc: string
  description: string
}

const AFTERMOVIES: AftermovieItem[] = [
  {
    id: "kagada-20",
    title: "KAGADA 20",
    year: "20",
    duration: "1:30",
    videoSrc: "/kagada2024.mp4",
    posterSrc: "/optimized/videos/kagada2024-poster.webp",
    description: "Relive the excitement and energy of KAGADA 20 with highlights from all events, competitions and celebrations.",
  },
  {
    id: "kagada-2025",
    title: "KAGADA 2025",
    year: "2025",
    duration: "1:35",
    videoSrc: "/kagada2025.mp4",
    posterSrc: "/optimized/videos/kagada2025-poster.webp",
    description: "Relive the excitement and energy of KAGADA 2025 with highlights from all events, competitions and celebrations.",
  },
]

const VideoCard = memo(function VideoCard({
  movie,
  onOpenModal,
}: {
  movie: AftermovieItem;
  onOpenModal: (movie: AftermovieItem) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 sm:p-6",
          "kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/25",
          "hover:shadow-2xl hover:border-white transition-glass duration-500"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Video Thumbnail Preview Window with Glowing Play Button */}
        <div
          onClick={() => onOpenModal(movie)}
          className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#ded4c3] bg-black/40 group cursor-pointer z-10 shadow-xl"
        >
          {/* HTML5 Video Preview */}
          <video
            ref={videoRef}
            src={movie.videoSrc}
            poster={movie.posterSrc}
            muted
            playsInline
            loop
            preload="none"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Dark Ambient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:bg-black/30 transition-colors" />

          {/* Center Glowing Play Button Badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#D8D3C7] border-2 border-[#5A182B]/30 text-[#5A182B] flex items-center justify-center shadow-2xl shadow-black/50 group-hover:bg-white transition-colors duration-300">
              <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-[#5A182B] text-[#5A182B] translate-x-0.5 drop-shadow-md" />
            </div>
          </div>

          {/* Bottom Right Duration Badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-[#D8D3C7] text-[#5A182B] font-roboto-mono text-xs font-black border border-[#5A182B]/30 shadow-lg">
            {movie.duration}
          </div>
        </div>

        {/* Card Content Footer */}
        <div className="flex flex-col gap-2 mt-5 z-10 text-left p-4 sm:p-5 rounded-2xl bg-[#5A182B]/5 border border-[#5A182B]/15 shadow-sm">
          <h3 className="font-smooch text-4xl sm:text-5xl font-semibold text-[#5A182B] tracking-wide leading-none">
            {movie.title}
          </h3>
          <p className="font-jakarta text-xs sm:text-sm font-medium text-stone-700 leading-relaxed">
            {movie.description}
          </p>
        </div>
      </div>
    </div>
  );
});

export const VideosSection = memo(function VideosSection() {
  const [activeModalVideo, setActiveModalVideo] = useState<AftermovieItem | null>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)

  const handleOpenModal = useCallback((movie: AftermovieItem) => {
    setActiveModalVideo(movie)
    setIsPlaying(true)
    setIsMuted(false)
  }, [])

  const handleCloseModal = useCallback(() => {
    setActiveModalVideo(null)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }
    if (!activeModalVideo) return

    window.addEventListener('keydown', handleKeyDown)
    // Restore whatever was set before instead of forcing a value, so closing the
    // modal doesn't release a scroll lock owned by another overlay.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [activeModalVideo, handleCloseModal])


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
      <div>
        <h2 className="font-saman text-[#D8D3C7] text-4xl sm:text-6xl md:text-7xl lg:text-8xl tshadow-lg tracking-tight text-center select-none leading-tight mb-1.5 sm:mb-2">
          KAGADA - <span className="text-amber-400 tshadow-md">From the previous years!</span>
        </h2>
      </div>

      {/* Subtitle */}
      <div>
        <p className="font-roboto-mono text-xs sm:text-sm font-semibold text-[#D8D3C7]/90 uppercase tracking-widest text-center tshadow-sm mb-4 sm:mb-6 max-w-2xl">
          Experience the magic of KAGADA through our cinematic after movies.
        </p>
      </div>

      {/* 2 Video Aftermovie Glassmorphic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
        {AFTERMOVIES.map((movie) => (
          <VideoCard
            key={movie.id}
            movie={movie}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>

      {/* FULLSCREEN INTERACTIVE CINEMATIC VIDEO MODAL */}
         {typeof document !== 'undefined' && createPortal(
       <AnimatePresence>
          {activeModalVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999999] bg-black/95 flex items-center justify-center p-4 sm:p-8"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl rounded-3xl overflow-hidden border-2 border-white/95 bg-[#250606] shadow-2xl shadow-black/90 flex flex-col"
              >
                {/* Modal Header Bar */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 bg-[#5A182B]">
                  <h3 className="font-saman text-2xl sm:text-4xl text-[#D8D3C7] tracking-wide">
                    {activeModalVideo.title} <span className="font-roboto-mono text-sm text-[#D8D3C7]/80">({activeModalVideo.year} Aftermovie)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-[#D8D3C7] flex items-center justify-center transition-colors cursor-pointer border border-white/40"
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
                    controlsList="nodownload noplaybackrate noremoteplayback"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-contain"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                </div>

                {/* Modal Footer Controls Bar */}
                <div className="p-4 sm:p-6 bg-[#5A182B] border-t border-white/20 flex items-center justify-between">
                  <p className="font-jakarta text-xs sm:text-sm font-medium text-[#D8D3C7]/90 max-w-2xl">
                    {activeModalVideo.description}
                  </p>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-[#D8D3C7] border border-white/40 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-[#D8D3C7]" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-2.5 rounded-xl bg-white/20 hover:bg-white/40 text-[#D8D3C7] border border-white/40 transition-colors cursor-pointer"
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
