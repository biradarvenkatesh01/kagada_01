"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SquareArrowOutUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type CardStackItem = {
  id: string | number;
  type?: "uvce" | "ieee" | "kagada";
  title?: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;
  mobileCardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion */
  springStiffness?: number;
  springDamping?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

const subscribeMobileViewport = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(max-width: 640px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

const getMobileViewportSnapshot = () =>
  typeof window !== "undefined" ? window.matchMedia("(max-width: 640px)").matches : false;

const getMobileViewportServerSnapshot = () => false;

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 3,

  cardWidth = 960,
  cardHeight = 570,
  mobileCardHeight = 570,

  overlap = 0.45,
  perspectivePx = 1400,
  depthPx = 200,

  inactiveScale = 1,

  springStiffness = 280, // Snappy responsive spring physics for quick sliding motion
  springDamping = 26, // Quick, smooth liquid damping

  loop = true,
  autoAdvance = true,
  intervalMs = 3500, // 3.5 seconds auto advance
  pauseOnHover = true,

  showDots = false,
  showArrows = true,
  className,

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [prevLen, setPrevLen] = React.useState(len);
  if (prevLen !== len) {
    setPrevLen(len);
    setActive((a) => wrapIndex(a, len));
  }

  const [hovering, setHovering] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const isMobileViewport = React.useSyncExternalStore(
    subscribeMobileViewport,
    getMobileViewportSnapshot,
    getMobileViewportServerSnapshot
  );

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Track visibility with IntersectionObserver to sleep autoAdvance when off-screen
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const maxOffset = Math.max(1, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // 6-second auto cycle (pauses when off-screen or user hovering)
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (!isInView) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(1000, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    isInView,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger swipe if horizontal displacement exceeds vertical and is at least 40px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= 40) {
      if (deltaX > 0) {
        prev();
      } else {
        next();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!len) return null;

  const activeItem = items[active]!;
  const isMobile = cardWidth < 500 || isMobileViewport;
  const effectiveCardHeight = isMobile ? mobileCardHeight : cardHeight;

  return (
    <div
      ref={containerRef}
      className={cn("w-full flex flex-col items-center justify-center", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full flex items-center justify-center touch-pan-y"
        style={{ height: isMobile ? `${effectiveCardHeight + 20}px` : `calc(min(90vh, ${effectiveCardHeight}px) + 56px)` }}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
            {/* background wash / spotlight */}
            <div
              className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-56 w-[75%] rounded-full bg-[#5A182B]/10 blur-3xl"
              aria-hidden="true"
            />

            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                perspective: `${perspectivePx}px`,
              }}
            >
              <AnimatePresence initial={false}>
                {items.map((item, i) => {
                  const off = signedOffset(i, active, len, loop);
                  const abs = Math.abs(off);
                  const visible = abs <= maxOffset;

                  // hide far-away cards cleanly
                  if (!visible) return null;

                  // 3D Geometry: on mobile (<500px or mobile viewport), cards stack cleanly behind without overflowing screen edges
                  const radiusAngle = (off / maxOffset) * (Math.PI / 3.4);
                  const x = isMobile ? off * 10 : Math.sin(radiusAngle) * (cardSpacing * 1.35);
                  const z = isMobile ? -abs * 35 : (Math.cos(radiusAngle) - 1) * depthPx * 1.8;
                  const rotateY = isMobile ? 0 : off * -7;
                  const y = isMobile ? -abs * 10 : 0;

                  const isActive = off === 0;

                  const scale = 1;
                  const lift = 0;

                  const zIndex = 100 - abs;

                  // drag only on the active card
                  const dragProps = isActive
                    ? {
                        drag: "x" as const,
                        dragConstraints: { left: 0, right: 0 },
                        dragElastic: 0.2,
                        dragSnapToOrigin: true,
                        onDragEnd: (
                          _e: MouseEvent | TouchEvent | PointerEvent,
                          info: { offset: { x: number }; velocity: { x: number } },
                        ) => {
                          if (reduceMotion) return;
                          const travel = info.offset.x;
                          const v = info.velocity.x;
                          const threshold = Math.min(50, cardWidth * 0.15);

                          // swipe logic
                          if (travel > threshold || v > 200) prev();
                          else if (travel < -threshold || v < -200) next();
                        },
                      }
                    : {};

                  return (
                    <motion.div
                      key={item.id}
                      className={cn(
                        "absolute !rounded-2xl sm:!rounded-3xl border-2 border-white/95 shadow-2xl kagada-paper-card",
                        "select-none p-4 sm:p-7 md:p-8 flex flex-col overflow-hidden transform-gpu",
                        isActive
                          ? "cursor-grab active:cursor-grabbing ring-1 ring-white/80 shadow-black/20"
                          : "cursor-pointer opacity-90 shadow-black/10 hover:opacity-100",
                      )}
                      style={{
                        width: `min(92vw, ${cardWidth}px)`,
                        height: isMobile ? `${effectiveCardHeight}px` : `min(90vh, ${effectiveCardHeight}px)`,
                        zIndex,
                        transformStyle: "preserve-3d",
                      }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 25,
                          x,
                          rotateZ: 0,
                          rotateX: 0,
                          rotateY,
                          scale: inactiveScale,
                        }
                  }
                  animate={{
                    // Cards in this fan physically overlap during a transition,
                    // so inactive cards must stay opaque enough to occlude the
                    // ones behind them. Lowering this (0.55 was tried) makes the
                    // stack translucent mid-advance and renders text over text.
                    opacity: isActive ? 1 : 0.9,
                    x,
                    y: y + lift,
                    rotateZ: 0,
                    rotateX: 0,
                    rotateY,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                    mass: 0.6,
                  }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full overflow-y-auto sm:overflow-hidden custom-scrollbar"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Manual Left and Right Arrow Navigation Buttons */}
      {showArrows ? (
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-4 z-20">
          <button
            onClick={prev}
            className="p-2.5 sm:p-3 rounded-full kagada-paper-card border border-[#5A182B]/30 text-[#5A182B] hover:bg-white active:bg-white/80 transition-all duration-150 shadow-md shadow-black/10 cursor-pointer"
            aria-label="Previous Card"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={next}
            className="p-2.5 sm:p-3 rounded-full kagada-paper-card border border-[#5A182B]/30 text-[#5A182B] hover:bg-white active:bg-white/80 transition-all duration-150 shadow-md shadow-black/10 cursor-pointer"
            aria-label="Next Card"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      ) : null}

      {/* Dots navigation centered at bottom (Only if showDots is true) */}
      {showDots ? (
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full kagada-paper-card border border-[#5A182B]/30 shadow-md shadow-black/10">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                    on
                      ? "w-6 bg-[#5A182B]"
                      : "w-2.5 bg-[#5A182B]/30 hover:bg-[#5A182B]/60",
                  )}
                  aria-label={`Go to card ${idx + 1}`}
                />
              );
            })}
          </div>
          {activeItem.href ? (
            <Link
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full kagada-paper-card border border-[#5A182B]/30 text-[#5A182B] hover:bg-white active:bg-white/80 transition-colors shadow-md shadow-black/10"
              aria-label="Open link"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl kagada-paper-card border-2 border-white/95">
      {/* Clean empty card layout */}
      {item.imageSrc && (
        <img
          src={item.imageSrc}
          alt={item.title || "Card"}
          className="h-full w-full object-cover"
          draggable={false}
          loading="eager"
          decoding="async"
        />
      )}
    </div>
  );
}
