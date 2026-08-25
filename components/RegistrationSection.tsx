"use client";

import { useState } from "react";
import { Send, CheckCircle2, FileText, Upload, Sparkles } from "lucide-react";

export default function RegistrationSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="register" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 p-8 sm:p-12 border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 relative overflow-hidden">
          
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Call for Submissions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Register for KAGADA 2026
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Fill out the form below to submit your abstract or paper draft for review.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Submission Received!</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Thank you for submitting to Kagada 2026. A confirmation receipt and paper ID have been dispatched to your email address.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all"
              >
                Submit Another Entry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Primary Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Alex Morgan"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="author@college.edu"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    College / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="UVCE, Bengaluru"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">
                    Select Track *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-sm text-white focus:outline-none transition-colors"
                  >
                    <option value="paper">Paper Presentation</option>
                    <option value="project">Project Presentation</option>
                    <option value="poster">Poster Presentation</option>
                    <option value="wie">WIE Special Track</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Paper / Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Autonomous Edge AI System for Precision Agriculture"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-sm text-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Upload Abstract / Draft (PDF format)
                </label>
                <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/40 transition-colors">
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-300 font-medium">Click to select PDF or drag and drop</p>
                  <p className="text-[11px] text-slate-500 mt-1">Maximum file size: 10MB</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-4 h-4" />
                <span>Submit Entry to Kagada 2026</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </section>
  );
}
