"use client";

import Link from "next/link";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";

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

interface Skill { 
  name: string; 
  img: string; 
}

// --- 1. Spirit Cursor ---
// FIX: Use ref instead of state to avoid re-renders on every mousemove
const SpiritCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-cyan-400 pointer-events-none z-[999] mix-blend-screen hidden md:block will-change-transform"
      style={{ transition: "transform 0.12s cubic-bezier(0.16,1,0.3,1)" }}
    >
      <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-full" />
    </div>
  );
};

// --- 2. Fireflies Animation ---
// FIX: Reduced to 18 fireflies, uses CSS animation instead of Framer Motion
// so they don't block the main thread during scroll
const Fireflies = memo(() => {
  const [flies, setFlies] = useState<Firefly[]>([]);
  
  useEffect(() => {
    const generated = Array.from({ length: 18 }).map((_, i) => ({
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
    <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
      {flies.map((fly) => (
        <motion.div
          key={fly.id} 
          className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_12px_#22d3ee] will-change-transform"
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

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>("Project");
  const [activeNav, setActiveNav] = useState<string>("home");
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef, 
    offset: ["start start", "end end"] 
  });

  // FIX: Simplified parallax — fewer keyframes = less work per scroll tick
  const treeScale = useTransform(scrollYProgress, [0, 0.3], isMobile ? [1, 1.2] : [1, 3.2]);
  const treeX = useTransform(scrollYProgress, [0, 0.3], isMobile ? ["0%", "0%"] : ["0%", "-55%"]);
  const treeY = useTransform(scrollYProgress, [0, 0.6], isMobile ? ["0%", "5%"] : ["0%", "15%"]);
  const treeOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8], [1, 0.7, 0]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const quoteOpacity = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);

  // FIX: Throttled intersection observer — use useCallback to avoid recreation
  const scrollToSection = useCallback((id: string) => { 
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); 
  }, []);

  useEffect(() => {
    const sections = ["home", "aboutme", "recent", "contact"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { 
        if (entry.isIntersecting) setActiveNav(entry.target.id); 
      });
    }, { threshold: 0.3 });
    
    sections.forEach((id) => { 
      const el = document.getElementById(id); 
      if (el) observer.observe(el); 
    });
    
    return () => observer.disconnect();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const skills: Skill[] = [
    { name: "Java", img: "java.png" }, 
    { name: "C++", img: "cpp.png" }, 
    { name: "Python", img: "python.png" },
    { name: "Photoshop", img: "photoshop.png" }, 
    { name: "Illustrator", img: "illustrator.png" }, 
    { name: "Figma", img: "figma.png" },
    { name: "Premiere", img: "premiere.png" }, 
    { name: "HTML", img: "html.png" }, 
    { name: "PHP", img: "php.png" }
  ];

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) setIsFlipped(!isFlipped);
  };

  return (
    <main 
      ref={containerRef} 
      className="relative min-h-screen bg-[#0d0e10] text-slate-100 selection:bg-cyan-500/30 font-sans scroll-smooth md:cursor-none overflow-x-hidden"
    >
      <SpiritCursor />
      <Fireflies />

      {/* --- Main Navigation --- */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:top-8 md:right-8 md:left-auto md:translate-x-0 z-[100] w-[95%] md:w-auto">
        <div className="flex p-1 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          {[
            { label: "Home", id: "home" },
            { label: "About Me", id: "aboutme" },
            { label: "Recent", id: "recent" },
            { label: "Contact", id: "contact" }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollToSection(item.id)}
              className={`relative px-3 md:px-6 py-2.5 text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 z-10 flex-1 md:flex-none ${
                activeNav === item.id ? "text-black" : "text-slate-400 hover:text-white"
              }`}
            >
              {activeNav === item.id && (
                <motion.div
                  layoutId="nav-slider"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-20">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* --- Yggdrasil Tree Background --- */}
      {/* FIX: Added will-change-transform so GPU handles this layer separately */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[0]">
        <motion.div 
          style={{ x: treeX, y: treeY, scale: treeScale, opacity: treeOpacity }} 
          className="relative w-full h-full flex items-center justify-center will-change-transform"
        >
          <img 
            src="/yggdrasil.png" 
            className="w-[90vw] md:w-[35vw] h-auto object-contain drop-shadow-[0_0_100px_rgba(34,211,238,0.3)]" 
            alt="Yggdrasil"
            // FIX: Tell browser not to decode this lazily — it's above the fold
            loading="eager"
          />
        </motion.div>
      </div>

      {/* --- Section 1: Hero --- */}
      <section 
        id="home" 
        className="relative h-screen flex flex-col items-center justify-center text-center px-4 z-[10] overflow-hidden"
      >
        <div className="absolute top-8 left-6 md:top-12 md:left-12 flex items-center gap-4">
          <span className="[writing-mode:vertical-rl] text-[8px] md:text-[10px] tracking-[0.5em] opacity-30 uppercase font-mono">
            Computer Science
          </span>
          <div className="text-lg md:text-3xl font-serif italic tracking-tighter opacity-90">
            Syafiq Hamdani
          </div>
        </div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={containerVariants} 
          className="flex flex-col items-center w-full"
        >
          <motion.h2 
            style={{ opacity: heroTextOpacity }} 
            variants={itemVariants} 
            className="text-[15vw] md:text-[12vw] font-black leading-none tracking-tighter opacity-10 uppercase select-none relative z-10"
          >
            Portfolio
          </motion.h2>
          
          <motion.div 
            variants={itemVariants} 
            className="flex items-center gap-4 my-4 z-20"
          >
            <span className="text-cyan-400 font-mono text-xs md:text-sm tracking-widest bg-cyan-900/40 px-3 py-1 rounded-sm border border-cyan-400/20">
              西暦 2026
            </span>
          </motion.div>
          
          <motion.h2 
            style={{ opacity: heroTextOpacity }} 
            variants={itemVariants} 
            className="text-[15vw] md:text-[12vw] font-black leading-none tracking-tighter opacity-10 uppercase select-none relative z-30 mt-[-2vh] md:mt-[-12vh] md:ml-[35vw]"
          >
            2026
          </motion.h2>
        </motion.div>

        <div className="absolute bottom-20 md:bottom-0 w-full h-[35vh] flex justify-center items-end overflow-hidden px-4">
          <motion.div 
            style={{ opacity: quoteOpacity }} 
            className="z-40 max-w-[90vw] md:max-w-2xl px-4 italic text-cyan-100 text-xs md:text-xl font-light leading-snug"
          >
            "There is a happiness vibrating in every sketched line, a promise that this masterpiece will begin to breathe shortly."
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: About Me --- */}
      <motion.section 
        id="aboutme" 
        initial="hidden" 
        whileInView="visible" 
        // FIX: amount lowered so animation triggers earlier, feels less janky
        viewport={{ once: true, amount: 0.05 }} 
        variants={containerVariants} 
        className="py-24 md:py-40 px-6 max-w-7xl mx-auto flex flex-col items-center z-[20] relative"
      >
        <div className="absolute -left-6 md:-left-10 top-20 md:top-40 text-cyan-500/10 text-[30vw] md:text-[20vw] font-black select-none pointer-events-none">
          私
        </div>

        <motion.h1 
          variants={itemVariants} 
          className="text-4xl sm:text-6xl md:text-8xl font-black mb-2 tracking-tighter text-white uppercase text-center"
        >
          SYAFIQ HAMDANI
        </motion.h1>
        
        <motion.p 
          variants={itemVariants} 
          className="text-cyan-400 font-mono tracking-[0.2em] md:tracking-[0.3em] mb-12 md:mb-20 text-[10px] md:text-sm uppercase text-center"
        >
          Multimedia Computing | Digital Designer
        </motion.p>
        
        <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-24">
          <motion.div 
            variants={itemVariants} 
            className="w-full md:flex-1 bg-[#1a1c1e]/80 backdrop-blur-xl p-8 md:p-20 rounded-[2rem] border border-white/5"
          >
            <h3 className="text-[10px] md:text-sm font-mono tracking-[0.5em] text-cyan-400 mb-6 uppercase">
              About / 自己紹介
            </h3>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
              I am a motivated and creative Computer Science undergraduate specializing in{" "}
              <span className="text-white font-medium">multimedia computing</span>.
              Seeking opportunities to grow in digital media or IT-related roles.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="w-full max-w-[320px] md:w-[350px] h-[450px] md:h-[480px] z-20 order-1 md:order-2"
            style={{ perspective: "1500px" }}
          >
            <motion.div
              className="relative w-full h-full cursor-grab active:cursor-grabbing"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              style={{ transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              {/* Front */}
              <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10" style={{ backfaceVisibility: "hidden" }}>
                <img src="/syafiq-portrait.png" className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0" alt="Syafiq" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-cyan-400 text-black px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg"
                >
                  Flick to Flip
                </button>
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full bg-[#242628] rounded-[2.5rem] border border-cyan-500/50 p-8 md:p-10 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <div className="relative z-10">
                  <h4 className="text-cyan-400 font-mono text-[9px] md:text-[10px] mb-8 uppercase tracking-widest">Creative Fuel</h4>
                  <div className="space-y-6">
                    {[
                      { title: "Gaming", desc: "Exploring interactive storytelling mechanics." },
                      { title: "Anime", desc: "Studying Japanese visual aesthetics." },
                      { title: "Cooking", desc: "Practicing precision and layering." },
                    ].map((item) => (
                      <div key={item.title}>
                        <p className="text-white font-bold text-md md:text-lg mb-1 flex items-center gap-3">
                          <span className="w-2 h-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee] rounded-full" /> {item.title}
                        </p>
                        <p className="text-slate-400 text-xs md:text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className="w-full py-3 border border-white/10 rounded-xl text-[10px] uppercase font-bold text-slate-400">Return</button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* --- Section 3: Recent --- */}
      <motion.section 
        id="recent" 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.05 }} 
        variants={containerVariants} 
        className="py-24 md:py-32 relative bg-black/20 z-[20]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 
            variants={itemVariants} 
            className="text-[15vw] md:text-[12vw] font-black text-center mb-12 text-white tracking-tighter uppercase"
          >
            RECENT
          </motion.h2>
          
          <div className="sticky top-4 md:top-24 z-40 flex justify-center mb-12 md:mb-20 w-fit mx-auto">
            <div className="flex p-1 bg-[#1a1c1e]/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl">
              {["Project", "Skills", "Certification"].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 md:px-10 py-2.5 md:py-3.5 rounded-full text-[11px] md:text-sm font-bold transition-all z-10 ${
                    activeTab === tab ? "text-black" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {activeTab === tab && <motion.div layoutId="active-tab-bg" className="absolute inset-0 bg-cyan-400 rounded-full" />}
                  <span className="relative z-20">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          {/* --- The New Subscroll Container --- */}
          <div className="min-h-[50vh] max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 md:pr-4 
            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:bg-cyan-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/80 
            [&::-webkit-scrollbar-thumb]:rounded-full transition-colors duration-300"
          >
            <AnimatePresence mode="wait">
              {activeTab === "Project" && (
                <motion.div key="proj" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <motion.div 
                    variants={itemVariants} 
                    className="group bg-[#242628] rounded-3xl overflow-hidden border border-white/5 transition-all hover:scale-[1.02] hover:border-cyan-500/50 shadow-xl cursor-pointer"
                  >
                    <Link href="/projects/trafficsense-ai" className="block w-full h-full">
                      <img src="/yolo-project.png" className="h-48 md:h-64 w-full object-cover" alt="Traffic Detection" loading="lazy" />
                      <div className="p-6 md:p-8">
                        <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest">AI & Computer Vision</span>
                        <h4 className="text-xl md:text-2xl font-bold mt-3 md:mt-4">Traffic Detection (YOLOv7)</h4>
                        <p className="text-slate-400 mt-3 md:mt-4 text-xs md:text-sm leading-relaxed">System with 98% mAP accuracy to support urban planning.</p>
                      </div>
                    </Link>
                  </motion.div>
                  
                  <motion.div 
                    variants={itemVariants} 
                    className="group bg-[#242628] rounded-3xl overflow-hidden border border-white/5 transition-all hover:scale-[1.02] hover:border-purple-500/50 shadow-xl cursor-pointer"
                  >
                    <Link href="/projects/matac-directory" className="block w-full h-full">
                      <img src="/matac-directory.png" className="h-48 md:h-64 w-full object-cover" alt="MATAC Directory" loading="lazy" />
                      <div className="p-6 md:p-8">
                        <span className="text-[10px] text-purple-400 font-mono uppercase tracking-widest">Graphic Design</span>
                        <h4 className="text-xl md:text-2xl font-bold mt-3 md:mt-4">MATAC Directory</h4>
                        <p className="text-slate-400 mt-3 md:mt-4 text-xs md:text-sm leading-relaxed">End-to-end design and high-volume data management.</p>
                      </div>
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="group bg-[#242628] rounded-3xl p-8 md:p-10 border border-white/5 flex flex-col justify-center items-center text-center hover:border-emerald-500/50 transition-all">
                    <h4 className="text-2xl md:text-3xl font-bold">Portfolio 2026</h4>
                    <p className="text-emerald-400 font-mono text-[10px] mt-2 md:mt-3 uppercase tracking-widest">Ongoing</p>
                    <p className="text-slate-400 mt-4 md:mt-6 text-xs md:text-sm">Expanding and Seeking More.</p>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "Skills" && (
                <motion.div key="skills" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-8">
                  {skills.map(skill => (
                    <motion.div key={skill.name} variants={itemVariants} className="flex flex-col items-center group">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-[#2a2c2e] rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-cyan-500">
                        <img src={`/${skill.img}`} className="w-full h-full object-contain" alt={skill.name} loading="lazy" />
                      </div>
                      <span className="mt-2 md:mt-4 text-[9px] md:text-xs font-bold tracking-widest text-slate-500 group-hover:text-white uppercase">{skill.name}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === "Certification" && (
                <motion.div key="cert" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <motion.div key={i} variants={itemVariants} onClick={() => setSelectedCert(`/cert-${i + 1}.png`)} className="aspect-video bg-[#242628] rounded-xl md:rounded-2xl border border-white/5 flex items-center justify-center group relative overflow-hidden shadow-lg hover:border-cyan-500/50 transition-all cursor-pointer">
                      <img src={`/cert-${i + 1}.png`} className="w-full h-full object-cover opacity-80" alt={`Cert ${i + 1}`} loading="lazy" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <span className="text-white text-[9px] md:text-xs font-bold tracking-[0.3em] uppercase">Expand</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div> {/* --- End Subscroll Container --- */}
          
        </div>
      </motion.section>

      {/* --- Section 4: Contact --- */}
      <motion.section id="contact" className="py-24 md:py-40 max-w-5xl mx-auto px-6 relative z-[20]">
        <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-black mb-12 md:mb-20 text-center uppercase tracking-tighter">Contact</motion.h2>
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <motion.div variants={itemVariants} className="space-y-8 md:space-y-10">
            <h3 className="text-2xl md:text-3xl font-bold">Get in Touch</h3>
            <form action="https://formspree.io/f/xreepywr" method="POST" className="space-y-4 md:space-y-6">
              <input name="name" placeholder="Name" className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl md:rounded-2xl focus:border-cyan-500 outline-none transition-all text-sm" required />
              <input name="email" type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl md:rounded-2xl focus:border-cyan-500 outline-none transition-all text-sm" required />
              <textarea name="message" rows={4} placeholder="Send Message" className="w-full bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl md:rounded-2xl focus:border-cyan-500 outline-none transition-all text-sm" required />
              <button type="submit" className="w-full bg-white text-black font-black py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-cyan-400 transition-all uppercase text-xs md:text-sm tracking-widest">Submit</button>
            </form>
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-10 md:space-y-12">
            <h3 className="text-2xl md:text-3xl font-bold">Connect</h3>
            <div className="space-y-4 md:space-y-6">
              <a href="https://www.linkedin.com/in/syfqhmdni" target="_blank" rel="noreferrer" className="p-6 md:p-10 bg-[#242628] rounded-2xl md:rounded-3xl flex items-center gap-6 md:gap-8 hover:bg-[#2a2c2e] transition-all border border-white/5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-600 rounded-lg flex items-center justify-center font-bold text-xl md:text-2xl italic">in</div>
                <div>
                  <p className="text-[9px] md:text-xs opacity-50 font-mono uppercase tracking-widest mb-1">LinkedIn</p>
                  <p className="text-lg md:text-xl font-bold">Lets Connect</p>
                </div>
              </a>
              <div className="p-6 md:p-10 bg-[#242628] rounded-2xl md:rounded-3xl flex items-center gap-6 md:gap-8 border border-white/5">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-sm md:text-lg">Git</div>
                <div>
                  <p className="text-[9px] md:text-xs opacity-50 font-mono uppercase tracking-widest mb-1">GitHub</p>
                  <p className="text-lg md:text-xl font-bold tracking-tighter">LunaeQuinx</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <footer className="py-16 md:py-20 text-center opacity-20 text-[8px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] font-mono px-4 relative z-[20]">
        &copy; 2026 MOHAMAD SYAFIQ HAMDANI | BUILT WITH NEXT.JS & ASGARD MAGIC
      </footer>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={() => setSelectedCert(null)} 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-20"
          >
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20 }} className="relative max-w-5xl w-full aspect-video rounded-xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
              <img src={selectedCert} className="w-full h-full object-contain bg-[#1a1c1e]" alt="Cert" />
              <button onClick={() => setSelectedCert(null)} className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/10">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}