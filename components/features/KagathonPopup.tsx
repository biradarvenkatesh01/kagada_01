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
    y: 16,
    scale: 0.97,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function KagathonPopup({ isOpen, onClose }: KagathonPopupProps) {
  const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const maybeLaterBtnRef = useRef<HTMLButtonElement>(null);

  // Preload poster image when popup is initialized
  useEffect(() => {
    if (!isOpen) return;
    const img720 = new Image();
    img720.src = "/optimized/kagathon/kagathon-poster-720.webp";
  }, [isOpen]);

  // Handle scroll lock, Lenis pause, and escape key
  useEffect(() => {
    if (!isOpen) return;

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

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const elem =
        document.getElementById("kagathon-register") ||
        document.getElementById("kagathon");
      if (!elem) {
        window.location.hash = "kagathon-register";
        return;
      }
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (el: HTMLElement | string, opts?: unknown) => void };
        }
      ).__lenis;
      if (lenis?.scrollTo) {
        lenis.scrollTo(elem, { offset: -80 });
      } else {
        elem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 280);
  };

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
          {/* Lightweight GPU-composited backdrop without expensive procedural shader overdraw */}
          <motion.div
            key="kagathon-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            onWheel={(e) => e.preventDefault()}
            onTouchMove={(e) => e.preventDefault()}
            className="fixed inset-0 cursor-pointer overflow-hidden touch-none transform-gpu will-change-opacity bg-black/75 backdrop-blur-sm"
            aria-label="Close Kagathon announcement"
          />

          {/* Dialog Card: Animates opacity and translateY only */}
          <motion.div
            key="kagathon-popup-card"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-[92vw] max-w-[360px] sm:max-w-[390px] flex flex-col items-center kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/50 !rounded-2xl sm:!rounded-3xl overflow-hidden pointer-events-auto transform-gpu select-none p-5 sm:p-6"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 rounded-full bg-[#5A182B]/10 hover:bg-[#5A182B]/20 text-[#5A182B] flex items-center justify-center transition-colors cursor-pointer text-lg font-bold leading-none"
            >
              &times;
            </button>

            {/* Poster - Crisp aspect ratio with shadow */}
            <div className="w-[210px] h-[210px] min-[360px]:w-[240px] min-[360px]:h-[240px] sm:w-[260px] sm:h-[260px] aspect-square !rounded-xl sm:!rounded-2xl overflow-hidden border-2 border-white/90 shadow-xl relative bg-[#D8D3C7]/40 shrink-0 mx-auto mt-1 sm:mt-2">
              <img
                src="/optimized/kagathon/kagathon-poster-720.webp"
                srcSet="/optimized/kagathon/kagathon-poster-720.webp 720w, /optimized/kagathon/kagathon-poster.webp 1200w"
                sizes="(max-width: 640px) 240px, 260px"
                width={720}
                height={720}
                alt="Kagathon - Your Only Limit Is You"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Catchy Persuasive Text & Curtain Raiser Tag */}
            <div className="text-center px-2 mt-3.5 sm:mt-4 text-[#5A182B] flex flex-col items-center">
              <p className="font-roboto-mono text-[9px] min-[360px]:text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5A182B]/80 mb-1">
                The Curtain Raiser for Kagada 2026
              </p>
              <h2
                id="kagathon-popup-title"
                className="font-smooch text-3xl sm:text-4xl font-semibold leading-none tracking-wide text-[#5A182B]"
              >
                Run the Beat. Feel the Thrill.
              </h2>
              <p className="font-jakarta text-xs sm:text-sm text-slate-800 font-medium mt-1.5 leading-relaxed max-w-[280px] sm:max-w-xs mx-auto">
                Sunrise energy, live DJ beats, exciting treats & official certificate await at UVCE Quadrangle!
              </p>
            </div>

            {/* Registration Action Button & Maybe Later */}
            <div className="w-full flex flex-col items-center gap-2 mt-4 sm:mt-5">
              <a
                href="#kagathon-register"
                onClick={handleRegisterClick}
                className="w-full py-3 px-4 bg-[#5A182B] hover:bg-[#431220] border-2 border-white/95 text-white font-roboto-mono font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-none shadow-lg flex items-center justify-center transition-colors select-none text-center"
              >
                <span>REGISTER FOR KAGATHON &rarr;</span>
              </a>
              <button
                ref={maybeLaterBtnRef}
                type="button"
                onClick={onClose}
                className="font-roboto-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#5A182B]/70 hover:text-[#5A182B] transition-colors cursor-pointer py-1 outline-none focus-visible:ring-1 focus-visible:ring-[#5A182B]/40"
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
