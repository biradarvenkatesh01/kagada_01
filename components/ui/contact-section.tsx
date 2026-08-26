'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactOrganizer {
  name: string
  designation: string
  phone: string
  phoneLink: string
  email: string
  emailLink: string
}

const ORGANIZERS: ContactOrganizer[] = [
  {
    name: "Jyothika V",
    designation: "Chairperson, IEEE UVCE",
    phone: "+91 97318 64358",
    phoneLink: "tel:+919731864358",
    email: "jyothikav@ieee.org",
    emailLink: "mailto:jyothikav@ieee.org",
  },
  {
    name: "Hegde Punith Ramesh",
    designation: "Vice Chairperson, IEEE UVCE",
    phone: "+91 72041 20818",
    phoneLink: "tel:+917204120818",
    email: "hegdepunithramesh@ieee.org",
    emailLink: "mailto:hegdepunithramesh@ieee.org",
  },
  {
    name: "Sanjay V Guladakoppa",
    designation: "Treasurer, IEEE UVCE",
    phone: "+91 96320 91399",
    phoneLink: "tel:+919632091399",
    email: "sanjayvgk@ieee.org",
    emailLink: "mailto:sanjayvgk@ieee.org",
  },
]

const UVCE_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.066487504384!2d77.5852431749875!3d12.969640887353985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba357e62a937a89%3A0x6d90049e0134803!2sUniversity%20Visvesvaraya%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1699703473522!5m2!1sen!2sin"

const UVCE_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=University+Visvesvaraya+College+of+Engineering"

export function ContactSection() {
  return (
    <footer className="relative w-full max-w-7xl mx-auto flex flex-col items-center select-none px-4 py-8 sm:py-12">
      {/* Main Section Title */}
      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-saman text-white text-5xl sm:text-7xl md:text-8xl drop-shadow-lg tracking-tight text-center select-none leading-tight mb-4"
      >
        Contact <span className="text-white">Us</span>
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="font-roboto-mono text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest text-center drop-shadow-sm mb-10 sm:mb-14 max-w-2xl"
      >
        For more queries, reach out to our IEEE UVCE organizers or find your way to KAGADA 2025.
      </motion.p>

      <div className="w-full flex flex-col gap-12 sm:gap-16 mb-6 sm:mb-10">
        {/* Organizers Section */}
        <div className="flex flex-col items-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-outfit font-extrabold text-2xl sm:text-3xl text-white tracking-wider mb-8 text-center drop-shadow-md"
          >
            Organisers
          </motion.h3>

          {/* 3 Glassmorphic Organizers Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {ORGANIZERS.map((item, idx) => (
              <div
                key={`organizer-${idx}`}
                className={cn(
                  "relative overflow-hidden rounded-3xl p-6 text-center flex flex-col items-center justify-between",
                  "bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/35",
                  "transition-all duration-500 transform-gpu hover:scale-105 hover:bg-white/45 hover:border-white group"
                )}
              >
                {/* Glass Reflective Interior Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-3xl" />

                <div className="relative z-10 w-full flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/80 flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h4 className="font-outfit font-extrabold text-xl text-white tracking-wide mb-1 drop-shadow-sm">
                    {item.name}
                  </h4>
                  <p className="font-roboto-mono text-xs font-bold text-red-200 tracking-wider mb-5 uppercase">
                    {item.designation}
                  </p>
                </div>

                <div className="relative z-10 w-full flex flex-col gap-2 pt-4 border-t border-white/40 font-roboto-mono text-xs sm:text-sm font-semibold">
                  <a
                    href={item.phoneLink}
                    className="flex items-center justify-center gap-2 text-white/95 hover:text-white hover:underline transition-colors drop-shadow-sm"
                  >
                    <Phone className="w-4 h-4 text-white/80 shrink-0" />
                    <span>{item.phone}</span>
                  </a>
                  <a
                    href={item.emailLink}
                    className="flex items-center justify-center gap-2 text-white/95 hover:text-white hover:underline transition-colors drop-shadow-sm truncate max-w-full"
                  >
                    <Mail className="w-4 h-4 text-white/80 shrink-0" />
                    <span className="truncate">{item.email}</span>
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Embedded Map Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={cn(
            "relative w-full max-w-4xl mx-auto overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col items-center",
            "bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/35"
          )}
        >
          {/* Glass Reflective Interior Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-3xl" />

          {/* Perfectly Centered Map Header */}
          <div className="relative z-10 flex flex-col items-center text-center w-full mb-6">
            <h3 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white tracking-wide drop-shadow-sm">
              Find Us Here
            </h3>
            <p className="font-roboto-mono text-xs font-semibold text-white/80 tracking-wider uppercase mt-1">
              UVCE, KR Circle, Bengaluru
            </p>
          </div>

          {/* Embedded Google Map Frame */}
          <div className="relative z-10 w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border-2 border-white/80 shadow-xl mb-6 bg-black/20">
            <iframe
              src={UVCE_MAP_EMBED_URL}
              className="w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="University Visvesvaraya College of Engineering Location Map"
            />
          </div>

          {/* Clean Get Directions Action Button */}
          <a
            href={UVCE_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 w-full sm:w-auto bg-white text-[#8a1c1c] font-outfit font-black text-base py-3.5 px-8 rounded-2xl shadow-xl hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center uppercase tracking-wider"
          >
            Get Directions
          </a>
        </motion.div>
      </div>
    </footer>
  )
}

export default ContactSection
