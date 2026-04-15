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
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-purple-400 pointer-events-none z-[999] mix-blend-screen hidden md:block"
      animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
      transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}
    >
      <div className="absolute inset-0 bg-purple-400/20 blur-md rounded-full" />
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
          className="absolute w-1.5 h-1.5 bg-purple-300 rounded-full shadow-[0_0_12px_#a855f7]"
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

export default function MatacDirectoryDetail() {
  const project = {
    title: "MATAC Industry Directory",
    category: "Graphic Design & Data Management",
    description: "A critical industry resource designed for the Malaysian Textile and Apparel Centre (MATAC). This project bridged multimedia computing with data integrity, revitalizing the directory for spinners, weavers, and garment-makers while maintaining strict corporate aesthetic standards.",
    techStack: [
      "Digital Graphics", "Data Management", "Layout Design", 
      "Data Integrity", "Print Production", "Information Architecture"
    ]
  };

  return (
    <main className="relative min-h-screen bg-[#0d0e10] text-slate-100 selection:bg-purple-500/30 font-sans p-6 md:p-16 overflow-hidden md:cursor-none">
      
      {/* Background Elements */}
      <SpiritCursor />
      <Fireflies />
      
      {/* Container */}
      <div className="max-w-5xl mx-auto space-y-12 relative z-10 pt-10">
        
        {/* Back Navigation */}
        <Link 
          href="/" 
          className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-2 w-fit"
        >
          <span>←</span> Return to Base
        </Link>

        {/* Header Section */}
       {/* Header Section - Adjusted for better spacing */}
    <motion.header 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="space-y-8 px-2 md:px-0" // Added small mobile padding
    >
    <div className="inline-block">
        <span className="text-[10px] text-purple-400 font-mono uppercase tracking-[0.3em] bg-purple-900/30 px-5 py-2 rounded-sm border border-purple-400/20">
        {project.category}
        </span>
    </div>

    <h1 className="text-4xl md:text-7xl font-black tracking-tight md:tracking-tighter uppercase leading-[0.9] max-w-4xl">
        {/* Added max-w-4xl to prevent it from hitting the edge 
        Changed tracking to be tighter on desktop but normal on mobile 
        */}
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
              className="px-4 py-2 text-[10px] md:text-xs rounded-full bg-[#1a1c1e] border border-white/10 text-slate-300 font-bold tracking-widest uppercase hover:border-purple-500/50 transition-colors"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Image Showcase Placeholder */}
        {/* Visual Showcase Gallery (Horizontal Layout) */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="space-y-8 pt-6"
        >
          <div className="flex flex-col gap-8 md:gap-12">
            
            {/* Asset 1: Cover Spread */}
            <div className="group relative w-full aspect-video bg-[#1a1c1e] rounded-3xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all shadow-xl">
              <img src="/matac-cover.jpg" alt="MATAC Directory Cover" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-10">
                <div>
                  <p className="text-purple-400 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-2">01</p>
                  <p className="text-white font-bold text-2xl md:text-3xl">Cover Design</p>
                </div>
              </div>
            </div>

            {/* Asset 2: Section Breaker */}
            <div className="group relative w-full aspect-video bg-[#1a1c1e] rounded-3xl overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-all shadow-xl">
              <img src="/matac-breaker.png" alt="MATAC Section Breaker" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-10">
                <div>
                  <p className="text-cyan-400 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-2">02</p>
                  <p className="text-white font-bold text-2xl md:text-3xl">Section Hierarchy</p>
                </div>
              </div>
            </div>

            {/* Asset 3: Data Page */}
            <div className="group relative w-full aspect-video bg-[#1a1c1e] rounded-3xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition-all shadow-xl">
              <img src="/matac-data.jpg" alt="MATAC Data Page" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 md:p-10">
                <div>
                  <p className="text-emerald-400 font-mono text-[10px] md:text-xs uppercase tracking-widest mb-2">03</p>
                  <p className="text-white font-bold text-2xl md:text-3xl">Data Management</p>
                </div>
              </div>
            </div>

          </div>
        </motion.section>

        {/* Project Breakdown / Case Study */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="pt-10 pb-20 space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Design Breakdown</h2>
            <div className="w-24 h-1 bg-purple-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            
            {/* The Scope */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
                The Objective
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Tasked with revitalizing a critical industry resource, ensuring the MATAC Secretariat maintained an up-to-date record of textile stakeholders. The final product had to serve as a reliable reference point for national spinners, weavers, and garment-makers.
              </p>
            </div>

            {/* Digital Graphics */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                Digital Graphics
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Led the visual design phase, iterating on multiple drafts for the directory's front and back covers. The core design challenge was crafting a professional aesthetic that perfectly aligned with the center's established corporate identity.
              </p>
            </div>

            {/* Data Management */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                Data Management
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Executed systematic data entry, requiring the meticulous key-in of complex company profiles and contact details. Rigorously cross-referenced industry data to guarantee 100% accuracy ahead of the strict December 16th print deadline.
              </p>
            </div>

            {/* The Result */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]"></span>
                The Impact
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Delivered a polished, print-ready book that successfully disseminates vital textile industry statistics. This project proved that effective digital design is inseparable from data integrity when communicating professionalism to industry leaders.
              </p>
            </div>

          </div>
        </motion.section>
      </div>
    </main>
  );
}