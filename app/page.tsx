"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// --- Components ---

const Fireflies = () => {
  const [flies, setFlies] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  useEffect(() => {
    const newFlies = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setFlies(newFlies);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {flies.map((fly) => (
        <motion.div
          key={fly.id}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"
          initial={{ opacity: 0, x: `${fly.x}%`, y: `${fly.y}%` }}
          animate={{
            opacity: [0, 0.7, 0],
            x: [`${fly.x}%`, `${fly.x + (Math.random() - 0.5) * 5}%`],
            y: [`${fly.y}%`, `${fly.y + (Math.random() - 0.5) * 5}%`],
          }}
          transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: fly.delay }}
        />
      ))}
    </div>
  );
};

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("Project");
  const { scrollYProgress } = useScroll();
  
  // Fern Opening Logic
  const fernXLeft = useTransform(scrollYProgress, [0, 0.15], ["0%", "-100%"]);
  const fernXRight = useTransform(scrollYProgress, [0, 0.15], ["0%", "100%"]);
  const quoteOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  const skills = ["Java", "C++", "Python", "Adobe Photoshop", "Illustrator", "Figma", "Adobe Premiere", "Topaz Video", "Movavi", "Capcut", "Canva", "Picsart", "HTML", "PHP", "NetBeans"];

  return (
    <main className="relative min-h-screen bg-[#1a1c1e] text-slate-100 overflow-x-hidden selection:bg-cyan-500/30 font-sans">
      <Fireflies />
      
      {/* Fixed Side Ferns (Visual Texture) */}
      <img src="/fern-leaf.png" className="fixed left-[-50px] top-1/2 -translate-y-1/2 w-40 opacity-20 z-10 pointer-events-none rotate-12" alt="" />
      <img src="/fern-leaf.png" className="fixed right-[-50px] top-1/2 -translate-y-1/2 w-40 opacity-20 z-10 pointer-events-none -rotate-12 scale-x-[-1]" alt="" />

      {/* Navigation */}
      <nav className="fixed top-8 right-8 z-50 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
        <div className="flex gap-8 text-sm font-medium uppercase tracking-widest">
          {["Home", "About Me", "Recent", "Contact"].map((item) => (
            <button key={item} className="hover:text-cyan-400 transition-colors">{item}</button>
          ))}
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-10 left-10 text-2xl font-serif italic opacity-80">Syafiq Hamdani</div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          <h2 className="text-[12vw] font-black leading-none tracking-tighter opacity-10">PORTFOLIO</h2>
          <img src="/yggdrasil.png" className="w-64 md:w-80 my-[-10vh] drop-shadow-[0_0_25px_rgba(34,211,238,0.2)]" alt="Yggdrasil" />
          <h2 className="text-[12vw] font-black leading-none tracking-tighter opacity-10 ml-[20vw]">2026</h2>
        </motion.div>

        {/* Scrolling Ferns & Quote */}
        <div className="absolute bottom-0 w-full flex justify-center items-end h-40 overflow-hidden">
          <motion.img style={{ x: fernXLeft }} src="/fern-leaf.png" className="w-1/2 md:w-1/4 z-20" />
          <motion.div style={{ opacity: quoteOpacity }} className="absolute bottom-10 z-10 max-w-xl px-6 italic text-cyan-200">
            "There is a happiness vibrating in every sketched line, a promise that this masterpiece will begin to breathe shortly."
          </motion.div>
          <motion.img style={{ x: fernXRight }} src="/fern-leaf.png" className="w-1/2 md:w-1/4 z-20 scale-x-[-1]" />
        </div>
      </section>

      {/* Section 2: About Me */}
      <section className="py-32 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-6">
          <h2 className="text-5xl font-bold border-b-4 border-cyan-500 inline-block">ABOUT ME</h2>
          <p className="text-xl text-slate-400 leading-relaxed">
            I am a motivated and creative Computer Science undergraduate specializing in **Multimedia Computing**. 
            With strong skills in AI-driven detection and professional design, I seek opportunities to grow in digital media or IT-related roles.
          </p>
        </div>
        <div className="w-80 h-96 rounded-3xl overflow-hidden border-2 border-white/10 relative group">
          <div className="absolute inset-0 bg-cyan-500/10 group-hover:opacity-0 transition-opacity" />
          <img src="/syafiq-portrait.png" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Syafiq Hamdani" />
        </div>
      </section>

      {/* Section 3: Recent (Nested Tabs) */}
      <section className="py-32 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-6xl font-bold text-center mb-16 opacity-20">RECENT</h2>
          
          <div className="flex justify-center gap-4 mb-12">
            {["Project", "Skills", "Certification"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-8 py-2 rounded-full border transition-all ${activeTab === tab ? "bg-white text-black" : "border-white/20 hover:border-cyan-500 text-slate-400"}`}>
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "Project" && (
              <motion.div key="proj" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-colors">
                  <img src="/yolo-project.png" className="h-48 w-full object-cover" />
                  <div className="p-6">
                    <span className="text-xs text-cyan-400 font-mono">AI & VISION</span>
                    <h4 className="text-xl font-bold mt-2">Traffic Detection YOLOv7</h4>
                    <p className="text-sm text-slate-400 mt-2">Achieved 98% mAP accuracy for smart city applications.</p>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-colors">
                  <img src="/matac-directory.png" className="h-48 w-full object-cover" />
                  <div className="p-6">
                    <span className="text-xs text-purple-400 font-mono">PUBLICATION</span>
                    <h4 className="text-xl font-bold mt-2">MATAC Directory Book</h4>
                    <p className="text-sm text-slate-400 mt-2">End-to-end design and high-volume data management for industry listing.</p>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition-colors p-6 flex flex-col justify-center">
                  <h4 className="text-2xl font-bold">Portfolio 2026</h4>
                  <p className="text-emerald-400 font-mono text-sm mt-2">ONGOING DEVELOPMENT</p>
                  <p className="text-sm text-slate-400 mt-4 italic">Regularly updated with new features and Norse-inspired microinteractions.</p>
                </div>
              </motion.div>
            )}

            {activeTab === "Skills" && (
              <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap justify-center gap-4">
                {skills.map(skill => (
                  <span key={skill} className="px-6 py-3 bg-slate-900 rounded-xl border border-white/5 text-slate-300 hover:text-cyan-400 transition-colors">
                    {skill}
                  </span>
                ))}
              </motion.div>
            )}

            {activeTab === "Certification" && (
              <motion.div key="cert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-slate-800 rounded-lg border border-white/10 flex items-center justify-center text-xs text-slate-600 font-mono">
                    CERTIFICATE_{i+1}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Section 4: Contact */}
      <section className="py-32 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold mb-16 uppercase tracking-widest">Contact</h2>
        <div className="grid md:grid-cols-2 gap-16 text-left">
          <form action="https://formspree.io/f/YOUR_ID" method="POST" className="space-y-4">
            <input name="name" placeholder="Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-cyan-500 outline-none" required />
            <input name="email" type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-cyan-500 outline-none" required />
            <textarea name="message" rows={4} placeholder="Send Message" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-cyan-500 outline-none" required />
            <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-cyan-500 transition-colors">SUBMIT</button>
          </form>
          <div className="space-y-8 flex flex-col justify-center">
            <a href="https://www.linkedin.com/in/syfqhmdni" target="_blank" className="p-6 bg-slate-900 rounded-2xl flex items-center gap-4 hover:bg-slate-800 transition-colors">
              <span className="text-3xl">in</span>
              <div><p className="text-sm opacity-50 font-mono">LINKEDIN</p><p className="font-bold">Let's Connect</p></div>
            </a>
            <div className="p-6 bg-slate-900 rounded-2xl flex items-center gap-4">
              <span className="text-3xl">git</span>
              <div><p className="text-sm opacity-50 font-mono">GITHUB</p><p className="font-bold text-xl uppercase tracking-tighter">LunaeQuinx</p></div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-10 text-center opacity-30 text-xs tracking-widest font-mono">
        &copy; 2026 MOHAMAD SYAFIQ HAMDANI
      </footer>
    </main>
  );
}