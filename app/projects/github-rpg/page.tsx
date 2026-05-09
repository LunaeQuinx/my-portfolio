"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect, memo } from "react";

// --- Types ---
interface Firefly { 
  id: number; 
  x: number; 
  y: number; 
  targetX: number; 
  targetY: number; 
  duration: number; 
  delay: number; 
}

// --- 1. Spirit Cursor ---
const SpiritCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400 pointer-events-none z-[999] mix-blend-screen hidden md:block"
      animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
      transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}
    >
      <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full" />
    </motion.div>
  );
};

// --- 2. Fireflies Animation ---
const Fireflies = memo(() => {
  const [flies, setFlies] = useState<Firefly[]>([]);
  
  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i, 
      x: Math.random() * 100, 
      y: Math.random() * 100, 
      targetX: (Math.random() - 0.5) * 15,
      targetY: (Math.random() - 0.5) * 15, 
      duration: 5 + Math.random() * 5, 
      delay: Math.random() * 5,
    }));
    setFlies(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {flies.map((fly) => (
        <motion.div
          key={fly.id} 
          className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_12px_#22d3ee]"
          initial={{ opacity: 0, x: `${fly.x}vw`, y: `${fly.y}vh` }}
          animate={{ 
            opacity: [0, 0.8, 0], 
            x: [`${fly.x}vw`, `${fly.x + fly.targetX}vw`], 
            y: [`${fly.y}vh`, `${fly.y + fly.targetY}vh`] 
          }}
          transition={{ 
            duration: fly.duration, 
            repeat: Infinity, 
            delay: fly.delay, 
            ease: "easeInOut" 
          }}
        />
      ))}
    </div>
  );
});
Fireflies.displayName = "Fireflies";

export default function GitHubRPGProjectDetail() {
  const project = {
    title: "GitHub RPG Summoner",
    category: "Frontend Dev & API",
    description: "An interactive web application that bridges standard REST API integration with advanced UI/UX. It transforms raw developer metrics—such as repository output and follower networks—into a deterministic RPG stat system, complete with 3D parallax physics and dynamic data visualization.",
    liveUrl: "https://github-rpg-one.vercel.app", 
    techStack: [
      "React 18", "Vite", "REST API", "Recharts",
      "CSS Trigonometry", "React Parallax Tilt", "HTML2Canvas"
    ]
  };

  return (
    <main className="relative min-h-screen bg-[#0d0e10] text-slate-100 selection:bg-cyan-500/30 font-sans p-6 md:p-16 overflow-hidden md:cursor-none">
      
      {/* Background Elements */}
      <SpiritCursor />
      <Fireflies />
      
      {/* Container */}
      <div className="max-w-5xl mx-auto space-y-12 relative z-10 pt-10">
        
        {/* Back Navigation */}
        <Link 
          href="/#recent" 
          className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 w-fit"
        >
          <span>←</span> Return to Base
        </Link>

        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-10 px-2 md:px-0"
        >
          <div className="inline-block">
            <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.3em] bg-cyan-900/30 px-5 py-2 rounded-sm border border-cyan-400/20">
              {project.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tight md:tracking-tighter uppercase leading-[0.9] max-w-4xl">
            {project.title}
          </h1>

          <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light max-w-2xl">
            {project.description}
          </p>
        </motion.header>

        {/* Tech Stack Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-wrap gap-3"
        >
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 text-[10px] md:text-xs rounded-full bg-[#1a1c1e] border border-white/10 text-slate-300 font-bold tracking-widest uppercase hover:border-cyan-500/50 transition-colors"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Vercel Demo Embed */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="space-y-6 pt-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Live Deployment</h2>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan-400 text-black px-6 py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:scale-105 transition-all text-center"
            >
              Launch Live App ↗
            </a>
          </div>

          <div className="w-full h-[700px] bg-[#1a1c1e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-[0.3em] -z-10">
              Summoning Magic...
            </div>
            <iframe
              src={project.liveUrl}
              frameBorder="0"
              className="w-full h-full relative z-10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </motion.section>

        {/* Project Breakdown / Case Study */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-16 pb-20 space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Project Breakdown</h2>
            <div className="w-24 h-1 bg-cyan-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            
            {/* The Objective */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-red-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
                The Objective
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Traditional developer portfolios and GitHub stat trackers are often dry, numeric, and fail to capture a developer's unique identity. The goal was to build a standout portfolio centerpiece that demonstrates capabilities beyond a standard CRUD app, converting standard metrics into a highly shareable, gamified aesthetic.
              </p>
            </div>

            {/* Algorithmic Logic */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                Algorithmic Logic
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Designed a custom logarithmic scaling algorithm (Math.log2) to fairly evaluate and rank developer profiles. This ensured the math didn't break for massive influencers while still rewarding active juniors. Transformed raw JSON payloads into balanced RPG metrics like "Mana" and "HP," alongside an automated class-assignment system.
              </p>
            </div>

            {/* UI/UX */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
                Interactive UI / UX
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Engineered a tactile, responsive 3D card interface using React Parallax Tilt. Integrated custom CSS trigonometry for particle effects, Recharts for a responsive language mastery radar graph, and a seamless front-to-back flip mechanism built entirely from scratch without pre-made UI libraries.
              </p>
            </div>

            {/* The Impact */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                The Impact
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Delivered a highly engaging, mobile-optimized web application deployed on Vercel, featuring a custom HTML-to-Canvas export function for social sharing. The project effectively showcases a deep command of React state management, complex data mapping, and creative frontend engineering.
              </p>
            </div>

          </div>
        </motion.section>
      </div>
    </main>
  );
}