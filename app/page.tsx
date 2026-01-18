"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, PanInfo, Variants } from "framer-motion";

// --- 1. TypeScript Interfaces ---
interface Firefly {
  id: number;
  x: number;
  y: number;
  delay: number;
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
    })));
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
            x: [`${fly.x}vw`, `${fly.x + (Math.random() - 0.5) * 10}vw`],
            y: [`${fly.y}vh`, `${fly.y + (Math.random() - 0.5) * 10}vh`],
          }}
          transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: fly.delay }}
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
    <main className="relative min-h-screen bg-[#1a1c1e] text-slate-100 selection:bg-cyan-500/30 font-sans scroll-smooth overflow-x-hidden">
      <Fireflies />
      
      {/* Side Decor */}
      <div className="fixed left-0 top-0 h-full w-24 pointer-events-none z-[10] opacity-40 overflow-hidden">
        <img src="/fern-leaf.png" className="absolute -left-10 top-0 w-full h-auto object-cover rotate-90" alt="" />
        <img src="/fern-leaf.png" className="absolute -left-10 bottom-0 w-full h-auto object-cover rotate-90" alt="" />
      </div>
      <div className="fixed right-0 top-0 h-full w-24 pointer-events-none z-[10] opacity-40 overflow-hidden">
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

      {/* Section 1: Hero */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-4 z-[5] overflow-hidden">
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

      {/* Section 2: About Me */}
      <motion.section id="aboutme" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="py-40 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-2 tracking-tighter text-white text-center uppercase">SYAFIQ HAMDANI</motion.h1>
        <motion.p variants={itemVariants} className="text-cyan-400 font-mono tracking-[0.3em] mb-20 text-sm text-center">MULTIMEDIA COMPUTING | DIGITAL DESIGNER</motion.p>
        <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          <motion.div variants={itemVariants} className="flex-1 bg-[#2a2c2e] p-10 md:p-20 rounded-[2rem] border border-white/5 shadow-inner relative z-10 order-2 md:order-1">
            <h3 className="text-3xl font-bold mb-8 border-b-2 border-white/10 pb-4 inline-block">ABOUT ME</h3>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              I am a motivated and creative Computer Science undergraduate specializing in <span className="text-white font-medium">multimedia computing</span>. 
              With strong skills in <span className="text-white font-medium">design and video editing</span>. 
              Seeking opportunities to grow in digital media or IT-related roles.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="w-[90vw] max-w-[350px] aspect-[3/4] z-20 order-1 md:order-2" style={{ perspective: "1500px" }}>
            <motion.div className="relative w-full h-full cursor-grab active:cursor-grabbing" animate={{ rotateY: isFlipped ? 180 : 0, boxShadow: isFlipped ? "0px 0px 40px rgba(34,211,238,0.2)" : "0px 0px 30px rgba(34,211,238,0.15)" }} drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} dragSnapToOrigin={true} onDragEnd={handleDragEnd} style={{ transformStyle: "preserve-3d" }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
                <div className="absolute inset-0 bg-cyan-500/10 blur-3xl" />
                <img src="/syafiq-portrait.png" className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0 border border-white/10" alt="Syafiq" />
                <button onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-cyan-400 text-black px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.6)]">Flick to Flip</button>
              </div>
              <div className="absolute inset-0 w-full h-full bg-[#242628] rounded-[2.5rem] border border-cyan-500/50 p-10 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <div className="relative z-10">
                  <h4 className="text-cyan-400 font-mono text-[10px] tracking-[0.4em] mb-8 uppercase">Creative Fuel</h4>
                  <div className="space-y-6">
                    <div><p className="text-white font-bold text-lg mb-1 flex items-center gap-3"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> Gaming</p><p className="text-slate-400 text-sm">Interactive storytelling.</p></div>
                    <div><p className="text-white font-bold text-lg mb-1 flex items-center gap-3"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> Anime</p><p className="text-slate-400 text-sm">Japanese aesthetics.</p></div>
                    <div><p className="text-white font-bold text-lg mb-1 flex items-center gap-3"><span className="w-2 h-2 bg-cyan-400 rounded-full" /> Cooking</p><p className="text-slate-400 text-sm">Precision arts.</p></div>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className="relative z-10 w-full py-3 border border-cyan-500/30 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">Return</button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Recent (FIXED GRID & ASPECT) */}
      <motion.section id="recent" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 variants={itemVariants} className="text-[12vw] font-black text-center mb-12 text-white tracking-tighter uppercase"> RECENT </motion.h2>
          
          <motion.div variants={itemVariants} className="sticky top-24 z-40 flex justify-center mb-20 w-fit mx-auto">
            <div className="flex p-1.5 bg-[#1a1c1e]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 shadow-2xl">
              {["Project", "Skills", "Certification"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`relative px-6 md:px-10 py-3.5 rounded-full text-sm font-bold transition-colors duration-500 z-10 ${activeTab === tab ? "text-black" : "text-slate-500 hover:text-white"}`}>
                  {activeTab === tab && <motion.div layoutId="active-tab-bg" className="absolute inset-0 bg-cyan-400 rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                  <span className="relative z-20">{tab}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === "Project" && (
              <motion.div key="proj" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <motion.div variants={itemVariants} className="flex flex-col group bg-[#242628] rounded-[2.5rem] overflow-hidden border border-white/5 transition-all hover:scale-[1.02] hover:border-cyan-500/50 shadow-xl">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img src="/yolo-project.png" className="h-full w-full object-cover" alt="" />
                  </div>
                  <div className="p-8 flex-grow">
                    <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-[0.2em]">AI & Computer Vision</span>
                    <h4 className="text-2xl font-bold mt-4 leading-tight">Traffic Condition Detection (YOLOv7)</h4>
                    <p className="text-slate-400 mt-4 text-sm leading-relaxed opacity-80">System with 98% mAP accuracy to support urban planning.</p>
                  </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div variants={itemVariants} className="flex flex-col group bg-[#242628] rounded-[2.5rem] overflow-hidden border border-white/5 transition-all hover:scale-[1.02] hover:border-purple-500/50 shadow-xl">
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img src="/matac-directory.png" className="h-full w-full object-cover" alt="" />
                  </div>
                  <div className="p-8 flex-grow">
                    <span className="text-[10px] text-purple-400 font-mono uppercase tracking-[0.2em]">Graphic Design</span>
                    <h4 className="text-2xl font-bold mt-4 leading-tight">MATAC Industry Directory</h4>
                    <p className="text-slate-400 mt-4 text-sm leading-relaxed opacity-80">End-to-end design and high-volume industry data management.</p>
                  </div>
                </motion.div>

                {/* Card 3 */}
                <motion.div variants={itemVariants} className="flex flex-col justify-center items-center text-center p-10 bg-[#242628] rounded-[2.5rem] border border-white/5 hover:border-emerald-500/50 transition-all min-h-[400px]">
                  <h4 className="text-3xl font-bold tracking-tight">Portfolio 2026</h4>
                  <p className="text-emerald-400 font-mono text-[10px] mt-3 uppercase tracking-[0.3em]">Ongoing</p>
                  <p className="text-slate-400 mt-8 text-sm leading-relaxed max-w-[220px]">Expanding with more Norse themes and interactive animations.</p>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "Skills" && (
              <motion.div key="skills" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="grid grid-cols-2 md:grid-cols-5 gap-8">
                {skills.map(skill => (
                  <motion.div key={skill.name} variants={itemVariants} className="flex flex-col items-center group">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-[#2a2c2e] rounded-3xl p-6 border border-white/5 flex items-center justify-center transition-all group-hover:border-cyan-500 shadow-lg">
                      <img src={`/${skill.img}`} className="w-full h-full object-contain" alt={skill.name} />
                    </div>
                    <span className="mt-4 text-[10px] md:text-xs font-bold tracking-widest text-slate-500 uppercase">{skill.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === "Certification" && (
              <motion.div key="cert" initial="hidden" animate="visible" exit="hidden" variants={containerVariants} className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div key={i} variants={itemVariants} onClick={() => setSelectedCert(`/cert-${i + 1}.png`)} className="aspect-video bg-[#242628] rounded-2xl border border-white/5 overflow-hidden group cursor-pointer">
                    <img src={`/cert-${i + 1}.png`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Cert" />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Section 4: Contact */}
      <motion.section id="contact" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="py-40 max-w-5xl mx-auto px-6">
        <motion.h2 variants={itemVariants} className="text-6xl md:text-7xl font-black mb-20 text-center uppercase tracking-tighter">Contact</motion.h2>
        <div className="grid md:grid-cols-2 gap-20">
          <motion.div variants={itemVariants} className="space-y-10">
            <h3 className="text-3xl font-bold">Get in Touch</h3>
            <form action="https://formspree.io/f/xreepywr" method="POST" className="space-y-6">
              <input name="name" placeholder="Name" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none transition-all" required />
              <input name="email" type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none transition-all" required />
              <textarea name="message" rows={5} placeholder="Send Message" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none transition-all" required />
              <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest">Submit</button>
            </form>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-12">
            <h3 className="text-3xl font-bold">Connect</h3>
            <div className="space-y-6">
              <a href="https://www.linkedin.com/in/syfqhmdni" target="_blank" className="p-10 bg-[#242628] rounded-3xl flex items-center gap-8 border border-white/5 group hover:bg-[#2a2c2e] transition-all">
                <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center font-bold text-2xl italic">in</div>
                <div><p className="text-xs opacity-50 font-mono uppercase tracking-widest">LinkedIn</p><p className="text-xl font-bold">Lets Connect</p></div>
              </a>
              <div className="p-10 bg-[#242628] rounded-3xl flex items-center gap-8 border border-white/5 group">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-lg">Git</div>
                <div><p className="text-xs opacity-50 font-mono uppercase tracking-widest">GitHub</p><p className="text-xl font-bold">LunaeQuinx</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <footer className="py-20 text-center opacity-20 text-[10px] tracking-[0.5em] font-mono">
        &copy; 2026 MOHAMAD SYAFIQ HAMDANI | BUILT WITH NEXT.JS & ASGARD MAGIC
      </footer>

      {/* Modal for Certificates */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCert(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-20 cursor-zoom-out">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
              <img src={selectedCert} className="w-full h-full object-contain bg-[#1a1c1e]" alt="Certificate Detail" />
              <button onClick={() => setSelectedCert(null)} className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}