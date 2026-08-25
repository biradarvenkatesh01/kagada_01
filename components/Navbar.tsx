"use client";

import { useState, useEffect } from "react";
import { Sparkles, Menu, X, Trophy, FileText, Calendar, MapPin } from "lucide-react";

interface NavbarProps {
  onPlayVideoClick?: () => void;
}

export default function Navbar({ onPlayVideoClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-cyan-500/20 py-3 shadow-lg shadow-cyan-950/30"
          : "bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-cyan-400 text-lg">
              K
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                KAGADA <span className="text-cyan-400">2026</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest hidden sm:inline-block">
                IEEE UVCE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">National Conference & Competition</p>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#intro" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Intro
          </a>
          <a href="#tracks" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Tracks & Expo
          </a>
          <a href="#timeline" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Timeline
          </a>
          <a href="#prizes" className="text-slate-300 hover:text-cyan-400 transition-colors">
            Prizes
          </a>
          <a href="#about" className="text-slate-300 hover:text-cyan-400 transition-colors">
            About IEEE
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {onPlayVideoClick && (
            <button
              onClick={onPlayVideoClick}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 transition-all hover:border-cyan-400 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              Watch Video
            </button>
          )}

          <a
            href="#register"
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:-translate-y-0.5"
          >
            Submit Paper / Project
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/60 border border-slate-800"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-cyan-500/20 backdrop-blur-2xl px-6 py-6 space-y-4">
          <a
            href="#intro"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-cyan-400 py-1 font-medium"
          >
            Intro Video
          </a>
          <a
            href="#tracks"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-cyan-400 py-1 font-medium"
          >
            Tracks & Expo
          </a>
          <a
            href="#timeline"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-cyan-400 py-1 font-medium"
          >
            Timeline
          </a>
          <a
            href="#prizes"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-cyan-400 py-1 font-medium"
          >
            Prizes
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 hover:text-cyan-400 py-1 font-medium"
          >
            About IEEE
          </a>
          <div className="pt-2 flex flex-col gap-3">
            {onPlayVideoClick && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onPlayVideoClick();
                }}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Watch Intro Video
              </button>
            )}
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-center shadow-lg shadow-cyan-500/20"
            >
              Submit Paper / Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
