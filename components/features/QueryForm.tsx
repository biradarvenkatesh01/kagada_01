"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";


interface QueryFormProps {
  className?: string;
  containerClassName?: string;
}

export default function QueryForm({
  className,
  containerClassName = "w-full max-w-3xl mx-auto",
}: QueryFormProps) {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
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
    <div className={cn("w-full", containerClassName)}>
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-3xl p-6 sm:p-7 lg:p-8 flex flex-col justify-between",
          "kagada-paper-card border-2 border-white/95 shadow-2xl shadow-black/25",
          className
        )}
      >
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
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-600/60 flex items-center justify-center text-emerald-600 mb-6 shadow-md">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>

              <h4 className="font-smooch text-4xl sm:text-6xl text-[#5A182B] font-semibold tracking-wide mb-2">
                Query Received!
              </h4>

              <p className="font-jakarta text-sm sm:text-base font-medium text-stone-700 max-w-md mb-8 leading-relaxed">
                Thank you, <strong className="font-extrabold text-[#5A182B]">{formData.firstName}</strong>. We have received your query and IEEE UVCE will respond as soon as possible.
              </p>

              <button
                type="button"
                onClick={handleReset}
                className="kagada-paper-card hover:brightness-105 text-[#5A182B] font-outfit font-extrabold text-sm sm:text-base py-3.5 px-8 rounded-2xl shadow-xl border-2 border-[#5A182B]/30 transition-glass duration-200 uppercase tracking-wider cursor-pointer"
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
              <div className="text-center mb-4 sm:mb-5">
                <h3 className="font-smooch text-3xl sm:text-4xl lg:text-5xl text-[#5A182B] font-semibold tracking-wide leading-tight">
                  Have a Query?
                </h3>
                <p className="font-roboto-mono text-xs font-bold text-[#5A182B]/80 uppercase tracking-wider mt-0.5">
                  Send us your question and our team will get back to you
                </p>
              </div>

              {/* Error Banner */}
              {status === "error" && errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-2xl bg-red-600/15 border border-red-600/40 flex items-center gap-3 text-red-800 font-jakarta text-xs sm:text-sm shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {/* Field 1: First Name & Last Name Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-3.5">
                <div className="flex flex-col text-left">
                  <label
                    htmlFor="firstName"
                    className="font-roboto-mono text-xs font-bold text-[#5A182B] tracking-wider uppercase mb-1"
                  >
                    First name <span className="text-[#5A182B] font-black">*</span>
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
                    className="w-full bg-[#D8D3C7]/80 hover:bg-[#D8D3C7] focus:bg-white border-2 border-[#5A182B]/20 focus:border-[#5A182B] focus:ring-2 focus:ring-[#5A182B]/20 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-900 placeholder:text-stone-500 font-jakarta text-sm font-medium focus:outline-none transition-glass duration-150 shadow-sm"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <label
                    htmlFor="lastName"
                    className="font-roboto-mono text-xs font-bold text-[#5A182B] tracking-wider uppercase mb-1"
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
                    className="w-full bg-[#D8D3C7]/80 hover:bg-[#D8D3C7] focus:bg-white border-2 border-[#5A182B]/20 focus:border-[#5A182B] focus:ring-2 focus:ring-[#5A182B]/20 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-900 placeholder:text-stone-500 font-jakarta text-sm font-medium focus:outline-none transition-glass duration-150 shadow-sm"
                  />
                </div>
              </div>

              {/* Field 2: Email */}
              <div className="flex flex-col text-left mb-3 sm:mb-3.5">
                <label
                  htmlFor="email"
                  className="font-roboto-mono text-xs font-bold text-[#5A182B] tracking-wider uppercase mb-1"
                >
                  Email <span className="text-[#5A182B] font-black">*</span>
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
                  className="w-full bg-[#D8D3C7]/80 hover:bg-[#D8D3C7] focus:bg-white border-2 border-[#5A182B]/20 focus:border-[#5A182B] focus:ring-2 focus:ring-[#5A182B]/20 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-900 placeholder:text-stone-500 font-jakarta text-sm font-medium focus:outline-none transition-glass duration-150 shadow-sm"
                />
              </div>

              {/* Field 3: Query Message */}
              <div className="flex flex-col text-left mb-5 sm:mb-6">
                <label
                  htmlFor="message"
                  className="font-roboto-mono text-xs font-bold text-[#5A182B] tracking-wider uppercase mb-1"
                >
                  What can we help you with? <span className="text-[#5A182B] font-black">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Ask about presentation tracks, registration details, eligibility, or event schedule..."
                  required
                  disabled={status === "submitting"}
                  className="w-full bg-[#D8D3C7]/80 hover:bg-[#D8D3C7] focus:bg-white border-2 border-[#5A182B]/20 focus:border-[#5A182B] focus:ring-2 focus:ring-[#5A182B]/20 rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-slate-900 placeholder:text-stone-500 font-jakarta text-sm font-medium focus:outline-none transition-glass duration-150 shadow-sm resize-none custom-scrollbar min-h-[85px] sm:min-h-[95px]"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className={cn(
                  "w-full sm:w-auto self-center kagada-paper-card hover:brightness-105 text-[#5A182B] font-outfit font-black text-sm sm:text-base py-3 sm:py-3.5 px-8 rounded-2xl shadow-xl border-2 border-[#5A182B]/30 hover:border-[#5A182B]/60",
                  "transition-glass duration-200 uppercase tracking-wider flex items-center justify-center gap-2 group cursor-pointer",
                  "disabled:opacity-60 disabled:cursor-not-allowed"
                )}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#5A182B]" />
                    <span>Submitting Query...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Query</span>
                    <Send className="w-4 h-4 text-[#5A182B] transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
}
