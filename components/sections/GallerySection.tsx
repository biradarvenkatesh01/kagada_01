import * as React from 'react'
import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

interface GalleryItem {
  id: number
  src: string        // Single optimized WebP asset (deduplicated across sections)
  shape: string      // Aspect-ratio matched CSS dimensions
}

interface MarqueeItem extends GalleryItem {
  /** Which replication of the base set this card belongs to (see globals.css). */
  copy: number
}

/**
 * Repeat a base set `copies` times, tagging each card with its copy index so the
 * redundant copies can be dropped on small viewports without changing the
 * visible sequence.
 */
function replicate(base: GalleryItem[], copies: number): MarqueeItem[] {
  return Array.from({ length: copies }, (_, copy) =>
    base.map((item) => ({ ...item, copy }))
  ).flat()
}

// Base photo sets tailored to their natural aspect ratios with deduplicated WebP assets
const ROW_1_BASE: GalleryItem[] = [
  { id: 1, src: "/optimized/gallery/1-1.webp", shape: "w-[260px] min-[380px]:w-[310px] sm:w-[390px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
  { id: 2, src: "/optimized/tracks/paper.webp", shape: "w-[270px] min-[380px]:w-[330px] sm:w-[420px] h-[160px] min-[380px]:h-[190px] sm:h-[230px]" },
  { id: 3, src: "/optimized/tracks/ottigekaliona.webp", shape: "w-[270px] min-[380px]:w-[325px] sm:w-[410px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
  { id: 4, src: "/optimized/gallery/1-3.webp", shape: "w-[280px] min-[380px]:w-[340px] sm:w-[430px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
  { id: 5, src: "/optimized/gallery/1-4.webp", shape: "w-[260px] min-[380px]:w-[310px] sm:w-[380px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
]

const ROW_2_BASE: GalleryItem[] = [
  { id: 6, src: "/optimized/gallery/1-5.webp", shape: "w-[270px] min-[380px]:w-[320px] sm:w-[400px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
  { id: 7, src: "/optimized/tracks/poster.webp", shape: "w-[190px] min-[380px]:w-[230px] sm:w-[280px] h-[170px] min-[380px]:h-[200px] sm:h-[250px]" },
  { id: 8, src: "/optimized/gallery/1-6.webp", shape: "w-[280px] min-[380px]:w-[340px] sm:w-[430px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
  { id: 9, src: "/optimized/tracks/foodforcause.webp", shape: "w-[270px] min-[380px]:w-[330px] sm:w-[410px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
  { id: 10, src: "/optimized/gallery/1-7.webp", shape: "w-[270px] min-[380px]:w-[320px] sm:w-[400px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
  { id: 11, src: "/optimized/tracks/project.webp", shape: "w-[270px] min-[380px]:w-[330px] sm:w-[410px] h-[165px] min-[380px]:h-[195px] sm:h-[240px]" },
]

// Replicated to guarantee seamless, continuous looping without blanks on screens
// up to 4K. Copies beyond the first are hidden below 640px (see globals.css).
const row1Items: MarqueeItem[] = replicate(ROW_1_BASE, 2);
const row2Items: MarqueeItem[] = replicate(ROW_2_BASE, 2);
const MARQUEE_COPIES = 2;

function MarqueeRow({
  items,
  direction = 'left',
  speed = 50,
}: {
  items: MarqueeItem[]
  direction?: 'left' | 'right'
  speed?: number
}) {
  return (
    <div className="flex w-full overflow-hidden py-3 sm:py-4 select-none">
      <div
        className={cn(
          "flex w-max transform-gpu will-change-transform",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse"
        )}
        style={{
          "--duration": `${speed}s`,
          // Mobile hides all but one copy, so the block travels 1/N the distance;
          // scaling the duration by the same N keeps px/sec identical.
          "--duration-mobile": `${speed / MARQUEE_COPIES}s`,
        } as React.CSSProperties}
      >
        {/* Block 1: Exactly 50% width */}
        <div className="flex items-center gap-5 sm:gap-8 pr-5 sm:pr-8 shrink-0">
          {items.map((item, idx) => (
            <div
              key={`b1-${item.id}-${idx}`}
              data-marquee-copy={item.copy}
              className={cn(
                "relative shrink-0 overflow-hidden group rounded-3xl",
                "kagada-paper-card border-2 border-white/95 shadow-md shadow-black/15",
                "transition-glass duration-500 hover:shadow-xl hover:border-white",
                item.shape
              )}
            >
              <img
                src={item.src}
                alt="Kagada Event Photo"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Block 2: Identical 50% Duplicate for 100% Seamless GPU Looping */}
        <div className="flex items-center gap-5 sm:gap-8 pr-5 sm:pr-8 shrink-0">
          {items.map((item, idx) => (
            <div
              key={`b2-${item.id}-${idx}`}
              data-marquee-copy={item.copy}
              className={cn(
                "relative shrink-0 overflow-hidden group rounded-3xl",
                "kagada-paper-card border-2 border-white/95 shadow-md shadow-black/15",
                "transition-glass duration-500 hover:shadow-xl hover:border-white",
                item.shape
              )}
            >
              <img
                src={item.src}
                alt="Kagada Event Photo"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function GallerySection() {
  return (
    <section id="gallery" className="relative w-full overflow-hidden py-4 sm:py-8 flex flex-col gap-6 sm:gap-10 select-none min-h-[480px] scroll-mt-6 z-10">
      {/* Section Title */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <ScrollReveal direction="down" duration={500}>
          <h2 className="font-saman text-5xl sm:text-7xl md:text-8xl text-[#E8E5DC] tshadow-lg mb-3 sm:mb-4 tracking-tight text-center select-none">
            Event <span className="text-amber-400 tshadow-md">Gallery</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={60} duration={500}>
          <p className="font-roboto-mono text-xs sm:text-sm font-semibold text-[#E8E5DC]/90 uppercase tracking-widest text-center tshadow-sm mb-6 sm:mb-10 max-w-2xl">
            Capturing unforgettable moments across KAGADA editions.
          </p>
        </ScrollReveal>
      </div>

      {/* ROW 1: Moves Continuously to the RIGHT at smooth speed */}
      <MarqueeRow items={row1Items} direction="right" speed={64} />

      {/* ROW 2: Moves Continuously to the LEFT at smooth speed */}
      <MarqueeRow items={row2Items} direction="left" speed={56} />
    </section>
  )
}

export default GallerySection;
