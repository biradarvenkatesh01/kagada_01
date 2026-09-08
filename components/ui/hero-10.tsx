'use client'

import * as React from 'react'
import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Balancer from 'react-wrap-balancer'
import { FileText, Image as ImageIcon, Cpu, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Cta, type CtaProps } from '@/components/ui/hero-10-utils/cta'

export interface Hero10Props {
  title?: string
  titleLine2Prefix?: string
  titleHighlight?: string
  description?: string
  socialProof?: string
  images?: string[]
  imageAlts?: string[]
  animation?: 'none' | 'subtle'
  primaryCTA?: CtaProps
  secondaryCTA?: CtaProps
  variant?: 'standard' | 'compact'
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function Reveal({
  active,
  variants,
  className,
  children,
}: Readonly<{
  active: boolean
  variants?: Variants
  className?: string
  children: React.ReactNode
}>) {
  if (!active) return <div className={className}>{children}</div>

  return (
    <motion.div variants={variants ?? item} className={className}>
      {children}
    </motion.div>
  )
}

function InteractiveCardFan() {
  const [activeCard, setActiveCard] = useState(0)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // 3 Winner Track Red-Tinted Glass Cards
  const cards = [
    {
      id: 0,
      title: "Paper Presentation",
      icon: FileText,
    },
    {
      id: 1,
      title: "Poster Presentation",
      icon: ImageIcon,
    },
    {
      id: 2,
      title: "Project Presentation",
      icon: Cpu,
    },
  ]

  const handleScroll = () => {
    if (!scrollContainerRef.current) return
    const containerEl = scrollContainerRef.current
    const firstChild = containerEl.firstElementChild as HTMLElement | null
    const cardWidth = firstChild?.getBoundingClientRect().width || 300
    const scrollPosition = containerEl.scrollLeft
    const index = Math.round(scrollPosition / (cardWidth + 16))
    if (index >= 0 && index < cards.length) {
      setActiveCard(index)
    }
  }

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return
    const containerEl = scrollContainerRef.current
    const firstChild = containerEl.firstElementChild as HTMLElement | null
    const cardWidth = firstChild?.getBoundingClientRect().width || 300
    containerEl.scrollTo({
      left: index * (cardWidth + 16),
      behavior: 'smooth',
    })
    setActiveCard(index)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-6xl my-4 sm:my-8 px-0 sm:px-4">
      {/* 3 Horizontal Cards Container: Grid in Laptop/Desktop View, Slidable Row in Mobile View */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full flex md:grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-4 py-4 md:px-0 md:py-0 select-none scrollbar-none"
      >
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={cn(
              "shrink-0 snap-center w-[85vw] max-w-[320px] md:w-full md:max-w-none h-[360px] sm:h-[400px] lg:h-[440px]",
              "rounded-3xl border-2 border-white/80 shadow-2xl backdrop-blur-xl bg-white/25",
              "p-5 sm:p-8 flex flex-col justify-between items-center overflow-hidden transform-gpu select-none cursor-pointer group",
              "hover:border-white hover:bg-white/35 transition-all duration-300"
            )}
          >
            {/* Subtle Glass Interior Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/20 pointer-events-none rounded-3xl" />

            {/* Card Header: Title Centered Horizontally */}
            <div className="flex items-center justify-center w-full z-10 text-center">
              <h3 className="font-smooch text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-wide drop-shadow-md text-center leading-tight">
                {card.title}
              </h3>
            </div>

            {/* Center Prominent Red Glass SVG Icon Badge */}
            <div className="flex-1 my-4 sm:my-6 flex items-center justify-center z-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full bg-white/30 backdrop-blur-xl border-2 border-white/80 text-white flex items-center justify-center shadow-2xl shadow-black/30 transform-gpu group-hover:scale-110 transition-transform duration-300">
                <card.icon className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 stroke-[1.8] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" />
              </div>
            </div>

            {/* Bottom CTA Red Glass Button */}
            <div className="w-full z-10">
              <button
                type="button"
                className="w-full py-3.5 px-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/80 text-white font-jakarta text-sm sm:text-base font-extrabold tracking-wide group-hover:bg-white/45 active:scale-[0.98] transition-all shadow-lg shadow-black/20 flex items-center justify-center gap-2 group/btn cursor-pointer"
              >
                <span>Explore Winners</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination Indicator Dots for Mobile View */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-4 z-20">
        {cards.map((card, i) => (
          <button
            key={`dot-${card.id}`}
            onClick={() => scrollToIndex(i)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
              activeCard === i
                ? "w-8 bg-white"
                : "w-2.5 bg-white/40 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export function Hero10({
  title,
  titleLine2Prefix,
  titleHighlight,
  description,
  socialProof,
  animation = 'none',
  primaryCTA,
  secondaryCTA,
}: Readonly<Hero10Props>) {
  const reduce = useReducedMotion()
  const animate = animation === 'subtle' && !reduce

  const titleElement = title && (
    <h1 className="text-white font-saman font-normal tracking-tight text-balance drop-shadow-lg text-3xl sm:text-4xl md:text-5xl">
      <Balancer>{title}</Balancer>
      {(titleLine2Prefix || titleHighlight) && (
        <>
          <br />
          <Balancer>
            {titleLine2Prefix && <span>{titleLine2Prefix} </span>}
            {titleHighlight && (
              <span className="text-white">{titleHighlight}</span>
            )}
          </Balancer>
        </>
      )}
    </h1>
  )

  const descriptionElement = description && (
    <p className="text-white/90 font-jakarta font-medium drop-shadow-sm max-w-lg text-sm sm:text-base">
      <Balancer>{description}</Balancer>
    </p>
  )

  const ctasElement = (primaryCTA?.ctaEnabled || secondaryCTA?.ctaEnabled) && (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
      {primaryCTA?.ctaEnabled && <Cta cta={primaryCTA} />}
      {secondaryCTA?.ctaEnabled && (
        <Cta
          cta={{ ...secondaryCTA, variant: secondaryCTA.variant ?? 'outline' }}
        />
      )}
    </div>
  )

  const socialProofElement = socialProof && (
    <p className="text-white/80 font-roboto-mono text-xs font-semibold uppercase tracking-wider drop-shadow-sm">{socialProof}</p>
  )

  return (
    <section className="relative isolate w-full overflow-hidden">
      <motion.div
        className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 sm:px-6 text-center py-4 sm:py-8"
        variants={animate ? container : undefined}
        initial={animate ? 'hidden' : false}
        whileInView={animate ? 'visible' : undefined}
        viewport={{ once: true, margin: '-80px' }}
      >
        {(titleElement || descriptionElement) && (
          <Reveal
            active={animate}
            className="flex w-full max-w-2xl flex-col items-center gap-4"
          >
            {titleElement}
            {descriptionElement}
          </Reveal>
        )}

        {(ctasElement || socialProofElement) && (
          <Reveal active={animate} className="flex flex-col items-center gap-4">
            {ctasElement}
            {socialProofElement}
          </Reveal>
        )}

        <div className="mx-auto w-full flex items-center justify-center">
          <InteractiveCardFan />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero10;
