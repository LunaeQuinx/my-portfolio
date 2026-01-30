"use client";
import { useState, useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";

// --- Types ---
interface Firefly { id: number; x: number; y: number; targetX: number; targetY: number; duration: number; delay: number; }
interface Skill { name: string; img: string; }

// --- 1. Spirit Cursor (Hold List) ---
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

// --- 2. Background Animation: Fireflies ---
const Fireflies = memo(() => {
  const [flies, setFlies] = useState<Firefly[]>([]);
  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100, targetX: (Math.random() - 0.5) * 15,
      targetY: (Math.random() - 0.5) * 15, duration: 5 + Math.random() * 5, delay: Math.random() * 5,
    }));
    setFlies(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {flies.map((fly) => (
        <motion.div
          key={fly.id} className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full shadow-[0_0_12px_#22d3ee]"
          initial={{ opacity: 0, x: `${fly.x}vw`, y: `${fly.y}vh` }}
          animate={{ opacity: [0, 0.8, 0], x: [`${fly.x}vw`, `${fly.x + fly.targetX}vw`], y: [`${fly.y}vh`, `${fly.y + fly.targetY}vh`] }}
          transition={{ duration: fly.duration, repeat: Infinity, delay: fly.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
});

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>("Project");
  const [activeNav, setActiveNav] = useState<string>("home");
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false); 
  
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // --- REFINED TREE LOGIC: Start centered, zoom left to frame, then up ---
  const treeScale = useTransform(scrollYProgress, [0, 0.3, 0.6], [1, 3.2, 3.2]);
  const treeX = useTransform(scrollYProgress, [0, 0.3, 0.6], ["0%", "-55%", "-55%"]); 
  const treeY = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], ["0%", "15%", "15%", "-180%"]);
  const treeOpacity = useTransform(scrollYProgress, [0, 0.15, 0.8], [1, 0.7, 0.7]);
  
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  // --- HORIZONTAL SCROLL LOGIC ---
  const { scrollYProgress: horizontalScroll } = useScroll({ target: horizontalRef });
  const xTranslate = useTransform(horizontalScroll, [0, 1], ["0%", "-66.66%"]);

  useEffect(() => {
    const sections = ["home", "aboutme", "recent", "contact"];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveNav(entry.target.id); });
    }, { threshold: 0.3 });
    sections.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const skills: Skill[] = [
    { name: "Java", img: "java.png" }, { name: "C++", img: "cpp.png" }, { name: "Python", img: "python.png" },
    { name: "Photoshop", img: "photoshop.png" }, { name: "Illustrator", img: "illustrator.png" }, { name: "Figma", img: "figma.png" },
    { name: "Premiere", img: "premiere.png" }, { name: "Topaz", img: "topaz.png" }, { name: "Movavi", img: "movavi.png" },
    { name: "Capcut", img: "capcut.png" }, { name: "Canva", img: "canva.png" }, { name: "Picsart", img: "picsart.png" },
    { name: "HTML", img: "html.png" }, { name: "PHP", img: "php.png" }, { name: "NetBeans", img: "netbeans.png" }
  ];

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#0d0e10] text-slate-100 selection:bg-cyan-500/30 font-sans scroll-smooth cursor-none overflow-x-hidden">
      <SpiritCursor />
      <Fireflies />
      
      {/* THE STICKY TREE - CENTERED IN HERO */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[2]">
        <motion.div style={{ x: treeX, y: treeY, scale: treeScale, opacity: treeOpacity }} className="relative w-full h-full flex items-center justify-center">
          <img src="/yggdrasil.png" className="w-[85vw] md:w-[35vw] h-auto object-contain drop-shadow-[0_0_100px_rgba(34,211,238,0.3)]" alt="Yggdrasil" />
        </motion.div>
      </div>

      {/* 1. HERO SECTION (Original Spacing) */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center z-10 overflow-hidden">
        <div className="absolute top-12 left-12 flex items-center gap-4">
          <span className="[writing-mode:vertical-rl] text-[10px] tracking-[0.5em] opacity-30 uppercase font-mono">Computer Science</span>
          <div className="text-xl md:text-3xl font-serif italic tracking-tighter">Syafiq Hamdani</div>
        </div>
        <motion.div style={{ opacity: heroTextOpacity }} className="flex flex-col items-center text-center">
          <h2 className="text-[12vw] font-black leading-none tracking-tighter uppercase opacity-10">PORTFOLIO</h2>
          <div className="flex items-center gap-4 mt-4">
             <span className="text-cyan-400 font-mono text-sm tracking-widest bg-cyan-900/20 px-2 py-1">西暦 2026</span>
             <h2 className="text-[12vw] font-black leading-none tracking-tighter uppercase opacity-10">2026</h2>
          </div>
        </motion.div>
      </section>

      {/* 2. ABOUT ME (Original Flip-Card Layout) */}
      <motion.section id="aboutme" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="py-40 px-6 max-w-7xl mx-auto flex flex-col items-center z-10 relative">
        <div className="absolute -left-10 top-40 text-cyan-500/10 text-[20vw] font-black select-none pointer-events-none">私</div>
        <motion.h1 variants={itemVariants} className="text-7xl md:text-8xl font-black mb-2 tracking-tighter text-white uppercase">SYAFIQ HAMDANI</motion.h1>
        <motion.p variants={itemVariants} className="text-cyan-400 font-mono tracking-[0.3em] mb-20 text-sm uppercase">Multimedia Computing | Digital Designer</motion.p>
        
        <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          <motion.div variants={itemVariants} className="flex-1 bg-[#1a1c1e]/80 backdrop-blur-xl p-10 md:p-16 rounded-[2rem] border border-white/5 shadow-2xl">
            <h3 className="text-sm font-mono tracking-[0.5em] text-cyan-400 mb-6 uppercase">ABOUT / 自己紹介</h3>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              I am a motivated and creative Computer Science undergraduate specializing in <span className="text-white font-medium">multimedia computing</span>. 
              Merging technical precision with Japanese visual aesthetics to deliver systematic design solutions.
            </p>
          </motion.div>

          {/* THE ORIGINAL FLIP CARD */}
          <motion.div variants={itemVariants} className="w-[350px] h-[480px] z-20" style={{ perspective: "1500px" }}>
            <motion.div className="relative w-full h-full cursor-pointer" animate={{ rotateY: isFlipped ? 180 : 0 }} onClick={() => setIsFlipped(!isFlipped)} transition={{ type: "spring", stiffness: 260, damping: 20 }} style={{ transformStyle: "preserve-3d" }}>
              <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10" style={{ backfaceVisibility: "hidden" }}>
                <img src="/syafiq-portrait.png" className="w-full h-full object-cover grayscale" alt="Syafiq" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-cyan-400 text-black px-6 py-2 rounded-full font-black text-[10px] uppercase shadow-[0_0_20px_#22d3ee]">FLICK TO FLIP</div>
              </div>
              <div className="absolute inset-0 w-full h-full bg-[#242628] rounded-[2.5rem] border border-cyan-500/50 p-10 flex flex-col justify-between shadow-2xl" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <div className="space-y-6">
                  <h4 className="text-cyan-400 font-mono text-[10px] tracking-[0.4em] uppercase">Creative Fuel</h4>
                  <p className="text-white font-bold flex items-center gap-3"><span className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"/> Gaming & Anime</p>
                </div>
                <button className="w-full py-3 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400">Back</button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. RECENT (Horizontal Trunk) */}
      <section id="recent" ref={horizontalRef} className="relative h-[350vh] z-10 bg-black/10">
        <div className="sticky top-0 h-screen w-screen overflow-hidden flex items-center">
          <motion.div style={{ x: xTranslate }} className="flex h-full w-[300vw]">
            
            {/* Panel 1: Projects (Original Cards) */}
            <div className="w-screen h-full flex flex-col items-center justify-center px-10 flex-shrink-0">
               <h2 className="text-[12vw] font-black opacity-5 mb-10 uppercase tracking-tighter">RECENT</h2>
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-10">
                 <div className="bg-[#242628]/95 p-8 rounded-3xl border border-white/5 group hover:border-cyan-500/50 transition-all">
                   <img src="/yolo-project.png" className="h-48 w-full object-cover rounded-2xl mb-6 grayscale group-hover:grayscale-0 transition-all" alt="" />
                   <h4 className="text-2xl font-bold uppercase tracking-tighter">Traffic Detection</h4>
                   <p className="text-slate-400 mt-4 text-sm leading-relaxed">System with 98% mAP accuracy developed in Jan 2026.</p>
                 </div>
                 <div className="bg-[#242628]/95 p-8 rounded-3xl border border-white/5 group hover:border-purple-500/50 transition-all">
                   <img src="/matac-directory.png" className="h-48 w-full object-cover rounded-2xl mb-6 grayscale group-hover:grayscale-0 transition-all" alt="" />
                   <h4 className="text-2xl font-bold uppercase tracking-tighter">MATAC Directory</h4>
                   <p className="text-slate-400 mt-4 text-sm leading-relaxed">End-to-end design for textile manufacturers.</p>
                 </div>
                 <div className="bg-[#242628]/95 p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center text-center">
                   <h4 className="text-2xl font-bold uppercase tracking-widest">Portfolio 2026</h4>
                   <p className="text-emerald-400 font-mono text-[10px] mt-2 tracking-widest">ONGOING</p>
                 </div>
               </div>
            </div>

            {/* Panel 2: Skills (Original Grid) */}
            <div className="w-screen h-full flex flex-col items-center justify-center px-10 flex-shrink-0">
              <h2 className="text-[12vw] font-black opacity-5 mb-10 uppercase tracking-tighter">SKILLS</h2>
              <div className="grid grid-cols-5 gap-8 max-w-5xl px-10">
                {skills.map(skill => (
                  <div key={skill.name} className="flex flex-col items-center group">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-cyan-400 transition-all">
                      <img src={`/${skill.img}`} className="w-full h-full object-contain" alt={skill.name} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Certifications */}
            <div className="w-screen h-full flex flex-col items-center justify-center px-10 flex-shrink-0">
              <h2 className="text-[12vw] font-black opacity-5 mb-10 uppercase tracking-tighter">CERTS</h2>
              <div className="grid grid-cols-3 gap-6 max-w-6xl px-10">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-video bg-white/5 rounded-2xl border border-white/5 overflow-hidden group cursor-pointer">
                    <img src={`/cert-${i}.png`} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" alt="" />
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* 4. CONTACT (Original Two-Column Layout) */}
      <section id="contact" className="py-40 max-w-7xl mx-auto px-6 z-30 relative">
        <h2 className="text-[12vw] font-black mb-20 text-center uppercase tracking-tighter">CONTACT</h2>
        <div className="grid md:grid-cols-2 gap-20">
          <div className="space-y-10">
            <h3 className="text-4xl font-bold uppercase">Get in Touch</h3>
            <form className="space-y-6">
              <input placeholder="Name" className="w-full bg-[#1a1c1e] border border-white/10 p-6 rounded-2xl outline-none focus:border-cyan-400 transition-all" />
              <input placeholder="Email" className="w-full bg-[#1a1c1e] border border-white/10 p-6 rounded-2xl outline-none focus:border-cyan-400 transition-all" />
              <textarea rows={4} placeholder="Send Message" className="w-full bg-[#1a1c1e] border border-white/10 p-6 rounded-2xl outline-none focus:border-cyan-400 transition-all" />
              <button className="w-full bg-white text-black font-black py-6 rounded-2xl uppercase hover:bg-cyan-400 transition-colors">SUBMIT</button>
            </form>
          </div>
          <div className="space-y-12">
            <h3 className="text-4xl font-bold uppercase">Connect</h3>
            <div className="space-y-6">
              <div className="p-10 bg-[#1a1c1e] rounded-3xl flex items-center gap-6 border border-white/5">
                <div className="bg-cyan-600 p-4 rounded-xl font-bold">in</div>
                <div><p className="text-xs opacity-50 uppercase font-mono tracking-widest">LINKEDIN</p><p className="text-2xl font-bold">Lets Connect</p></div>
              </div>
              <div className="p-10 bg-[#1a1c1e] rounded-3xl flex items-center gap-6 border border-white/5">
                <div className="bg-slate-700 p-4 rounded-xl font-bold">Git</div>
                <div><p className="text-xs opacity-50 uppercase font-mono tracking-widest">GITHUB</p><p className="text-2xl font-bold">LunaeQuinx</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center opacity-10 text-[9px] tracking-[0.6em] font-mono uppercase">
        &copy; 2026 MOHAMAD SYAFIQ HAMDANI | MULTIMEDIA COMPUTING
      </footer>
    </main>
  );
}