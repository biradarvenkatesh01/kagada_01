'use client'

import * as React from 'react'
import { memo } from 'react'
import { motion } from 'framer-motion'
import { Marquee } from '@/components/ui/marquee'
import { cn } from '@/lib/utils'

interface SponsorItem {
  id: number
  src: string
  alt: string
  url: string
  invertWhite?: boolean
}

// Real Kagada Sponsor Image Assets & Official External Links
const SPONSORS_ROW_1: SponsorItem[] = [
  { id: 1, src: "/spo1.png", alt: "IEEE Bangalore Section", url: "https://ieeebangalore.org", invertWhite: true },
  { id: 2, src: "/spo2.png", alt: "IEEE Cybersecurity STC", url: "https://cybersecurity.ieee.org" },
  { id: 3, src: "/spo3.png", alt: "BLUMM", url: "https://blumm.in" },
  { id: 4, src: "/spo4.png", alt: "IEEE SIGHT", url: "https://sight.ieee.org" },
]

const SPONSORS_ROW_2: SponsorItem[] = [
  { id: 5, src: "/spo5.png", alt: "InsightsIAS", url: "https://www.insightsonindia.com" },
  { id: 6, src: "/spo6.png", alt: "IEEE Foundation", url: "https://www.ieeefoundation.org" },
  { id: 7, src: "/spon5.png", alt: "Kagada Sponsor", url: "https://ieeeuvce.org" },
  { id: 1, src: "/spo1.png", alt: "IEEE Bangalore Section", url: "https://ieeebangalore.org", invertWhite: true },
]

export const SponsorsSection = memo(function SponsorsSection() {
  return (
    <section id="sponsors" className="relative w-full flex flex-col items-center select-none py-6 sm:py-10 scroll-mt-6 z-10">
      {/* Main Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-saman text-white text-5xl sm:text-7xl md:text-8xl drop-shadow-lg tracking-tight text-center select-none leading-tight mb-4"
      >
        Our <span className="text-white">Sponsors</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="font-roboto-mono text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest text-center drop-shadow-sm mb-8 sm:mb-12 max-w-2xl"
      >
        Honoring the partners and organizations supporting KAGADA’s legacy.
      </motion.p>

      {/* Glassmorphic Sponsor Image Marquee Loop Row 1 */}
      <div className="w-full flex flex-col gap-6 sm:gap-10">
        <Marquee speed={18} pauseOnHover={true} direction="left">
          {SPONSORS_ROW_1.map((item, idx) => (
            <a
              key={`sponsor-r1-${item.id}-${idx}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative shrink-0 overflow-hidden cursor-pointer group p-4 sm:p-6 flex items-center justify-center text-center rounded-3xl",
                "bg-white/25 backdrop-blur-sm border-2 border-white/90 shadow-md shadow-black/10",
                "transition-all duration-500 transform-gpu hover:scale-105 hover:bg-white/45 hover:border-white",
                "min-w-[260px] sm:min-w-[320px] h-[120px] sm:h-[140px]"
              )}
            >
              {/* Perfectly Centered Prominent Sponsor Logo Image */}
              <img
                src={item.src}
                alt={item.alt}
                className={cn(
                  "max-h-20 sm:max-h-24 max-w-[85%] w-auto h-auto object-contain mx-auto my-auto select-none drop-shadow-md transform-gpu transition-transform duration-500 group-hover:scale-105",
                  item.invertWhite && "brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                )}
              />

              {/* Subtle Glass Interior Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-3xl" />
            </a>
          ))}
        </Marquee>

        {/* Glassmorphic Sponsor Image Marquee Loop Row 2 */}
        <Marquee speed={20} pauseOnHover={true} direction="right">
          {SPONSORS_ROW_2.map((item, idx) => (
            <a
              key={`sponsor-r2-${item.id}-${idx}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative shrink-0 overflow-hidden cursor-pointer group p-4 sm:p-6 flex items-center justify-center text-center rounded-3xl",
                "bg-white/25 backdrop-blur-sm border-2 border-white/90 shadow-md shadow-black/10",
                "transition-all duration-500 transform-gpu hover:scale-105 hover:bg-white/45 hover:border-white",
                "min-w-[260px] sm:min-w-[320px] h-[120px] sm:h-[140px]"
              )}
            >
              {/* Perfectly Centered Prominent Sponsor Logo Image */}
              <img
                src={item.src}
                alt={item.alt}
                className={cn(
                  "max-h-20 sm:max-h-24 max-w-[85%] w-auto h-auto object-contain mx-auto my-auto select-none drop-shadow-md transform-gpu transition-transform duration-500 group-hover:scale-105",
                  item.invertWhite && "brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                )}
              />

              {/* Subtle Glass Interior Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-3xl" />
            </a>
          ))}
        </Marquee>
      </div>
    </section>
  )
});

export default SponsorsSection;
