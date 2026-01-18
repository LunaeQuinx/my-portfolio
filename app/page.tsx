"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// --- 1. Fireflies Component (Hydration Safe) ---
const Fireflies = () => {
  const [flies, setFlies] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  useEffect(() => {
    setFlies(Array.from({ length: 30 }).map((_, i) => ({
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
          className="absolute w-1 h-1 bg-cyan-200 rounded-full shadow-[0_0_8px_#22d3ee]"
          initial={{ opacity: 0, x: `${fly.x}vw`, y: `${fly.y}vh` }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [`${fly.x}vw`, `${fly.x + (Math.random() - 0.5) * 5}vw`],
            y: [`${fly.y}vh`, `${fly.y + (Math.random() - 0.5) * 5}vh`],
          }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: fly.delay }}
        />
      ))}
    </div>
  );
};

export default function Portfolio() {
  const recentSectionRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Project");

  // --- Scroll Tracking ---
  const { scrollYProgress } = useScroll(); // Global scroll
  const { scrollYProgress: recentScroll } = useScroll({
    target: recentSectionRef,
    offset: ["start start", "end end"]
  });

  // --- Hero Gate Logic (Swing Open like Doors) ---
  const treeScale = useTransform(scrollYProgress, [0, 0.1], [1, 1.4]);
  const gateRotateLeft = useTransform(scrollYProgress, [0, 0.12], [0, -110]);
  const gateRotateRight = useTransform(scrollYProgress, [0, 0.12], [0, 110]);
  const quoteOpacity = useTransform(scrollYProgress, [0.1, 0.18], [0, 1]);

  // --- Sub-Scrolling Tab Logic ---
  useEffect(() => {
    return recentScroll.onChange((latest) => {
      if (latest < 0.3) setActiveTab("Project");
      else if (latest < 0.6) setActiveTab("Skills");
      else setActiveTab("Certification");
    });
  }, [recentScroll]);

  const skills = [
    { name: "Java", img: "java.png" }, { name: "C++", img: "cpp.png" }, { name: "Python", img: "python.png" },
    { name: "Photoshop", img: "photoshop.png" }, { name: "Illustrator", img: "illustrator.png" }, { name: "Figma", img: "figma.png" },
    { name: "Premiere", img: "premiere.png" }, { name: "Topaz", img: "topaz.png" }, { name: "Movavi", img: "movavi.png" },
    { name: "Capcut", img: "capcut.png" }, { name: "Canva", img: "canva.png" }, { name: "Picsart", img: "picsart.png" },
    { name: "HTML", img: "html.png" }, { name: "PHP", img: "php.png" }, { name: "NetBeans", img: "netbeans.png" }
  ];

  const certs = ["cert-1.png", "cert-2.png", "cert-3.png", "cert-4.png", "cert-5.png", "cert-6.png"];

  return (
    <main className="relative min-h-screen bg-[#1a1c1e] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
      <Fireflies />
      
      {/* --- FIXED JUNGLE VIBE FERNS --- */}
      <div className="fixed left-0 top-0 h-full w-[12vw] z-[45] pointer-events-none opacity-60">
        <img src="/fern-left.png" className="h-full w-full object-contain object-left" alt="" />
      </div>
      <div className="fixed right-0 top-0 h-full w-[12vw] z-[45] pointer-events-none opacity-60">
        <img src="/fern-right.png" className="h-full w-full object-contain object-right" alt="" />
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-8 right-8 z-[100] bg-white/5 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10">
        <div className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em]">
          {["Home", "About Me", "Recent", "Contact"].map((item) => (
            <button key={item} className="hover:text-cyan-400 transition-colors">{item}</button>
          ))}
        </div>
      </nav>

      {/* --- SECTION 1: EPIC HERO GATE --- */}
      <section className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[1200px]">
          
          <div className="absolute top-12 left-24 text-3xl font-serif italic opacity-90">Syafiq Hamdani</div>
          
          {/* Background Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <h1 className="text-[18vw] font-black leading-none tracking-tighter opacity-10 uppercase">Portfolio</h1>
            <h2 className="text-[16vw] font-black leading-none tracking-tighter opacity-10 uppercase mt-[-4vw]">2026</h2>
          </div>

          {/* The Tree (Yggdrasil) - Centered & Large */}
          <motion.div style={{ scale: treeScale }} className="relative z-10 w-[45vw] md:w-[30vw] drop-shadow-[0_0_50px_rgba(34,211,238,0.3)]">
            <img src="/yggdrasil.png" className="w-full h-auto" alt="Yggdrasil" />
          </motion.div>

          {/* The Quote (Revealed behind gates) */}
          <motion.div style={{ opacity: quoteOpacity }} className="absolute z-20 max-w-xl px-12 text-center italic text-cyan-50 text-xl font-light drop-shadow-lg">
            "There is a happiness vibrating in every sketched line, a promise that this masterpiece will begin to breathe shortly."
          </motion.div>

          {/* THE GATES (Large Ferns that swing open) */}
          <div className="absolute inset-0 flex z-30 pointer-events-none">
            <motion.div style={{ rotateY: gateRotateLeft, originX: "left" }} className="flex-1 h-full relative">
              <img src="/fern-left.png" className="absolute right-[-20%] bottom-0 w-[140%] h-[110%] object-cover" alt="" />
            </motion.div>
            <motion.div style={{ rotateY: gateRotateRight, originX: "right" }} className="flex-1 h-full relative">
              <img src="/fern-right.png" className="absolute left-[-20%] bottom-0 w-[140%] h-[110%] object-cover" alt="" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: ABOUT ME --- */}
      <section className="py-40 px-6 max-w-7xl mx-auto flex flex-col items-center z-50 relative">
        <h1 className="text-7xl md:text-8xl font-black mb-2 tracking-tighter text-white">SYAFIQ HAMDANI</h1>
        <p className="text-cyan-400 font-mono tracking-[0.3em] mb-20 text-sm">MULTIMEDIA COMPUTING | DIGITAL DESIGNER</p>
        
        <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="flex-1 bg-[#2a2c2e]/80 backdrop-blur-md p-12 md:p-20 rounded-[2rem] border border-white/5 shadow-inner">
            <h3 className="text-3xl font-bold mb-8 border-b-2 border-white/10 pb-4 inline-block">ABOUT ME</h3>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              I am a motivated and creative Computer Science undergraduate specializing in <span className="text-white font-medium">multimedia computing</span>. 
              With strong skills in <span className="text-white font-medium">design and video editing</span>.
            </p>
          </div>
          <div className="w-[350px] h-[450px] group relative">
            <img src="/syafiq-portrait.png" className="w-full h-full object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-700" alt="Syafiq" />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: RECENT (SUB-SCROLLING) --- */}
      <section ref={recentSectionRef} className="relative h-[400vh] bg-black/40">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-10">
          
          <h2 className="text-[12vw] font-black text-center mb-6 text-white tracking-tighter uppercase">Recent</h2>
          
          {/* Tabs (White text style) */}
          <div className="flex gap-10 mb-16 bg-white/5 backdrop-blur-xl py-4 px-10 rounded-full border border-white/10">
            {["Project", "Skills", "Certification"].map((tab) => (
              <span key={tab} className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab ? "text-white" : "text-white/20"}`}>
                {tab}
              </span>
            ))}
          </div>

          {/* Sub-Scrolling Content Area */}
          <div className="w-full max-w-6xl h-[55vh] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                {activeTab === "Project" && (
                  <div className="grid md:grid-cols-2 gap-8 h-full">
                    <div className="bg-[#242628] rounded-3xl overflow-hidden border border-white/10 group">
                      <img src="/yolo-project.png" className="h-64 w-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="p-8"><h4 className="text-2xl font-bold">Traffic Condition Detection (YOLOv7)</h4></div>
                    </div>
                    <div className="bg-[#242628] rounded-3xl overflow-hidden border border-white/10 group">
                      <img src="/matac-directory.png" className="h-64 w-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="p-8"><h4 className="text-2xl font-bold">MATAC Industry Directory</h4></div>
                    </div>
                  </div>
                )}

                {activeTab === "Skills" && (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                    {skills.map(skill => (
                      <div key={skill.name} className="flex flex-col items-center bg-white/5 p-6 rounded-3xl border border-white/5">
                        <img src={`/${skill.img}`} className="w-12 h-12 mb-4 object-contain" alt={skill.name} />
                        <span className="text-[10px] font-bold tracking-tighter uppercase">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "Certification" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto h-full pr-4 custom-scrollbar">
                    {certs.map((img, i) => (
                      <div key={i} className="aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group">
                        <img src={`/${img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={`Certification ${i}`} />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-xs font-mono uppercase">View Certificate</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section className="py-40 max-w-5xl mx-auto px-6 z-50 relative">
        <h2 className="text-7xl font-black mb-20 text-center uppercase tracking-tighter">Contact</h2>
        <div className="grid md:grid-cols-2 gap-20">
          <form className="space-y-6">
            <input placeholder="Name" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" />
            <input placeholder="Email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" />
            <textarea rows={5} placeholder="Message" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" />
            <button className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest">Submit</button>
          </form>
          <div className="space-y-12">
            <div className="p-10 bg-[#242628] rounded-3xl border border-white/5 flex items-center gap-8">
              <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center font-bold text-2xl italic">in</div>
              <div><p className="text-xs opacity-50 uppercase mb-1">LinkedIn</p><p className="text-xl font-bold">Let's Connect</p></div>
            </div>
            <div className="p-10 bg-[#242628] rounded-3xl border border-white/5 flex items-center gap-8">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center font-bold">Git</div>
              <div><p className="text-xs opacity-50 uppercase mb-1">GitHub</p><p className="text-xl font-bold">LunaeQuinx</p></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 text-center opacity-30 text-[10px] tracking-[0.5em] font-mono">
        &copy; 2026 MOHAMAD SYAFIQ HAMDANI | BUILT WITH NEXT.JS & ASGARD MAGIC
      </footer>
    </main>
  );
}