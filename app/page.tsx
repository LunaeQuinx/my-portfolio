"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// --- 1. Fireflies Component (Fixed Visibility) ---
const Fireflies = () => {
  const [flies, setFlies] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
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
  const [activeTab, setActiveTab] = useState("Project");
  const { scrollYProgress } = useScroll();
  
  // Hero Gate Logic: Pivot Rotation from corners
  const gateRotateLeft = useTransform(scrollYProgress, [0, 0.1], [0, -45]);
  const gateRotateRight = useTransform(scrollYProgress, [0, 0.1], [0, 45]);
  const gateY = useTransform(scrollYProgress, [0, 0.1], ["0%", "20%"]);
  const quoteOpacity = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);

  const skills = [
    { name: "Java", img: "java.png" }, { name: "C++", img: "cpp.png" }, { name: "Python", img: "python.png" },
    { name: "Photoshop", img: "photoshop.png" }, { name: "Illustrator", img: "illustrator.png" }, { name: "Figma", img: "figma.png" },
    { name: "Premiere", img: "premiere.png" }, { name: "Topaz", img: "topaz.png" }, { name: "Movavi", img: "movavi.png" },
    { name: "Capcut", img: "capcut.png" }, { name: "Canva", img: "canva.png" }, { name: "Picsart", img: "picsart.png" },
    { name: "HTML", img: "html.png" }, { name: "PHP", img: "php.png" }, { name: "NetBeans", img: "netbeans.png" }
  ];

  return (
    <main className="relative min-h-screen bg-[#1a1c1e] text-slate-100 selection:bg-cyan-500/30 font-sans">
      <Fireflies />
      
      {/* --- Side Framing Ferns --- */}
      <div className="fixed left-0 top-0 h-full w-24 pointer-events-none z-[10] opacity-40 overflow-hidden">
        <img src="/fern-leaf.png" className="absolute -left-10 top-0 w-full h-auto object-cover rotate-90" alt="" />
        <img src="/fern-leaf.png" className="absolute -left-10 bottom-0 w-full h-auto object-cover rotate-90" alt="" />
      </div>
      <div className="fixed right-0 top-0 h-full w-24 pointer-events-none z-[10] opacity-40 overflow-hidden">
        <img src="/fern-leaf.png" className="absolute -right-10 top-0 w-full h-auto object-cover -rotate-90 scale-x-[-1]" alt="" />
        <img src="/fern-leaf.png" className="absolute -right-10 bottom-0 w-full h-auto object-cover -rotate-90 scale-x-[-1]" alt="" />
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-8 right-8 z-50 bg-white/5 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 shadow-2xl">
        <div className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em]">
          {["Home", "About Me", "Recent", "Contact"].map((item) => (
            <button key={item} className="hover:text-cyan-400 transition-all duration-300">{item}</button>
          ))}
        </div>
      </nav>

      {/* --- Section 1: Epic Hero --- */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 z-[5]">
        <div className="absolute top-12 left-12 text-3xl font-serif italic tracking-tighter opacity-90">Syafiq Hamdani</div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2 }}>
          <h2 className="text-[14vw] font-black leading-none tracking-tighter opacity-10 uppercase">Portfolio</h2>
          <img src="/yggdrasil.png" className="w-[45vw] md:w-[30vw] my-[-12vh] z-10 relative drop-shadow-[0_0_50px_rgba(34,211,238,0.3)]" alt="Yggdrasil" />
          <h2 className="text-[14vw] font-black leading-none tracking-tighter opacity-10 ml-[25vw] uppercase">2026</h2>
        </motion.div>

        {/* The Gate Ferns */}
        <div className="absolute bottom-0 w-full h-[40vh] flex justify-center items-end overflow-hidden">
          <motion.img style={{ rotate: gateRotateLeft, y: gateY, originX: 0, originY: 1 }} src="/fern-leaf.png" className="w-[60vw] md:w-[40vw] z-30" />
          <motion.div style={{ opacity: quoteOpacity }} className="absolute bottom-20 z-20 max-w-2xl px-8 italic text-cyan-100 text-lg md:text-xl font-light">
            "There is a happiness vibrating in every sketched line, a promise that this masterpiece will begin to breathe shortly."
          </motion.div>
          <motion.img style={{ rotate: gateRotateRight, y: gateY, originX: 1, originY: 1 }} src="/fern-leaf.png" className="w-[60vw] md:w-[40vw] z-30 scale-x-[-1]" />
        </div>
      </section>

      {/* --- Section 2: About Me (Border Break) --- */}
      <section className="py-40 px-6 max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-7xl md:text-8xl font-black mb-2 tracking-tighter text-white">SYAFIQ HAMDANI</h1>
        <p className="text-cyan-400 font-mono tracking-[0.3em] mb-20 text-sm">MULTIMEDIA COMPUTING | DIGITAL DESIGNER</p>
        
        <div className="relative w-full flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Text Container (The Border) */}
          <div className="flex-1 bg-[#2a2c2e] p-12 md:p-20 rounded-[2rem] border border-white/5 shadow-inner relative z-10">
            <h3 className="text-3xl font-bold mb-8 border-b-2 border-white/10 pb-4 inline-block">ABOUT ME</h3>
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              I am a motivated and creative Computer Science undergraduate specializing in <span className="text-white font-medium">multimedia computing</span>. 
              With strong skills in <span className="text-white font-medium">design and video editing</span>, and solid communication abilities. 
              Seeking opportunities to grow in digital media or IT-related roles.
            </p>
          </div>
          
          {/* Portrait (The Border Breaker) */}
          <div className="w-[350px] h-[450px] md:translate-x-[-5%] z-20 group relative">
            <div className="absolute inset-0 bg-cyan-500/20 blur-3xl opacity-0 group-hover:opacity-40 transition-opacity" />
            <img src="/syafiq-portrait.png" className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl grayscale transition-all duration-700 group-hover:grayscale-0" alt="Syafiq Hamdani" />
          </div>
        </div>
      </section>

      {/* --- Section 3: Recent (Sticky Scroll) --- */}
      <section className="py-32 relative bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-[12vw] font-black text-center mb-12 opacity-5 tracking-tighter">RECENT</h2>
          
          <div className="sticky top-24 z-40 flex justify-center gap-6 mb-20 bg-[#1a1c1e]/80 backdrop-blur-lg py-4 rounded-full border border-white/5 w-fit mx-auto px-8">
            {["Project", "Skills", "Certification"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-10 py-2 rounded-full font-bold transition-all ${activeTab === tab ? "bg-white text-black" : "text-slate-500 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "Project" && (
              <motion.div key="proj" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group bg-[#242628] rounded-3xl overflow-hidden border border-white/5 transition-all hover:scale-[1.02] hover:border-cyan-500/50 shadow-xl">
                  <img src="/yolo-project.png" className="h-64 w-full object-cover" />
                  <div className="p-8">
                    <span className="text-xs text-cyan-400 font-mono uppercase tracking-widest">AI & Computer Vision</span>
                    <h4 className="text-2xl font-bold mt-4">Traffic Condition Detection (YOLOv7)</h4>
                    <p className="text-slate-400 mt-4 text-sm leading-relaxed">System with 98% mAP accuracy to support urban planning.</p>
                  </div>
                </div>
                <div className="group bg-[#242628] rounded-3xl overflow-hidden border border-white/5 transition-all hover:scale-[1.02] hover:border-purple-500/50 shadow-xl">
                  <img src="/matac-directory.png" className="h-64 w-full object-cover" />
                  <div className="p-8">
                    <span className="text-xs text-purple-400 font-mono uppercase tracking-widest">Graphic Design</span>
                    <h4 className="text-2xl font-bold mt-4">MATAC Industry Directory</h4>
                    <p className="text-slate-400 mt-4 text-sm leading-relaxed">End-to-end design and high-volume industry data management.</p>
                  </div>
                </div>
                <div className="group bg-[#242628] rounded-3xl p-10 border border-white/5 flex flex-col justify-center items-center text-center hover:border-emerald-500/50 transition-all">
                  <h4 className="text-3xl font-bold">Portfolio 2026</h4>
                  <p className="text-emerald-400 font-mono text-xs mt-3 uppercase tracking-widest">Ongoing</p>
                  <p className="text-slate-400 mt-6 text-sm">Expanding with more Norse themes and interactive animations.</p>
                </div>
              </motion.div>
            )}

            {activeTab === "Skills" && (
              <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-3 md:grid-cols-5 gap-8">
                {skills.map(skill => (
                  <div key={skill.name} className="flex flex-col items-center group">
                    <div className="w-24 h-24 bg-[#2a2c2e] rounded-3xl p-6 border border-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-cyan-500 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                      <img src={`/${skill.img}`} className="w-full h-full object-contain" alt={skill.name} />
                    </div>
                    <span className="mt-4 text-xs font-bold tracking-widest text-slate-500 group-hover:text-white uppercase">{skill.name}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "Certification" && (
  <motion.div key="cert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-3 gap-6">
    {Array.from({ length: 15 }).map((_, i) => (
      <div key={i} className="aspect-video bg-[#242628] rounded-2xl border border-white/5 flex items-center justify-center group relative overflow-hidden shadow-lg hover:border-cyan-500/50 transition-all">
        {/* This line pulls your renamed photos */}
        <img 
          src={`/cert-${i + 1}.png`} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
          alt={`Certificate ${i + 1}`} 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-bold tracking-widest uppercase">View Certificate</span>
        </div>
      </div>
    ))}
  </motion.div>
)}
          </AnimatePresence>
        </div>
      </section>

      {/* --- Section 4: Contact --- */}
      <section className="py-40 max-w-5xl mx-auto px-6">
        <h2 className="text-7xl font-black mb-20 text-center uppercase tracking-tighter">Contact</h2>
        <div className="grid md:grid-cols-2 gap-20">
          <div className="space-y-10">
            <h3 className="text-3xl font-bold">Get in Touch</h3>
            <form action="https://formspree.io/f/YOUR_ID" method="POST" className="space-y-6">
              <input name="name" placeholder="Name" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none transition-all" required />
              <input name="email" type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none transition-all" required />
              <textarea name="message" rows={5} placeholder="Send Message" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none transition-all" required />
              <button type="submit" className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-cyan-400 transition-all uppercase tracking-widest">Submit</button>
            </form>
          </div>
          <div className="space-y-12">
            <h3 className="text-3xl font-bold">Connect</h3>
            <div className="space-y-6">
              <a href="https://www.linkedin.com/in/syfqhmdni" target="_blank" className="p-10 bg-[#242628] rounded-3xl flex items-center gap-8 hover:bg-[#2a2c2e] transition-all border border-white/5">
                <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center font-bold text-2xl italic">in</div>
                <div><p className="text-xs opacity-50 font-mono uppercase tracking-widest mb-1">LinkedIn</p><p className="text-xl font-bold">Lets Connect</p></div>
              </a>
              <div className="p-10 bg-[#242628] rounded-3xl flex items-center gap-8 border border-white/5">
                <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center font-bold text-lg">Git</div>
                <div><p className="text-xs opacity-50 font-mono uppercase tracking-widest mb-1">GitHub</p><p className="text-xl font-bold tracking-tighter">LunaeQuinx</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-20 text-center opacity-20 text-[10px] tracking-[0.5em] font-mono">
        &copy; 2026 MOHAMAD SYAFIQ HAMDANI | BUILT WITH NEXT.JS & ASGARD MAGIC
      </footer>
    </main>
  );
}