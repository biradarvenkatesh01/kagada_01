'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Globe } from 'lucide-react'

// Clean Inline Social SVGs
const SocialIcons = {
  website: () => <Globe className="w-5 h-5" />,
  instagram: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  linkedin: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  youtube: () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M23.498 6.186c-.273-.997-1.056-1.77-2.054-2.043-1.815-.494-9.081-.494-9.081-.494s-7.266 0-9.08.494c-.998.273-1.78 1.046-2.054 2.043-.495 1.832-.495 5.655-.495 5.655s0 3.823.495 5.655c.274.997 1.056 1.77 2.054 2.043 1.814.494 9.08.494 9.08.494s7.266 0 9.08-.494c.999-.273 1.781-1.046 2.055-2.043.494-1.832.494-5.655.494-5.655s0-3.823-.494-5.655zm-13.918 8.847v-6.064l5.882 3.032-5.882 3.032z" />
    </svg>
  ),
}

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
        Get in touch with the IEEE UVCE KAGADA 2025 organizing committee.
      </motion.p>

      {/* 3 Glassmorphic Contact Grid Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16"
      >
        {/* Card 1: Venue / Address */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/30 flex flex-col items-center text-center transition-all duration-500 hover:bg-white/40 hover:border-white group">
          <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/80 flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
            <MapPin className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h3 className="font-outfit font-extrabold text-xl text-white mb-2 tracking-wide">
            Venue Location
          </h3>
          <p className="font-jakarta text-sm font-medium text-white/90 leading-relaxed">
            University Visvesvaraya College of Engineering (UVCE), K.R. Circle, Bengaluru, Karnataka 560001
          </p>
        </div>

        {/* Card 2: Email & Phone */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/30 flex flex-col items-center text-center transition-all duration-500 hover:bg-white/40 hover:border-white group">
          <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/80 flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
            <Mail className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h3 className="font-outfit font-extrabold text-xl text-white mb-2 tracking-wide">
            Email & Inquiries
          </h3>
          <a
            href="mailto:kagada@ieeeuvce.org"
            className="font-roboto-mono text-sm font-bold text-white hover:underline drop-shadow-sm mb-1"
          >
            kagada@ieeeuvce.org
          </a>
          <a
            href="mailto:chair@ieeeuvce.org"
            className="font-roboto-mono text-sm font-semibold text-white/90 hover:underline drop-shadow-sm"
          >
            chair@ieeeuvce.org
          </a>
        </div>

        {/* Card 3: Social Connections */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/30 flex flex-col items-center text-center transition-all duration-500 hover:bg-white/40 hover:border-white group">
          <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/80 flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform duration-300">
            <Globe className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h3 className="font-outfit font-extrabold text-xl text-white mb-4 tracking-wide">
            Connect With Us
          </h3>
          <div className="flex items-center gap-4">
            <a
              href="https://ieeeuvce.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/30 border border-white/80 text-white hover:bg-white/50 hover:scale-110 transition-all shadow-md"
              title="Official Website"
            >
              <SocialIcons.website />
            </a>
            <a
              href="https://www.instagram.com/ieeeuvce/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/30 border border-white/80 text-white hover:bg-white/50 hover:scale-110 transition-all shadow-md"
              title="Instagram"
            >
              <SocialIcons.instagram />
            </a>
            <a
              href="https://www.linkedin.com/company/ieee-uvce/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/30 border border-white/80 text-white hover:bg-white/50 hover:scale-110 transition-all shadow-md"
              title="LinkedIn"
            >
              <SocialIcons.linkedin />
            </a>
            <a
              href="https://www.youtube.com/@ieeeuvce"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/30 border border-white/80 text-white hover:bg-white/50 hover:scale-110 transition-all shadow-md"
              title="YouTube"
            >
              <SocialIcons.youtube />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Footer Bottom Bar */}
      <div className="w-full pt-8 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="font-roboto-mono text-xs font-semibold text-white/90 tracking-wider">
          © 2025 IEEE UVCE. All Rights Reserved.
        </p>
        <p className="font-outfit text-xs font-bold text-white/80 tracking-widest uppercase">
          KAGADA 2025 • National Student Conference
        </p>
      </div>
    </footer>
  )
}

export default ContactSection
