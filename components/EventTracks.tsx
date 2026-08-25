"use client";

import { FileText, Cpu, Layout, Award, ArrowRight, CheckCircle2 } from "lucide-react";

export default function EventTracks() {
  const tracks = [
    {
      id: "paper",
      title: "Paper Presentation",
      icon: FileText,
      tag: "Flagship Track",
      color: "from-cyan-500 to-blue-600",
      description: "Present original research work, literature reviews, and innovative technical solutions in engineering disciplines.",
      domains: ["AI & Machine Learning", "Robotics & Automation", "VLSI & Embedded Systems", "Renewable Energy & Smart Grids", "Cybersecurity & Blockchain"],
      prize: "₹40,000 Total Prize Pool"
    },
    {
      id: "project",
      title: "Project Exhibition",
      icon: Cpu,
      tag: "Live Demos",
      color: "from-blue-500 to-indigo-600",
      description: "Showcase working hardware prototypes, IoT devices, software products, and interactive engineering models.",
      domains: ["Smart City Solutions", "Healthcare Tech & Devices", "Autonomous Vehicles", "Agritech & Environmental Systems", "AI Edge Hardware"],
      prize: "₹35,000 Total Prize Pool"
    },
    {
      id: "poster",
      title: "Poster Presentation",
      icon: Layout,
      tag: "Visual Research",
      color: "from-indigo-500 to-purple-600",
      description: "Display conceptual frameworks, architectural diagrams, and early-stage research posters to domain experts.",
      domains: ["Emerging Tech Concepts", "Sustainable Design", "Bio-Engineering", "Quantum Computing Concepts", "Data Science Models"],
      prize: "₹15,000 Total Prize Pool"
    },
    {
      id: "wie",
      title: "WIE Special Track",
      icon: Award,
      tag: "IEEE WIE Special",
      color: "from-fuchsia-500 to-rose-600",
      description: "Dedicated competition track encouraging research papers and project presentations led by women innovators.",
      domains: ["Open Research for Female Innovators", "Women-Led Tech Startups", "Cross-Disciplinary Engineering", "Social Impact Engineering"],
      prize: "₹15,000 Total Prize Pool + IEEE Badges"
    }
  ];

  return (
    <section id="tracks" className="py-24 bg-slate-950 text-white relative">
      {/* Background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Competition Tracks & Expo
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Choose Your Track & Win Big
          </p>
          <p className="text-slate-400 text-base sm:text-lg">
            Submit your research papers, hardware models, visual posters, or join the IEEE WIE special category.
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tracks.map((track) => {
            const Icon = track.icon;
            return (
              <div
                key={track.id}
                className="group relative p-8 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/50 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${track.color} text-slate-950 shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      {track.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {track.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {track.description}
                  </p>

                  {/* Domains */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Focus Areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {track.domains.map((domain, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60"
                        >
                          <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer / Prize & Link */}
                <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs font-bold text-cyan-400">
                    {track.prize}
                  </div>
                  <a
                    href="#register"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-cyan-400 transition-colors"
                  >
                    <span>Submit Work</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
