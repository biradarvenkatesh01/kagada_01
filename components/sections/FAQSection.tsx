'use client'

import * as React from 'react'
import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      "KAGADA has 3 tracks in it viz., Paper Presentation, Poster Presentation and Project Presentation. You can choose any of these tracks.",
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
      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-saman text-white text-5xl sm:text-7xl md:text-8xl drop-shadow-lg tracking-tight text-center select-none leading-tight mb-4"
      >
        Frequently Asked <span className="text-white">Questions</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="font-roboto-mono text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest text-center drop-shadow-sm mb-10 sm:mb-14 max-w-2xl"
      >
        Everything you need to know about KAGADA conference, tracks, and events.
      </motion.p>

      {/* Glassmorphic FAQ Accordion Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full flex flex-col gap-4 sm:gap-5"
      >
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx

          return (
            <div
              key={`faq-${idx}`}
              onClick={() => toggleAccordion(idx)}
              className={cn(
                "relative overflow-hidden cursor-pointer rounded-3xl p-5 sm:p-6 border-2 transition-all duration-500 transform-gpu",
                "bg-white/30 backdrop-blur-2xl border-white/80 shadow-2xl shadow-black/30",
                "hover:bg-white/45 hover:border-white",
                isOpen && "bg-white/40 border-white shadow-black/40"
              )}
            >
              {/* Glass Reflective Interior Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-3xl" />

              {/* Accordion Header Row */}
              <div className="relative z-10 flex items-center justify-between gap-4">
                <h3 className="font-outfit font-extrabold text-lg sm:text-xl text-white tracking-wide leading-snug drop-shadow-sm text-left">
                  {faq.question}
                </h3>
                <div
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 rounded-full shrink-0 flex items-center justify-center",
                    "bg-white/30 backdrop-blur-xl border border-white/80 text-white shadow-md transition-transform duration-300",
                    isOpen && "rotate-180 bg-white/50 border-white"
                  )}
                >
                  <ChevronDown className="w-5 h-5 stroke-[2.5]" />
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
                  >
                    <div className="pt-4 sm:pt-5 border-t border-white/40 mt-4 sm:mt-5 text-left">
                      <p className="font-jakarta text-sm sm:text-base font-medium text-white/95 leading-relaxed drop-shadow-sm whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </motion.div>
    </section>
  )
});

export default FAQSection;
