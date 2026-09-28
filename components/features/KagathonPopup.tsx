"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface KagathonPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const cardVariants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function KagathonPopup({ isOpen, onClose }: KagathonPopupProps) {
  const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const maybeLaterBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Preload the poster on mount with new Image() so it is already decoded when popup opens
    const img720 = new Image();
    img720.src = "/optimized/kagathon/kagathon-poster-720.webp";
    const img1200 = new Image();
    img1200.src = "/optimized/kagathon/kagathon-poster.webp";
  }, []);

  // Scroll lock, lenis pause, escape key, and mutual exclusivity events
  useEffect(() => {
    if (!isOpen) return;

    // Dispatch custom events to close navbar dropdown or chat if open
    window.dispatchEvent(new CustomEvent("kagada:close-dropdown"));
    window.dispatchEvent(new CustomEvent("kagada:close-chat"));

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const lenis = (
      window as unknown as {
        __lenis?: { stop: () => void; start: () => void };
      }
    ).__lenis;
    if (lenis) {
      lenis.stop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Focus interactive button on open
    const focusTimer = setTimeout(() => {
      maybeLaterBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      if (lenis) {
        lenis.start();
      }
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  if (!isMounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kagathon-popup-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 overscroll-none"
        >
          {/* Backdrop with slight blur, tinted burgundy, fabric texture, and vignette */}
          <motion.div
            key="kagathon-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
            className="fixed inset-0 cursor-pointer overflow-hidden touch-none transform-gpu will-change-opacity backdrop-blur-[3px]"
            aria-label="Close Kagathon announcement"
          >
            <div className="absolute inset-0 bg-[#5A182B]/80" />
            <div className="absolute inset-0 opacity-50 kagada-fabric-bg-texture pointer-events-none transform-gpu" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, transparent 35%, rgba(15, 1, 4, 0.5) 100%)",
              }}
            />
          </motion.div>

          {/* Card: Animates opacity and y only (never scale) */}
          <motion.div
            key="kagathon-popup-card"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-[92vw] max-w-[380px] sm:max-w-[410px] flex flex-col kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/40 !rounded-2xl sm:!rounded-3xl overflow-hidden pointer-events-auto transform-gpu select-none"
          >
            {/* Static content wrapper - completely scroll-free */}
            <div
              data-lenis-prevent="true"
              className="p-3.5 sm:p-4 flex flex-col items-center gap-2 sm:gap-2.5 text-[#5A182B] overflow-hidden"
            >
              {/* Compact poster frame */}
              <div className="w-28 h-28 min-[380px]:w-32 min-[380px]:h-32 sm:w-36 sm:h-36 aspect-square !rounded-xl overflow-hidden border-2 border-white/85 shadow-md relative bg-[#D8D3C7]/40 shrink-0 mx-auto">
                <img
                  src="/optimized/kagathon/kagathon-poster-720.webp"
                  srcSet="/optimized/kagathon/kagathon-poster-720.webp 720w, /optimized/kagathon/kagathon-poster.webp 1200w"
                  sizes="(max-width: 640px) 128px, 144px"
                  width={1200}
                  height={1200}
                  alt="Kagathon - Your Only Limit Is You"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              {/* Centered title block */}
              <div className="text-center">
                <h2
                  id="kagathon-popup-title"
                  className="font-smooch text-3xl min-[380px]:text-4xl sm:text-5xl font-semibold text-[#5A182B] leading-none tracking-wide"
                >
                  Kagathon
                </h2>
                <p className="font-roboto-mono text-[9px] min-[380px]:text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5A182B]/85 mt-0.5">
                  THE CURTAIN RAISER FOR KAGADA 2026
                </p>
              </div>

              {/* Catchy quote */}
              <p className="font-jakarta italic text-center text-[11px] min-[380px]:text-xs text-[#5A182B] font-semibold px-2 leading-tight">
                &ldquo;A marathon is a reminder that every finish starts with a beginning!&rdquo;
              </p>

              {/* Catchy broadcast line */}
              <p className="font-jakarta text-[11px] min-[380px]:text-xs text-[#5A182B] text-center px-1 leading-snug">
                Step into a morning of <strong>live DJ, dance, fun games, treats</strong>, and a{" "}
                <strong>certificate to remember</strong>!
              </p>

              {/* Registration deadlines */}
              <div className="text-center space-y-0.5 font-roboto-mono text-[10px] min-[380px]:text-[11px] sm:text-xs font-bold">
                <p>
                  <span className="uppercase text-[#5A182B]/80 tracking-wider">
                    T-Shirt Registration Deadline:
                  </span>{" "}
                  <span className="font-jakarta font-extrabold text-[#5A182B]">
                    8th October, 2026
                  </span>
                </p>
                <p>
                  <span className="uppercase text-[#5A182B]/80 tracking-wider">
                    Final Registration Deadline:
                  </span>{" "}
                  <span className="font-jakarta font-extrabold text-[#5A182B]">
                    13th October, 2026
                  </span>
                </p>
              </div>
            </div>

            {/* Pinned footer */}
            <div className="shrink-0 border-t border-[#5A182B]/20 bg-[#D8D3C7]/60 p-2.5 sm:p-3 flex flex-col items-center gap-1 w-full">
              <a
                href="https://bit.ly/KAGADA2026-Kagathon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 sm:py-2.5 px-4 bg-[#5A182B] hover:bg-[#431220] border-2 border-white/95 text-white font-roboto-mono font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-none shadow-md flex items-center justify-center transition-colors select-none text-center"
              >
                <span>REGISTER FOR KAGATHON &rarr;</span>
              </a>
              <button
                ref={maybeLaterBtnRef}
                type="button"
                onClick={onClose}
                className="font-roboto-mono text-[11px] uppercase tracking-wider text-[#5A182B]/75 hover:text-[#5A182B] transition-colors cursor-pointer py-0.5"
              >
                MAYBE LATER
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
