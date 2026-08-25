"use client";

import { MapPin, Mail, Phone, Globe, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer id="about" className="bg-slate-950 border-t border-slate-900 text-slate-400 text-sm py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-slate-950">
                K
              </div>
              <span className="text-xl font-black text-white tracking-wider">
                KAGADA <span className="text-cyan-400">2026</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md">
              Kagada is the annual national-level student conference, paper presentation and project competition organized by IEEE UVCE (University Visvesvaraya College of Engineering), Bengaluru.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-cyan-400">
              <span>IEEE UVCE Student Branch</span>
              <span>•</span>
              <span>IEEE Bangalore Section</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-white text-xs font-bold uppercase tracking-wider">Quick Links</p>
            <ul className="space-y-2 text-xs">
              <li><a href="#intro" className="hover:text-cyan-400 transition-colors">Intro Video</a></li>
              <li><a href="#tracks" className="hover:text-cyan-400 transition-colors">Paper Presentation</a></li>
              <li><a href="#tracks" className="hover:text-cyan-400 transition-colors">Project Expo</a></li>
              <li><a href="#timeline" className="hover:text-cyan-400 transition-colors">Important Dates</a></li>
              <li><a href="#register" className="hover:text-cyan-400 transition-colors">Submit Abstract</a></li>
            </ul>
          </div>

          {/* Contact & Venue */}
          <div className="space-y-3">
            <p className="text-white text-xs font-bold uppercase tracking-wider">Contact & Venue</p>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>UVCE Campus, K.R. Circle, Bengaluru, Karnataka 560001</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>kagada2026@ieeeuvce.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>www.ieeeuvce.in</span>
              </p>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 IEEE UVCE. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Organized with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> by IEEE UVCE Student Branch
          </p>
        </div>
      </div>
    </footer>
  );
}
