'use client'

import * as React from 'react'
import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

interface FAQItem {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: "What is KAGADA and when is it?",
    answer:
      "KAGADA is an Annual National-Level Technical Student Conference conducted by IEEE UVCE. It will be held on 10th October, 2026.",
  },
  {
    question: "What can I present in KAGADA?",
    answer:
      "KAGADA has 3 tracks: Paper Presentation, Poster Presentation and Project Presentation. You can choose any of these tracks.",
  },
  {
    question: "Why should I participate in KAGADA 2026?",
    answer:
      "As KAGADA is a national level technical student conference, one gets a national level platform to exhibit their innovative ideas and thoughts. This also provides an opportunity to showcase their presentation skills.",
  },
  {
    question: "What is the domain for presentation?",
    answer:
      "There is no specific domain for presentation but the sole purpose is to come up with ideas for the betterment of society.",
  },
  {
    question: "Where will KAGADA 2026 take place?",
    answer: "KAGADA 2026 will take place at UVCE, KR Circle.",
  },
  {
    question: "Can one participate in more than one track?",
    answer: "Yes, participants can take part in more than one track.",
  },
  {
    question: "What all events are there in KAGADA 2026?",
    answer: `KAGADA consists of two category events.\n\nThe Presentation tracks:\n• Paper Presentation\n• Poster Presentation\n• Project Presentation\n\nHumanitarian activities:\n• Ottige Kaliyona\n• Food for Cause`,
  },
]

export const FAQSection = memo(function FAQSection() {
  // All FAQs closed initially
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none px-4 py-6 sm:py-10 scroll-mt-6 z-10">
      {/* Main Section Title */}
      <ScrollReveal direction="up" duration={500}>
        <h2 className="font-saman text-white text-5xl sm:text-7xl md:text-8xl drop-shadow-lg tracking-tight text-center select-none leading-tight mb-4">
          Frequently Asked <span className="text-amber-400 drop-shadow-md">Questions</span>
        </h2>
      </ScrollReveal>

      {/* Subtitle */}
      <ScrollReveal direction="up" delay={60} duration={500}>
        <p className="font-roboto-mono text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest text-center drop-shadow-sm mb-10 sm:mb-14 max-w-2xl">
          Everything you need to know about KAGADA conference, tracks, and events.
        </p>
      </ScrollReveal>

      {/* Glassmorphic FAQ Accordion Container */}
      <ScrollReveal direction="up" delay={100} duration={500} className="w-full">
        <div className="w-full flex flex-col gap-2.5 sm:gap-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx

          return (
            <div
              key={`faq-${idx}`}
              onClick={() => toggleAccordion(idx)}
              // Keyboard/AT access for what is visually a button. Kept as a div
              // with ARIA rather than a <button> so the existing styling, which
              // relies on block layout, is untouched.
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${idx}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleAccordion(idx)
                }
              }}
              className={cn(
                "relative overflow-hidden cursor-pointer rounded-2xl py-3 px-4 sm:py-3.5 sm:px-5 border-2 transition-all duration-300",
                "bg-white/30 backdrop-blur-2xl border-white/80 shadow-lg shadow-black/20",
                "hover:bg-white/45 hover:border-white",
                isOpen && "bg-white/40 border-white shadow-black/30"
              )}
            >
              {/* Glass Reflective Interior Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-2xl" />

              {/* Accordion Header Row */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <h3 className="font-outfit font-bold text-base sm:text-lg text-white tracking-wide leading-snug drop-shadow-sm text-left">
                  {faq.question}
                </h3>
                <div
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full shrink-0 flex items-center justify-center",
                    "bg-white/30 backdrop-blur-xl border border-white/80 text-white shadow-sm transition-transform duration-300",
                    isOpen && "rotate-180 bg-white/50 border-white"
                  )}
                >
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>

              {/* Accordion Body Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 overflow-hidden"
                    id={`faq-panel-${idx}`}
                    role="region"
                  >
                    <div className="pt-3 sm:pt-3.5 border-t border-white/40 mt-3 sm:mt-3.5 text-left">
                      <p className="font-jakarta text-xs sm:text-sm md:text-base font-medium text-white/95 leading-relaxed drop-shadow-sm whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        </div>
      </ScrollReveal>
    </section>
  )
});

export default FAQSection;
