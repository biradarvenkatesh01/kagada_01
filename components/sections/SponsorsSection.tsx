import * as React from 'react'
import { Marquee } from '@/components/ui/marquee'
import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

interface SponsorItem {
  id: number
  src: string
  alt: string
  url: string
  invertWhite?: boolean
}

interface MarqueeSponsor extends SponsorItem {
  /** Which replication of the base set this card belongs to (see globals.css). */
  copy: number
}

/** How many times each base set is repeated inside one marquee block. */
const SPONSOR_COPIES = 3

function replicate(base: SponsorItem[], copies: number): MarqueeSponsor[] {
  return Array.from({ length: copies }, (_, copy) =>
    base.map((item) => ({ ...item, copy }))
  ).flat()
}

// Real Kagada Sponsor Image Assets & Official External Links
const SPONSORS_BASE_1: SponsorItem[] = [
  { id: 1, src: "/optimized/sponsors/spo1.webp", alt: "IEEE Bangalore Section", url: "https://ieeebangalore.org" },
  { id: 2, src: "/optimized/sponsors/spo2.webp", alt: "IEEE Cybersecurity STC", url: "https://cybersecurity.ieee.org" },
  { id: 3, src: "/optimized/sponsors/spo3.webp", alt: "BLUMM", url: "https://blumm.in" },
  { id: 4, src: "/optimized/sponsors/spo4.webp", alt: "IEEE SIGHT", url: "https://sight.ieee.org" },
];

const SPONSORS_BASE_2: SponsorItem[] = [
  { id: 5, src: "/optimized/sponsors/spo5.webp", alt: "InsightsIAS", url: "https://www.insightsonindia.com" },
  { id: 6, src: "/optimized/sponsors/spo6.webp", alt: "IEEE Foundation", url: "https://www.ieeefoundation.org" },
  { id: 7, src: "/optimized/sponsors/spon5.webp", alt: "Kagada Sponsor", url: "https://ieeeuvce.org" },
  { id: 8, src: "/optimized/sponsors/spo1.webp", alt: "IEEE Bangalore Section", url: "https://ieeebangalore.org" },
];

// Replicated to 12 items to ensure seamless, gap-free infinite looping on all
// screen widths up to 4K. Copies beyond the first are hidden below 640px, where
// a single copy is already ~3x the viewport width (see globals.css).
const SPONSORS_ROW_1: MarqueeSponsor[] = replicate(SPONSORS_BASE_1, SPONSOR_COPIES);
const SPONSORS_ROW_2: MarqueeSponsor[] = replicate(SPONSORS_BASE_2, SPONSOR_COPIES);

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative w-full flex flex-col items-center select-none py-6 sm:py-10 scroll-mt-6 z-10">
      {/* Main Section Title */}
      <ScrollReveal direction="up" duration={500}>
        <h2 className="font-saman text-[#D8D3C7] text-5xl sm:text-7xl md:text-8xl tshadow-lg tracking-tight text-center select-none leading-tight mb-4">
          Our <span className="text-amber-400 tshadow-md">Sponsors</span>
        </h2>
      </ScrollReveal>

      {/* Subtitle */}
      <ScrollReveal direction="up" delay={60} duration={500}>
        <p className="font-roboto-mono text-xs sm:text-sm font-semibold text-[#D8D3C7]/90 uppercase tracking-widest text-center tshadow-sm mb-8 sm:mb-12 max-w-2xl">
          Honoring the partners and organizations supporting KAGADA’s legacy.
        </p>
      </ScrollReveal>

      {/* Sponsor Image Marquee Loop Row 1 */}
      <div className="w-full flex flex-col gap-6 sm:gap-10">
        <Marquee speed={48} mobileSpeed={48 / SPONSOR_COPIES} pauseOnHover={false} direction="left">
          {SPONSORS_ROW_1.map((item, idx) => (
            <a
              key={`sponsor-r1-${item.id}-${idx}`}
              data-marquee-copy={item.copy}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative shrink-0 overflow-hidden cursor-pointer group p-3.5 sm:p-6 flex items-center justify-center text-center rounded-3xl",
                "kagada-paper-card border-2 border-white/95 shadow-md shadow-black/15",
                "transition-glass duration-500 hover:shadow-xl hover:border-white",
                "min-w-[210px] min-[360px]:min-w-[260px] sm:min-w-[320px] h-[100px] sm:h-[135px]"
              )}
            >
              {/* Perfectly Centered Prominent Sponsor Logo Image */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="max-h-20 sm:max-h-24 max-w-[85%] w-auto h-auto object-contain mx-auto my-auto select-none drop-shadow-sm"
              />
            </a>
          ))}
        </Marquee>

        {/* Sponsor Image Marquee Loop Row 2 */}
        <Marquee speed={52} mobileSpeed={52 / SPONSOR_COPIES} pauseOnHover={false} direction="right">
          {SPONSORS_ROW_2.map((item, idx) => (
            <a
              key={`sponsor-r2-${item.id}-${idx}`}
              data-marquee-copy={item.copy}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative shrink-0 overflow-hidden cursor-pointer group p-3.5 sm:p-6 flex items-center justify-center text-center rounded-3xl",
                "kagada-paper-card border-2 border-white/95 shadow-md shadow-black/15",
                "transition-glass duration-500 hover:shadow-xl hover:border-white",
                "min-w-[210px] min-[360px]:min-w-[260px] sm:min-w-[320px] h-[100px] sm:h-[135px]"
              )}
            >
              {/* Perfectly Centered Prominent Sponsor Logo Image */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="max-h-20 sm:max-h-24 max-w-[85%] w-auto h-auto object-contain mx-auto my-auto select-none drop-shadow-sm"
              />
            </a>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default SponsorsSection;
