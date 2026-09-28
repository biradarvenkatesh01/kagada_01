"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Music, Shirt, Coffee, Award } from "lucide-react";

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
  const closeBtnRef = useRef<HTMLButtonElement>(null);

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

    // Focus close button on open
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
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
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overscroll-none"
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
            className="relative z-10 w-[92vw] max-w-[440px] sm:max-w-[480px] max-h-[88dvh] flex flex-col kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/40 !rounded-2xl sm:!rounded-3xl overflow-hidden pointer-events-auto transform-gpu select-none"
          >
            {/* Close button (top-right) */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 !rounded-full bg-[#D8D3C7] border border-[#5A182B]/30 text-[#5A182B] hover:bg-white transition-colors flex items-center justify-center shadow-md cursor-pointer pointer-events-auto"
              aria-label="Close Kagathon announcement"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Scrollable body */}
            <div
              data-lenis-prevent="true"
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain custom-scrollbar p-4 sm:p-6 space-y-4 text-slate-900"
            >
              {/* 1. Poster in a square frame */}
              <div className="w-full aspect-square !rounded-xl sm:!rounded-2xl overflow-hidden border-2 border-white/80 shadow-lg relative bg-[#D8D3C7]/40 shrink-0">
                <img
                  src="/optimized/kagathon/kagathon-poster-720.webp"
                  srcSet="/optimized/kagathon/kagathon-poster-720.webp 720w, /optimized/kagathon/kagathon-poster.webp 1200w"
                  sizes="(max-width: 640px) 92vw, 480px"
                  width={1200}
                  height={1200}
                  alt="Kagathon - Your Only Limit Is You"
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              {/* 2. Centered title block */}
              <div className="border-b border-[#5A182B]/20 pb-3 text-center">
                <h2
                  id="kagathon-popup-title"
                  className="font-smooch text-5xl sm:text-6xl font-semibold text-[#5A182B] leading-none tracking-wide"
                >
                  Kagathon
                </h2>
                <p className="font-roboto-mono text-xs font-bold uppercase tracking-widest text-[#5A182B]/85 mt-1">
                  THE CURTAIN RAISER FOR KAGADA 2026
                </p>
              </div>

              {/* 3. Quote in italic burgundy */}
              <p className="font-jakarta italic text-center text-xs sm:text-sm text-[#5A182B] font-semibold px-2">
                &ldquo;A marathon is a reminder that every finish starts with a beginning!&rdquo;
              </p>

              {/* 4. Short, catchy paragraph with bold keywords */}
              <p className="font-jakarta text-xs sm:text-sm text-slate-800 leading-relaxed text-center">
                Join us at <strong>sunrise at the UVCE Quadrangle</strong> for an unforgettable morning of{" "}
                <strong>games, music, dance and fun with friends</strong>. Challenge your limits, enjoy the outdoors,
                and kickstart Kagada 2026!
              </p>

              {/* 5. 2x2 grid of highlight tiles */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full">
                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 shadow-sm p-2.5 sm:p-3 flex items-start gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5A182B]/10 border border-[#5A182B]/25 flex items-center justify-center shrink-0 text-[#5A182B]">
                    <Music className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-roboto-mono text-[0.7rem] sm:text-xs font-bold text-[#5A182B] uppercase tracking-wide block">
                      Live DJ
                    </span>
                    <span className="font-jakarta text-[0.68rem] sm:text-[0.75rem] text-slate-700 leading-tight mt-0.5 block">
                      Beats to power every stride
                    </span>
                  </div>
                </div>

                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 shadow-sm p-2.5 sm:p-3 flex items-start gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5A182B]/10 border border-[#5A182B]/25 flex items-center justify-center shrink-0 text-[#5A182B]">
                    <Shirt className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-roboto-mono text-[0.7rem] sm:text-xs font-bold text-[#5A182B] uppercase tracking-wide block">
                      Kagathon Tee
                    </span>
                    <span className="font-jakarta text-[0.68rem] sm:text-[0.75rem] text-slate-700 leading-tight mt-0.5 block">
                      Run in the official colours
                    </span>
                  </div>
                </div>

                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 shadow-sm p-2.5 sm:p-3 flex items-start gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5A182B]/10 border border-[#5A182B]/25 flex items-center justify-center shrink-0 text-[#5A182B]">
                    <Coffee className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-roboto-mono text-[0.7rem] sm:text-xs font-bold text-[#5A182B] uppercase tracking-wide block">
                      Treats
                    </span>
                    <span className="font-jakarta text-[0.68rem] sm:text-[0.75rem] text-slate-700 leading-tight mt-0.5 block">
                      Refuel after the finish line
                    </span>
                  </div>
                </div>

                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 shadow-sm p-2.5 sm:p-3 flex items-start gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5A182B]/10 border border-[#5A182B]/25 flex items-center justify-center shrink-0 text-[#5A182B]">
                    <Award className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <span className="font-roboto-mono text-[0.7rem] sm:text-xs font-bold text-[#5A182B] uppercase tracking-wide block">
                      Certificate
                    </span>
                    <span className="font-jakarta text-[0.68rem] sm:text-[0.75rem] text-slate-700 leading-tight mt-0.5 block">
                      Proof you went the distance
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. 3-column row of detail tiles */}
              <div className="grid grid-cols-3 gap-2 w-full text-center">
                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 shadow-sm py-2 px-1">
                  <span className="font-roboto-mono text-[0.65rem] sm:text-[0.7rem] font-bold text-[#5A182B]/75 uppercase tracking-wider block">
                    Date
                  </span>
                  <span className="font-roboto-mono text-xs sm:text-sm font-extrabold text-[#5A182B] mt-0.5 block">
                    18 Oct, 2026
                  </span>
                </div>

                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 shadow-sm py-2 px-1">
                  <span className="font-roboto-mono text-[0.65rem] sm:text-[0.7rem] font-bold text-[#5A182B]/75 uppercase tracking-wider block">
                    Time
                  </span>
                  <span className="font-roboto-mono text-xs sm:text-sm font-extrabold text-[#5A182B] mt-0.5 block">
                    6:30 AM
                  </span>
                </div>

                <div className="!rounded-xl bg-[#D8D3C7]/80 border border-[#5A182B]/20 shadow-sm py-2 px-1">
                  <span className="font-roboto-mono text-[0.65rem] sm:text-[0.7rem] font-bold text-[#5A182B]/75 uppercase tracking-wider block">
                    Venue
                  </span>
                  <span className="font-roboto-mono text-[0.7rem] sm:text-xs font-extrabold text-[#5A182B] mt-0.5 block leading-tight">
                    Quadrangle, UVCE
                  </span>
                </div>
              </div>

              {/* 7. Deadlines box */}
              <div className="bg-[#D8D3C7]/40 !rounded-xl border border-[#5A182B]/20 shadow-inner p-3 text-center space-y-1 text-xs sm:text-[0.8rem] text-[#5A182B] font-semibold">
                <p>Registrations close: 13th October, 2026 &middot; 11:59 PM</p>
                <p>T-shirt orders close: 8th October, 2026</p>
              </div>
            </div>

            {/* Pinned footer */}
            <div className="shrink-0 border-t border-[#5A182B]/20 bg-[#D8D3C7]/60 p-3 sm:p-4 flex flex-col items-center gap-2 w-full">
              <a
                href="https://bit.ly/KAGADA2026-Kagathon"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 sm:py-3 px-4 bg-[#5A182B] hover:bg-[#431220] border-2 border-white/95 text-white font-roboto-mono font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-none shadow-lg flex items-center justify-center transition-colors select-none text-center"
              >
                <span>REGISTER FOR KAGATHON &rarr;</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="font-roboto-mono text-xs uppercase tracking-wider text-[#5A182B]/75 hover:text-[#5A182B] transition-colors cursor-pointer py-1"
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
