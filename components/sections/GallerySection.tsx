'use client'

import * as React from 'react'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GalleryItem {
  id: number
  src: string
  shape: string // Aspect-ratio matched CSS dimensions
}

// Row 1: 5 distinct Kagada event photos tailored to their natural aspect ratio
const row1Items: GalleryItem[] = [
  { id: 1, src: "/1 (1).jpg", shape: "w-[300px] sm:w-[390px] h-[190px] sm:h-[240px]" },
  { id: 2, src: "/paper.png", shape: "w-[320px] sm:w-[420px] h-[180px] sm:h-[230px]" },
  { id: 3, src: "/ottigekaliona.jpg", shape: "w-[320px] sm:w-[410px] h-[190px] sm:h-[240px]" },
  { id: 4, src: "/1 (3).JPG", shape: "w-[320px] sm:w-[430px] h-[190px] sm:h-[240px]" },
  { id: 5, src: "/1 (4).JPG", shape: "w-[300px] sm:w-[380px] h-[190px] sm:h-[240px]" },
]

// Row 2: 6 distinct Kagada event photos tailored to their natural aspect ratio
const row2Items: GalleryItem[] = [
  { id: 6, src: "/1 (5).JPG", shape: "w-[310px] sm:w-[400px] h-[190px] sm:h-[240px]" },
  { id: 7, src: "/poster.jpg", shape: "w-[220px] sm:w-[280px] h-[200px] sm:h-[250px]" },
  { id: 8, src: "/1 (6).JPG", shape: "w-[330px] sm:w-[430px] h-[190px] sm:h-[240px]" },
  { id: 9, src: "/FoodForCause.JPG", shape: "w-[320px] sm:w-[410px] h-[190px] sm:h-[240px]" },
  { id: 10, src: "/1 (7).JPG", shape: "w-[310px] sm:w-[400px] h-[190px] sm:h-[240px]" },
  { id: 11, src: "/project.jpg", shape: "w-[320px] sm:w-[410px] h-[190px] sm:h-[240px]" },
]

function MarqueeRow({
  items,
  direction = 'left',
  speed = 30,
}: {
  items: GalleryItem[]
  direction?: 'left' | 'right'
  speed?: number
}) {
  return (
    <div className="flex w-full overflow-hidden py-2 select-none">
      <div
        className={cn(
          "flex w-max transform-gpu will-change-transform hover:[animation-play-state:paused]",
          direction === "left" ? "animate-marquee" : "animate-marquee-reverse"
        )}
        style={{ "--duration": `${speed}s` } as React.CSSProperties}
      >
        {/* Block 1: Exactly 50% width */}
        <div className="flex items-center gap-5 sm:gap-8 pr-5 sm:pr-8 shrink-0">
          {items.map((item, idx) => (
            <div
              key={`b1-${item.id}-${idx}`}
              className={cn(
                "relative shrink-0 overflow-hidden cursor-zoom-in group rounded-3xl",
                "bg-white/25 backdrop-blur-sm border-2 border-white/90 shadow-md shadow-black/10",
                "transition-all duration-500 transform-gpu hover:scale-[1.03] hover:bg-white/45 hover:border-white",
                item.shape
              )}
            >
              <img
                src={item.src}
                alt="Kagada Event Photo"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform-gpu transition-transform duration-500 group-hover:scale-105 select-none cursor-zoom-in pointer-events-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/30 pointer-events-none rounded-3xl" />
            </div>
          ))}
        </div>

        {/* Block 2: Identical 50% Duplicate for 100% Seamless GPU Looping */}
        <div className="flex items-center gap-5 sm:gap-8 pr-5 sm:pr-8 shrink-0">
          {items.map((item, idx) => (
            <div
              key={`b2-${item.id}-${idx}`}
              className={cn(
                "relative shrink-0 overflow-hidden cursor-zoom-in group rounded-3xl",
                "bg-white/25 backdrop-blur-sm border-2 border-white/90 shadow-md shadow-black/10",
                "transition-all duration-500 transform-gpu hover:scale-[1.03] hover:bg-white/45 hover:border-white",
                item.shape
              )}
            >
              <img
                src={item.src}
                alt="Kagada Event Photo"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transform-gpu transition-transform duration-500 group-hover:scale-105 select-none cursor-zoom-in pointer-events-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/30 pointer-events-none rounded-3xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const GallerySection = memo(function GallerySection() {
  return (
    <section id="gallery" className="relative w-full overflow-hidden py-4 sm:py-8 flex flex-col gap-6 sm:gap-10 select-none min-h-[480px] scroll-mt-6 z-10 cv-auto">
      {/* Section Title */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-saman text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-lg mb-3 sm:mb-4 tracking-tight text-center select-none"
        >
          Event <span className="text-amber-400 drop-shadow-md">Gallery</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-roboto-mono text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest text-center drop-shadow-sm mb-6 sm:mb-10 max-w-2xl"
        >
          Capturing unforgettable moments across KAGADA editions.
        </motion.p>
      </div>

      {/* ROW 1: Moves Continuously to the RIGHT at smooth speed */}
      <MarqueeRow items={row1Items} direction="right" speed={32} />

      {/* ROW 2: Moves Continuously to the LEFT at smooth speed */}
      <MarqueeRow items={row2Items} direction="left" speed={28} />
    </section>
  )
});

export default GallerySection;
