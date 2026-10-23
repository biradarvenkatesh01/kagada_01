import * as React from 'react'
import { Marquee } from '@/components/ui/marquee'
import { cn } from '@/lib/utils'

interface SponsorItem {
  id: number
  src: string
  alt: string
  /** Intrinsic size of the optimized logo, reserved up front to avoid layout shift. */
  width: number
  height: number
  /** Official site; sponsors without a confirmed one render as a plain card. */
  url?: string
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

// KAGADA 2026 sponsors — transparent logos live in /public/optimized/sponsors
const SPONSORS_BASE_1: SponsorItem[] = [
  { id: 1, src: "/optimized/sponsors/ieee-bangalore-section.webp", alt: "IEEE Bangalore Section", width: 640, height: 134, url: "https://ieeebangalore.org/" },
  { id: 2, src: "/optimized/sponsors/ieee-sight.webp", alt: "IEEE SIGHT – Special Interest Group on Humanitarian Technology", width: 564, height: 220, url: "https://sight.ieee.org/" },
  { id: 3, src: "/optimized/sponsors/insights-ias.webp", alt: "InsightsIAS", width: 640, height: 162, url: "https://www.insightsonindia.com/" },
  { id: 4, src: "/optimized/sponsors/ieee-cs-bangalore.webp", alt: "IEEE Computer Society Bangalore Chapter", width: 499, height: 220, url: "https://cs.ieeebangalore.org/" },
];

const SPONSORS_BASE_2: SponsorItem[] = [
  { id: 5, src: "/optimized/sponsors/vtpc-karnataka.webp", alt: "VTPC Karnataka – Visvesvaraya Trade Promotion Centre", width: 587, height: 220 },
  { id: 6, src: "/optimized/sponsors/ieee-cybersecurity-stc.webp", alt: "IEEE Cybersecurity STC", width: 397, height: 172 },
  { id: 7, src: "/optimized/sponsors/ieee-wie-bangalore.webp", alt: "IEEE Women in Engineering Bangalore Section", width: 184, height: 185, url: "https://wie.ieeebangalore.org/" },
  { id: 8, src: "/optimized/sponsors/olemiq.webp", alt: "OLEMIQ", width: 286, height: 220, url: "https://olemiq.com/" },
];

// Replicated so each marquee block spans wider than 4K screens for seamless,
// gap-free looping. Copies beyond the first are hidden below 640px, where a
// single copy is already ~3x the viewport width (see globals.css).
const SPONSORS_ROW_1: MarqueeSponsor[] = replicate(SPONSORS_BASE_1, SPONSOR_COPIES);
const SPONSORS_ROW_2: MarqueeSponsor[] = replicate(SPONSORS_BASE_2, SPONSOR_COPIES);

const cardClassName = cn(
  "relative shrink-0 overflow-hidden group p-3.5 sm:p-6 flex items-center justify-center text-center rounded-3xl",
  "kagada-paper-card border-2 border-white/95 shadow-md shadow-black/15",
  "transition-glass duration-500 hover:shadow-xl hover:border-white",
  "w-[210px] min-[360px]:w-[260px] sm:w-[320px] h-[100px] sm:h-[135px]"
)

function SponsorCard({ item }: { item: MarqueeSponsor }) {
  const logo = (
    <img
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="max-h-full max-w-full w-auto h-auto object-contain select-none drop-shadow-sm transition-transform duration-500 group-hover:scale-[1.04]"
    />
  )

  // Repeated copies are decorative duplicates: keep them out of the tab order
  // and the accessibility tree so each sponsor is announced once.
  const hidden = item.copy > 0

  return item.url ? (
    <a
      data-marquee-copy={item.copy}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={cn(cardClassName, "cursor-pointer")}
    >
      {logo}
    </a>
  ) : (
    <div data-marquee-copy={item.copy} aria-hidden={hidden || undefined} className={cardClassName}>
      {logo}
    </div>
  )
}

export function SponsorsSection() {
  return (
    <section id="sponsors" className="relative w-full flex flex-col items-center select-none py-8 sm:py-12 scroll-mt-6 z-10">
      {/* Main Section Title */}
      <div>
        <h2 data-reveal className="font-saman text-[#D8D3C7] text-5xl sm:text-7xl md:text-8xl tshadow-lg tracking-tight text-center select-none leading-tight mb-1.5 sm:mb-2">
          Our <span className="text-amber-400 tshadow-md">Sponsors</span>
        </h2>
      </div>

      {/* Subtitle */}
      <div>
        <p data-reveal className="font-roboto-mono text-xs sm:text-sm font-semibold text-[#D8D3C7]/90 uppercase tracking-widest text-center tshadow-sm mb-4 sm:mb-6 max-w-2xl">
          Honoring the partners and organizations supporting KAGADA’s legacy.
        </p>
      </div>

      {/* Sponsor Image Marquee Loop Row 1 */}
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        <Marquee speed={48} mobileSpeed={48 / SPONSOR_COPIES} pauseOnHover={false} direction="left">
          {SPONSORS_ROW_1.map((item, idx) => (
            <SponsorCard key={`sponsor-r1-${item.id}-${idx}`} item={item} />
          ))}
        </Marquee>

        {/* Sponsor Image Marquee Loop Row 2 */}
        <Marquee speed={52} mobileSpeed={52 / SPONSOR_COPIES} pauseOnHover={false} direction="right">
          {SPONSORS_ROW_2.map((item, idx) => (
            <SponsorCard key={`sponsor-r2-${item.id}-${idx}`} item={item} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default SponsorsSection;
