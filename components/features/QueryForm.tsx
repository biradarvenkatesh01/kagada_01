"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QueryForm({ className }: { className?: string }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your first name.");
      return;
    }

    if (!formData.email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Please describe what we can help you with.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setStatus("error");
        setErrorMessage(data.error || "Failed to submit query. Please try again.");
      } else {
        setStatus("success");
      }
    } catch (err: unknown) {
      console.error("Submission failed:", err);
      setStatus("error");
      setErrorMessage("Network connection error. Please try again in a moment.");
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    });
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative w-full max-w-3xl mx-auto overflow-hidden rounded-3xl p-6 sm:p-10",
        "bg-white/30 backdrop-blur-2xl border-2 border-white/80 shadow-2xl shadow-black/35 transform-gpu",
        className
      )}
    >
      {/* Glass Reflective Interior Shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20 pointer-events-none rounded-3xl" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            /* Success Feedback State */
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -15 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="w-full flex flex-col items-center text-center py-8 sm:py-12"
            >
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/80 flex items-center justify-center text-emerald-400 mb-6 shadow-xl shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>

              <h4 className="font-smooch text-4xl sm:text-6xl text-[#8a1c1c] font-semibold tracking-wide mb-2">
                Query Received!
              </h4>

              <p className="font-jakarta text-sm sm:text-base font-medium text-slate-800/90 max-w-md mb-8 leading-relaxed">
                Thank you, <strong className="text-[#8a1c1c]">{formData.firstName}</strong>. We have received your query and IEEE UVCE will respond as soon as possible.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="bg-[#8a1c1c] hover:bg-[#a12222] text-white font-outfit font-extrabold text-sm sm:text-base py-3.5 px-8 rounded-2xl shadow-xl border-2 border-white/80 hover:scale-105 active:scale-95 transition-all duration-300 uppercase tracking-wider cursor-pointer"
              >
                Send Another Query
              </button>
            </motion.div>
          ) : (
            /* Main Form */
            <motion.form
              key="form-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="w-full flex flex-col"
            >
              {/* Form Title & Subtitle */}
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="font-smooch text-4xl sm:text-6xl text-[#8a1c1c] font-semibold tracking-wide leading-tight drop-shadow-sm">
                  Have a Query?
                </h3>
                <p className="font-roboto-mono text-xs sm:text-sm font-semibold text-white/90 uppercase tracking-wider mt-1 drop-shadow-sm">
                  Send us your question and our team will get back to you
                </p>
              </div>

              {/* Error Banner */}
              {status === "error" && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-red-600/20 border border-red-500/60 backdrop-blur-md flex items-center gap-3 text-red-100 font-jakarta text-xs sm:text-sm shadow-md"
                >
                  <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Field 1: First Name & Last Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-5">
                <div className="flex flex-col text-left">
                  <label
                    htmlFor="firstName"
                    className="font-roboto-mono text-xs font-bold text-white tracking-wider uppercase mb-1.5 drop-shadow-sm"
                  >
                    First name <span className="text-amber-300">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                    disabled={status === "submitting"}
                    className="w-full bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 font-jakarta text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#8a1c1c]/50 focus:border-[#8a1c1c] focus:bg-white/90 transition-all shadow-inner"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label
                    htmlFor="lastName"
                    className="font-roboto-mono text-xs font-bold text-white tracking-wider uppercase mb-1.5 drop-shadow-sm"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    disabled={status === "submitting"}
                    className="w-full bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 font-jakarta text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#8a1c1c]/50 focus:border-[#8a1c1c] focus:bg-white/90 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Field 2: Email */}
              <div className="flex flex-col text-left mb-4 sm:mb-5">
                <label
                  htmlFor="email"
                  className="font-roboto-mono text-xs font-bold text-white tracking-wider uppercase mb-1.5 drop-shadow-sm"
                >
                  Email <span className="text-amber-300">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                  disabled={status === "submitting"}
                  className="w-full bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl px-4 py-3 text-slate-900 placeholder:text-slate-400 font-jakarta text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#8a1c1c]/50 focus:border-[#8a1c1c] focus:bg-white/90 transition-all shadow-inner"
                />
              </div>

              {/* Field 3: Query Message */}
              <div className="flex flex-col text-left mb-6 sm:mb-8">
                <label
                  htmlFor="message"
                  className="font-roboto-mono text-xs font-bold text-white tracking-wider uppercase mb-1.5 drop-shadow-sm"
                >
                  What can we help you with? <span className="text-amber-300">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ask about presentation tracks, registration details, eligibility, or event schedule..."
                  required
                  disabled={status === "submitting"}
                  className="w-full bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl px-4 py-3.5 text-slate-900 placeholder:text-slate-400 font-jakarta text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#8a1c1c]/50 focus:border-[#8a1c1c] focus:bg-white/90 transition-all shadow-inner resize-none custom-scrollbar"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className={cn(
                  "w-full sm:w-auto self-center bg-[#8a1c1c] hover:bg-[#a12222] text-white font-outfit font-extrabold text-base py-4 px-10 rounded-2xl shadow-xl border-2 border-white/80",
                  "transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer",
                  "hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                )}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Query...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Query</span>
                    <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
