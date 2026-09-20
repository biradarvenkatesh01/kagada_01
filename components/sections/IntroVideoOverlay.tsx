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
          initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          animate={{
            opacity: isVideoFading ? 0 : 1,
            scale: isVideoFading ? 1.04 : 1,
            filter: isVideoFading ? "blur(4px)" : "blur(0px)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={onUnmute}
          className="fixed inset-0 w-screen h-screen min-h-[100dvh] z-[9999] bg-black cursor-pointer transform-gpu pointer-events-auto overflow-hidden touch-none select-none overscroll-none"
        >
          <video
            ref={videoRef}
            src="/video-intro.mp4"
            autoPlay
            playsInline
            onTimeUpdate={onTimeUpdate}
            onEnded={onEnded}
            className="w-full h-full min-h-[100dvh] object-cover"
          />
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
              className="intro-skip-btn absolute top-[calc(1.2rem+env(safe-area-inset-top,0px))] sm:top-7 right-5 sm:right-8 z-[60] flex items-center gap-2 px-4.5 py-2.5 sm:px-6 sm:py-3 !rounded-none kagada-paper-card hover:brightness-105 border-2 border-[#5A182B]/30 text-[#5A182B] font-outfit text-xs sm:text-sm font-black tracking-wider uppercase transition-all duration-200 shadow-2xl shadow-black/60 group cursor-pointer"
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
