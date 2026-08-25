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

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Set 0 for straight horizontal alignment */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

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

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 3,

  cardWidth = 960,
  cardHeight = 640,

  overlap = 0.45,
  spreadDeg = 0,

  perspectivePx = 1400,
  depthPx = 200,
  tiltXDeg = 0,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.88,

  springStiffness = 120, // Ultra-smooth spring physics for fluid motion
  springDamping = 22, // Smooth liquid damping

  loop = true,
  autoAdvance = true,
  intervalMs = 6000, // 6 seconds auto cycle
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
  const [hovering, setHovering] = React.useState(false);

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

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

  // 6-second auto cycle
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
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
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      className={cn("w-full flex flex-col items-center justify-center", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full flex items-center justify-center transition-all duration-500"
        style={{ height: Math.max(760, cardHeight + 100) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* background wash / spotlight */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-56 w-[75%] rounded-full bg-[#8a1c1c]/10 blur-3xl"
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

              // 3D Ultra-Smooth Circular Ring Orbit Geometry
              const radiusAngle = (off / maxOffset) * (Math.PI / 3.4);
              const x = Math.sin(radiusAngle) * (cardSpacing * 1.35);
              const z = (Math.cos(radiusAngle) - 1) * depthPx * 1.8;
              const rotateY = off * -7;
              const rotateZ = 0;
              const rotateX = 0;
              const y = 0;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;

              const zIndex = 100 - abs;

              // drag only on the active card
              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.2,
                    onDragEnd: (
                      _e: any,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, cardWidth * 0.22);

                      // swipe logic
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute rounded-3xl border-2 border-white shadow-2xl backdrop-blur-2xl bg-white/50",
                    "select-none p-6 sm:p-10 flex flex-col justify-between overflow-hidden transform-gpu",
                    isActive
                      ? "cursor-grab active:cursor-grabbing ring-1 ring-white/80 shadow-black/20"
                      : "cursor-pointer opacity-90 shadow-black/10 hover:opacity-100",
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                    willChange: "transform, opacity",
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
                    mass: 0.8,
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
            className="p-2.5 sm:p-3 rounded-full bg-white/40 backdrop-blur-md border border-white text-[#8a1c1c] hover:bg-white/70 hover:scale-110 active:scale-95 transition-all shadow-md shadow-black/5"
            aria-label="Previous Card"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={next}
            className="p-2.5 sm:p-3 rounded-full bg-white/40 backdrop-blur-md border border-white text-[#8a1c1c] hover:bg-white/70 hover:scale-110 active:scale-95 transition-all shadow-md shadow-black/5"
            aria-label="Next Card"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      ) : null}

      {/* Dots navigation centered at bottom (Only if showDots is true) */}
      {showDots ? (
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/60 shadow-md">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    on
                      ? "w-6 bg-[#8a1c1c]"
                      : "w-2.5 bg-[#8a1c1c]/30 hover:bg-[#8a1c1c]/60",
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
              className="p-2 rounded-full bg-white/30 backdrop-blur-md border border-white/60 text-[#8a1c1c] hover:bg-white/50 transition shadow-md"
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
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white/20 backdrop-blur-md border border-white/50">
      {/* Clean empty card layout */}
      {item.imageSrc && (
        <img
          src={item.imageSrc}
          alt={item.title || "Card"}
          className="h-full w-full object-cover"
          draggable={false}
          loading="eager"
        />
      )}
    </div>
  );
}
