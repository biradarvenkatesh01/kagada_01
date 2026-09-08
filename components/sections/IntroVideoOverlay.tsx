"use client";

import { useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroVideoOverlayProps {
  isVideoHidden: boolean;
  isVideoFading: boolean;
  onTimeUpdate: () => void;
  onEnded: () => void;
  onUnmute: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const IntroVideoOverlay = memo(function IntroVideoOverlay({
  isVideoHidden,
  isVideoFading,
  onTimeUpdate,
  onEnded,
  onUnmute,
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
          className="fixed inset-0 w-screen h-screen min-h-[100dvh] z-[9999] bg-black cursor-pointer transform-gpu pointer-events-auto overflow-hidden"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default IntroVideoOverlay;
