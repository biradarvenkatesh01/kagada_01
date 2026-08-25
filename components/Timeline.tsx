"use client";

import { Calendar, Clock, MapPin, CheckCircle, Award } from "lucide-react";

export default function Timeline() {
  const steps = [
    {
      date: "October 15, 2026",
      title: "Abstract & Paper Submission Deadline",
      desc: "Submit your IEEE format full paper (PDF) or 500-word project abstract.",
      status: "Upcoming",
    },
    {
      date: "October 25, 2026",
      title: "Notification of Acceptance",
      desc: "Review results and acceptance notifications sent via email.",
      status: "Upcoming",
    },
    {
      date: "November 02, 2026",
      title: "Camera-Ready Submission & Author Registration",
      desc: "Final version of paper upload and author presentation registration.",
      status: "Upcoming",
    },
    {
      date: "November 14, 2026",
      title: "KAGADA 2026 Main Event Day",
      desc: "Live offline presentations, project expo, jury evaluations & award ceremony at UVCE Campus, Bengaluru.",
      status: "Event Day",
    },
  ];

  return (
    <section id="timeline" className="py-24 bg-slate-900/40 text-white relative border-t border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Important Dates
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Event Schedule & Milestones
          </p>
          <p className="text-slate-400 text-base">
            Keep track of paper submission deadlines and event day details.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-cyan-500/40 transition-all shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 mt-1">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {item.date}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1 max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
