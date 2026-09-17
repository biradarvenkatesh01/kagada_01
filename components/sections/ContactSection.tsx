import * as React from 'react'
import { User, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import QueryForm from '@/components/features/QueryForm'
import { ScrollReveal } from '@/components/ui/scroll-reveal'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662a11.87 11.87 0 005.71 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

interface ContactOrganizer {
  name: string
  designation: string
  phone: string
  whatsappLink: string
  email: string
  emailLink: string
}

const ORGANIZERS: ContactOrganizer[] = [
  {
    name: "Jyothika V",
    designation: "Chairperson, IEEE UVCE",
    phone: "+91 97318 64358",
    whatsappLink: "https://wa.me/919731864358",
    email: "jyothikav@ieee.org",
    emailLink: "mailto:jyothikav@ieee.org",
  },
  {
    name: "Hegde Punith Ramesh",
    designation: "Vice Chairperson, IEEE UVCE",
    phone: "+91 72041 20818",
    whatsappLink: "https://wa.me/917204120818",
    email: "hegdepunithramesh@ieee.org",
    emailLink: "mailto:hegdepunithramesh@ieee.org",
  },
  {
    name: "Sanjay V Guladakoppa",
    designation: "Treasurer, IEEE UVCE",
    phone: "+91 96320 91399",
    whatsappLink: "https://wa.me/919632091399",
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
    <section id="contact" className="relative w-full max-w-7xl mx-auto flex flex-col items-center select-none px-4 py-8 sm:py-12 scroll-mt-6 z-10">
      {/* Main Section Title */}
      <ScrollReveal direction="up" duration={500}>
        <h2 className="font-saman text-white text-5xl sm:text-7xl md:text-8xl drop-shadow-lg tracking-tight text-center select-none leading-tight mb-4">
          Contact <span className="text-amber-400 drop-shadow-md">Us</span>
        </h2>
      </ScrollReveal>

      {/* Subtitle */}
      <ScrollReveal direction="up" delay={60} duration={500}>
        <p className="font-roboto-mono text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-widest text-center drop-shadow-sm mb-10 sm:mb-14 max-w-2xl">
          For more queries, reach out to our IEEE UVCE organizers or find your way to KAGADA 2026.
        </p>
      </ScrollReveal>

      <div className="w-full flex flex-col gap-12 sm:gap-16 mb-6 sm:mb-10">
        {/* Organizers Section */}
        <div className="flex flex-col items-center">
          <ScrollReveal direction="up" duration={450}>
            <h3 className="font-outfit font-extrabold text-2xl sm:text-3xl text-white tracking-wider mb-8 text-center drop-shadow-md">
              Organisers
            </h3>
          </ScrollReveal>

          {/* 3 Glassmorphic Organizers Cards Directing to WhatsApp */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {ORGANIZERS.map((item, idx) => (
              <ScrollReveal key={`organizer-${idx}`} direction="up" delay={idx * 80} className="h-full">
                <div
                  className={cn(
                    "relative overflow-hidden rounded-3xl p-6 text-center flex flex-col items-center justify-between group h-full",
                    "bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/35",
                    "transition-all duration-500 hover:scale-105 hover:bg-white/45 hover:border-white"
                  )}
                >
                  {/* Glass Reflective Interior Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-3xl" />

                  <div className="relative z-10 w-full flex flex-col items-center">
                    {/* Profile Icon SVG */}
                    <div className="w-14 h-14 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/80 flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                      <User className="w-7 h-7 stroke-[2.2]" />
                    </div>
                    <h4 className="font-outfit font-extrabold text-xl text-white tracking-wide mb-1 drop-shadow-sm">
                      {item.name}
                    </h4>
                    <p className="font-roboto-mono text-xs font-bold text-red-200 tracking-wider mb-5 uppercase">
                      {item.designation}
                    </p>
                  </div>

                  <div className="relative z-10 w-full flex flex-col gap-2.5 pt-4 border-t border-white/40 font-roboto-mono text-xs sm:text-sm font-semibold">
                    <a
                      href={item.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Chat with ${item.name} on WhatsApp`}
                      className="flex items-center justify-center gap-2 text-white/95 hover:text-white transition-colors drop-shadow-sm hover:underline"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item.phone}</span>
                    </a>
                    <a
                      href={item.emailLink}
                      title={`Email ${item.name}`}
                      className="flex items-center justify-center gap-2 text-white/95 hover:text-white hover:underline transition-colors drop-shadow-sm truncate max-w-full"
                    >
                      <Mail className="w-4 h-4 text-white/80 shrink-0" />
                      <span className="truncate">{item.email}</span>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Working Query Form Section */}
        <QueryForm />

        {/* Embedded Map Section Card */}
        <ScrollReveal direction="up" delay={80} className="w-full max-w-4xl mx-auto">
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col items-center",
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
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default ContactSection;
