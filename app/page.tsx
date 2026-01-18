"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, PanInfo, Variants } from "framer-motion";

// --- 1. TypeScript Interfaces ---
interface Firefly {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

interface Skill {
  name: string;
  img: string;
}

// --- 2. Background Animation: Fireflies ---
const Fireflies = () => {
  const [flies, setFlies] = useState<Firefly[]>([]);

  useEffect(() => {
    setFlies(Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5,
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {flies.map((fly) => (
        <motion.div
          key={fly.id}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"
          initial={{ opacity: 0, x: `${fly.x}vw`, y: `${fly.y}vh` }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [`${fly.x}vw`, `${fly.x + (Math.random() - 0.5) * 5}vw`],
            y: [`${fly.y}vh`, `${fly.y + (Math.random() - 0.5) * 5}vh`],
          }}
          transition={{ duration: fly.duration, repeat: Infinity, delay: fly.delay }}
        />
      ))}
    </div>
  );
};

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>("Project");
  const [activeNav, setActiveNav] = useState<string>("home");
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false); 
  
  const { scrollYProgress } = useScroll();
  const quoteOpacity = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);

  useEffect(() => {
    const sections = ["home", "aboutme", "recent", "contact"];
    const observerOptions = { root: null, threshold: 0.3 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveNav(entry.target.id);
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const skills: Skill[] = [
    { name: "Java", img: "java.png" }, { name: "C++", img: "cpp.png" }, { name: "Python", img: "python.png" },
    { name: "Photoshop", img: "photoshop.png" }, { name: "Illustrator", img: "illustrator.png" }, { name: "Figma", img: "figma.png" },
    { name: "Premiere", img: "premiere.png" }, { name: "Topaz", img: "topaz.png" }, { name: "Movavi", img: "movavi.png" },
    { name: "Capcut", img: "capcut.png" }, { name: "Canva", img: "canva.png" }, { name: "Picsart", img: "picsart.png" },
    { name: "HTML", img: "html.png" }, { name: "PHP", img: "php.png" }, { name: "NetBeans", img: "netbeans.png" }
  ];

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.velocity.x) > 200 || Math.abs(info.offset.x) > 100) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#0a0b0c] text-slate-100 selection:bg-cyan-500/30 font-sans scroll-smooth overflow-x-hidden">
      <Fireflies />
      
      {/* Side Decor */}
      <div className="fixed left-0 top-0 h-full w-24 pointer-events-none z-[10] opacity-20 overflow-hidden">
        <img src="/fern-leaf.png" className="absolute -left-10 top-0 w-full h-auto object-cover rotate-90" alt="" />
        <img src="/fern-leaf.png" className="absolute -left-10 bottom-0 w-full h-auto object-cover rotate-90" alt="" />
      </div>
      <div className="fixed right-0 top-0 h-full w-24 pointer-events-none z-[10] opacity-20 overflow-hidden">
        <img src="/fern-leaf.png" className="absolute -right-10 top-0 w-full h-auto object-cover -rotate-90 scale-x-[-1]" alt="" />
        <img src="/fern-leaf.png" className="absolute -right-10 bottom-0 w-full h-auto object-cover -rotate-90 scale-x-[-1]" alt="" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 right-8 z-50">
        <div className="flex p-1.5 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 shadow-2xl">
          {[
            { label: "Home", id: "home" },
            { label: "About Me", id: "aboutme" },
            { label: "Recent", id: "recent" },
            { label: "Contact", id: "contact" }
          ].map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)}
              className={`relative px-4 md:px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 z-10 ${
                activeNav === item.id ? "text-black" : "text-slate-400 hover:text-white"
              }`}
            >
              {activeNav === item.id && (
                <motion.div layoutId="nav-slider" className="absolute inset-0 bg-white rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
              <span className="relative z-20">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* --- Section 1: Hero (Lightest Dark) --- */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-4 z-[5] bg-[#1a1c1e] overflow-hidden">
        <div className="absolute top-8 left-6 md:top-12 md:left-12 text-xl md:text-3xl font-serif italic tracking-tighter opacity-90">Syafiq Hamdani</div>
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-center justify-center w-full relative z-10">
          <motion.h2 variants={itemVariants} className="text-[10vw] md:text-[12vw] font-black leading-none tracking-tighter opacity-10 uppercase select-none relative z-10">Portfolio</motion.h2>
          <motion.img variants={itemVariants} src="/yggdrasil.png" animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="w-[85vw] md:w-[35vw] my-[-6vh] md:my-[-12vh] z-20 relative drop-shadow-[0_0_80px_rgba(34,211,238,0.3)] mx-auto" alt="Yggdrasil" />
          <motion.h2 variants={itemVariants} className="text-[10vw] md:text-[12vw] font-black leading-none tracking-tighter opacity-10 uppercase select-none relative z-30 mt-[-6vh] md:mt-[-12vh] md:ml-[35vw]">2026</motion.h2>
        </motion.div>
        <div className="absolute bottom-0 w-full h-[35vh] md:h-[45vh] flex justify-center items-end overflow-hidden">
          <motion.div style={{ opacity: quoteOpacity }} className="absolute bottom-16 md:bottom-24 z-40 max-w-[90vw] md:max-w-2xl px-4 italic text-cyan-100 text-sm md:text-xl font-light leading-snug">
            "There is a happiness vibrating in every sketched line, a promise that this masterpiece will begin to breathe shortly."
          </motion.div>
        </div>
      </section>

      {/* --- Section 2: About Me (Medium Dark Contrast) --- */}
      <motion.section id="aboutme" className="bg-[#111214] py-40 px-6 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.h1 initial="hidden" whileInView="visible" variants={itemVariants} className="text-5xl md:text-8xl font-black mb-2 tracking-tighter text-white text-center uppercase">SYAFIQ HAMDANI</motion.h1>
          <motion.p initial="hidden" whileInView="visible" variants={itemVariants} className="text-cyan-400 font-mono tracking-[0.3em] mb-20 text-sm text-center">MULTIMEDIA COMPUTING | DIGITAL DESIGNER</motion.p>
          <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
            <motion.div initial="hidden" whileInView="visible" variants={itemVariants} className="flex-1 bg-[#1a1c1e] p-10 md:p-20 rounded-[2rem] border border-white/5 shadow-2xl relative z-10 order-2 md:order-1">
              <h3 className="text-3xl font-bold mb-8 border-b-2 border-white/10 pb-4 inline-block">ABOUT ME</h3>
              <p className="text-xl text-slate-300 leading-relaxed font-light">
                I am a motivated and creative Computer Science undergraduate specializing in <span className="text-white font-medium">multimedia computing</span>. 
                Seeking opportunities to grow in digital media or IT-related roles.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" variants={itemVariants} className="w-[90vw] max-w-[350px] aspect-[3/4] z-20 order-1 md:order-2" style={{ perspective: "1500px" }}>
              <motion.div className="relative w-full h-full" animate={{ rotateY: isFlipped ? 180 : 0 }} drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} onDragEnd={handleDragEnd} style={{ transformStyle: "preserve-3d" }}>
                <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                  <img src="/syafiq-portrait.png" className="w-full h-full object-cover grayscale hover:grayscale-0 border border-white/10" alt="Syafiq" />
                </div>
                <div className="absolute inset-0 w-full h-full bg-[#1a1c1e] rounded-[2.5rem] border border-cyan-500/50 p-10 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                  <h4 className="text-cyan-400 font-mono text-[10px] tracking-[0.4em] mb-8 uppercase">Creative Fuel</h4>
                  <p className="text-white font-bold text-lg flex items-center gap-3">Gaming, Anime, Cooking.</p>
                  <button onClick={() => setIsFlipped(false)} className="w-full py-3 border border-cyan-500/30 rounded-xl text-[10px] text-slate-400 uppercase tracking-widest">Return</button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* --- Section 3: Recent (Deep Dark Contrast) --- */}
      <motion.section id="recent" className="bg-[#0a0b0c] py-40 relative overflow-hidden border-t border-white/5">
        {/* Atmospheric Glow to create "Section Contrast" like in your photo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90vw] h-[400px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-20">
          <motion.h2 initial="hidden" whileInView="visible" variants={itemVariants} className="text-[12vw] font-black text-center mb-16 text-white tracking-tighter uppercase leading-none"> 
            RECENT 
          </motion.h2>
          
          <motion.div variants={itemVariants} className="sticky top-24 z-40 flex justify-center mb-20 w-fit mx-auto">
            <div className="flex p-1.5 bg-[#1a1c1e]/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl">
              {["Project", "Skills", "Certification"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`relative px-6 md:px-10 py-3.5 rounded-full text-sm font-bold transition-colors z-10 ${activeTab === tab ? "text-black" : "text-slate-500"}`}>
                  {activeTab === tab && <motion.div layoutId="active-tab-bg" className="absolute inset-0 bg-cyan-400 rounded-full" />}
                  <span className="relative z-20">{tab}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === "Project" && (
              <motion.div key="proj" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#1a1c1e] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-all shadow-xl">
                  <div className="aspect-[4/3] w-full overflow-hidden bg-slate-800">
                    <img src="/yolo-project.png" className="h-full w-full object-cover" alt="" />
                  </div>
                  <div className="p-8">
                    <span className="text-[10px] text-cyan-400 font-mono uppercase">AI & Computer Vision</span>
                    <h4 className="text-2xl font-bold mt-2">Traffic Detection</h4>
                  </div>
                </div>
                {/* ... Add other Project cards similarly */}
              </motion.div>
            )}
            {/* ... Skills & Certification Tabs code remains same as previous */}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* --- Section 4: Contact (The Ultimate Contrast) --- */}
      <motion.section id="contact" className="bg-[#1a1c1e] py-40 relative border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2 initial="hidden" whileInView="visible" variants={itemVariants} className="text-[10vw] md:text-8xl font-black mb-24 text-center uppercase tracking-tighter text-white">
            CONTACT
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-20">
            <motion.div initial="hidden" whileInView="visible" variants={itemVariants} className="space-y-10">
              <h3 className="text-3xl font-bold">Get in Touch</h3>
              <form action="#" className="space-y-6">
                <input placeholder="Name" className="w-full bg-black/20 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none" />
                <input type="email" placeholder="Email" className="w-full bg-black/20 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none" />
                <textarea rows={5} placeholder="Send Message" className="w-full bg-black/20 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none" />
                <button className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest">Submit</button>
              </form>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" variants={itemVariants} className="space-y-12">
              <h3 className="text-3xl font-bold">Connect</h3>
              <div className="space-y-6">
                <a href="#" className="p-10 bg-black/20 rounded-3xl flex items-center gap-8 border border-white/5 hover:bg-black/40 transition-all">
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center font-bold">in</div>
                  <div><p className="text-xs opacity-50 font-mono">LinkedIn</p><p className="text-xl font-bold">Lets Connect</p></div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      <footer className="py-20 text-center opacity-20 text-[10px] tracking-[0.5em] font-mono bg-[#0a0b0c]">
        &copy; 2026 MOHAMAD SYAFIQ HAMDANI | BUILT WITH NEXT.JS
      </footer>

      {/* Modal code for Certificates remains same */}
    </main>
  );
}