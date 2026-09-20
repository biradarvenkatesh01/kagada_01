"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward } from "lucide-react";

interface IntroVideoOverlayProps {
  isVideoHidden: boolean;
  isVideoFading: boolean;
  onTimeUpdate: () => void;
  onEnded: () => void;
  onUnmute: () => void;
  onSkip?: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const IntroVideoOverlay = memo(function IntroVideoOverlay({
  isVideoHidden,
  isVideoFading,
  onTimeUpdate,
  onEnded,
  onUnmute,
  onSkip,
  videoRef,
}: IntroVideoOverlayProps) {
  return (
    <AnimatePresence>
      {!isVideoHidden && (
        <motion.div
          key="intro-video-container"
          // No `filter: blur()` here. Animating blur on a full-viewport element
          // forces the compositor to re-run a separable Gaussian over the entire
          // screen every frame for 1.8s, at device pixel ratio, while a video is
          // decoding into that same surface -- the worst possible moment on a
          // mid-range phone, right as the hero behind it is being laid out.
          // `opacity` and `scale` are compositor-only and give the same dissolve.
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: isVideoFading ? 0 : 1,
            scale: isVideoFading ? 1.04 : 1,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={onUnmute}
          className="fixed inset-0 w-screen h-screen min-h-[100dvh] z-[9999] bg-black cursor-pointer transform-gpu pointer-events-auto overflow-hidden touch-none select-none overscroll-none"
        >
          {/* Two encodes of the same 8s clip. The source was 1080x1920 at
              4104 kb/s -- 4.23MB, which on a throttled 4G profile took ~5s to
              transfer and spent that time competing with the hero image, the
              fonts and the JS bundle while the page sat scroll-locked.
              Re-encoded at CRF it is 3.52MB, and phones (where the bandwidth
              actually hurts, and where the viewport is portrait so the clip is
              barely scaled) get a 720x1280 cut at 2.13MB instead -- half the
              original. The browser picks by `media` before it fetches, so only
              one is ever downloaded. Both keep `+faststart`, so playback begins
              on the first chunk rather than the last. */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
            className="w-full h-full min-h-[100dvh] object-cover"
          >
            <source src="/video-intro-mobile.mp4" type="video/mp4" media="(max-width: 820px)" />
            <source src="/video-intro.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/18 pointer-events-none z-[51]" />

          {/* ⏭️ SKIP INTRO BUTTON */}
          {onSkip && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                onSkip();
              }}
              className="intro-skip-btn absolute top-[calc(1.2rem+env(safe-area-inset-top,0px))] sm:top-7 right-5 sm:right-8 z-[60] flex items-center gap-2 px-4.5 py-2.5 sm:px-6 sm:py-3 !rounded-none kagada-paper-card hover:brightness-105 border-2 border-[#5A182B]/30 text-[#5A182B] font-outfit text-xs sm:text-sm font-black tracking-wider uppercase transition-glass duration-200 shadow-2xl shadow-black/60 group cursor-pointer"
              aria-label="Skip Intro Video"
            >
              <span className="leading-none font-black text-[#5A182B]">Skip</span>
              <SkipForward className="w-4 h-4 text-[#5A182B] stroke-[2.5] transition-transform group-hover:translate-x-0.5" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default IntroVideoOverlay;
