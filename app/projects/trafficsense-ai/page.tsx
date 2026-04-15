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

export default function FYPProjectDetail() {
  const project = {
    title: "TrafficSense AI",
    category: "AI & Computer Vision",
    description: "An advanced computer vision system utilizing YOLOv7 and OpenCV for real-time traffic analysis and object detection. Deployed via Docker on Hugging Face Spaces with a Streamlit interface. This system achieves 98% mAP accuracy to support urban planning initiatives.",
    huggingFaceUrl: "https://lunaequinx-trafficsense-ai.hf.space",
    techStack: [
      "Python 3.10", "YOLOv7", "OpenCV", "PyTorch",
      "Streamlit", "Docker", "Hugging Face Spaces", "Git LFS"
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
          href="/" 
          className="text-[10px] md:text-xs font-mono tracking-[0.3em] uppercase text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 w-fit"
        >
          <span>←</span> Return to Base
        </Link>

        {/* Header Section */}
        {/* Header Section - Adjusted for "Gap" and Polish */}
            <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10 px-2 md:px-0" // Increased space-y for the vertical gap
            >
            <div className="inline-block">
                <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.3em] bg-cyan-900/30 px-5 py-2 rounded-sm border border-cyan-400/20">
                {project.category}
                </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-black tracking-tight md:tracking-tighter uppercase leading-[0.9] max-w-4xl">
                {/* Added max-w-4xl to prevent edge-bleeding and leading-[0.9] for a tighter look */}
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

        {/* Hugging Face Demo Embed */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="space-y-6 pt-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">Live Deployment</h2>
            <a
              href={project.huggingFaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan-400 text-black px-6 py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:scale-105 transition-all text-center"
            >
              Open in Hugging Face ↗
            </a>
          </div>

          <div className="w-full h-[700px] bg-[#1a1c1e] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-xs uppercase tracking-[0.3em] -z-10">
              Initializing Space...
            </div>
            <iframe
              src={project.huggingFaceUrl}
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
            
            {/* The Problem */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-red-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></span>
                The Problem
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Existing traffic monitoring systems are often expensive, inflexible, and heavily reliant on live video streams and robust internet connections. Furthermore, these complex deep-learning setups are rarely designed with user-friendly interfaces, creating a barrier for non-technical city planners and traffic officers.
              </p>
            </div>

            {/* The Solution */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span>
                The Solution
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                A scalable, offline-capable detection system designed for pre-recorded video analysis. Utilizing a custom YOLOv7 model via PyTorch and OpenCV, the system detects, classifies, and counts vehicles. A Streamlit dashboard interprets this data, categorizing flow as "Light," "Moderate," or "Heavy" for immediate infrastructure insights.
              </p>
            </div>

            {/* The Challenges */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
                The Challenges
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                Deploying advanced computer vision models requires balancing complex architectural demands with computational hardware constraints. The model also had to be rigorously trained to overcome common urban traffic obstacles, such as severe vehicle occlusion and dynamic lighting variability.
              </p>
            </div>

            {/* The Results */}
            <div className="bg-[#1a1c1e] p-8 md:p-10 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                The Results
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                The YOLOv7 architecture achieved an outstanding mean Average Precision (mAP@0.5) of 0.983 and an F1-Score of 0.950 across all vehicle classes. Furthermore, the system processes video efficiently at ~50 FPS on an RTX 3050 GPU, proving its viability as a rapid analytical tool.
              </p>
            </div>

          </div>
        </motion.section>
      </div>
    </main>
  );
}