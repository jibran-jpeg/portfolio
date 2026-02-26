"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useScroll } from "framer-motion";
import ScrollyCanvas from "@/components/ScrollyCanvas";
import Overlay from "@/components/Overlay";
import Projects from "@/components/Projects";
import LoadingScreen from "@/components/LoadingScreen";
import ColorBends from "@/components/ColorBends";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import NoiseOverlay from "@/components/NoiseOverlay";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";

export default function Home() {
  const [loadProgress, setLoadProgress] = useState({ loaded: 0, total: 187, done: false });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });


  // Always start from top on page load / reload
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const handleLoadProgress = useCallback((loaded: number, total: number, done: boolean) => {
    setLoadProgress({ loaded, total, done });
  }, []);

  return (
    <main className="min-h-screen bg-[#121212] selection:bg-white/30 selection:text-white">
      {/* Cinematic film grain overlay */}
      <NoiseOverlay />
      <Navbar />
      {/* Full-screen loading overlay — renders ABOVE everything */}
      {!loadProgress.done && (
        <LoadingScreen loaded={loadProgress.loaded} total={loadProgress.total} />
      )}

      {/* Page transition animation wrapper */}
      <PageTransition>
        {/* 
          The hero section is an 800vh relative container.
          We sync scroll progress of this specific container explicitly.
        */}
        <div ref={heroRef} className="relative w-full">
          {/* ScrollyCanvas inherently sets itself to h-[800vh] */}
          <ScrollyCanvas onLoadProgress={handleLoadProgress} />

          {/* Overlay Container: position absolute to fill the 800vh parent */}
          <div className="absolute top-0 left-0 right-0 h-full pointer-events-none">
            {/* Sticky wrapper stays pinned to viewport while scrolling within the 800vh parent */}
            <div className="sticky top-0 h-screen w-full overflow-hidden z-10 flex flex-col justify-center">

              {/* ColorBends blended over the hero video */}
              <div className="absolute inset-0 z-[5] pointer-events-none mix-blend-soft-light opacity-[0.12]">
                <ColorBends
                  colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
                  rotation={0}
                  speed={0.15}
                  scale={1.5}
                  frequency={0.6}
                  warpStrength={0.6}
                  mouseInfluence={0.4}
                  parallax={0.2}
                  noise={0.05}
                  transparent
                  autoRotate={1}
                />
              </div>

              {/* Overlay synchronized to the 800vh parent scroll context */}
              <Overlay progress={scrollYProgress} />
            </div>
          </div>
        </div>

        {/* Projects Grid rendered after the scrolly section */}
        <Projects />

        {/* Contact Section */}
        <Contact />
      </PageTransition>

      {/* Footer */}
      <footer className="w-full py-8 sm:py-12 px-4 sm:px-6 relative z-20 border-t border-white/[0.06] bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/25 text-sm tracking-wide">
            © {new Date().getFullYear()} Jibran Sarwar
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/jibran-jpeg" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:bg-white hover:text-black hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
            </a>
            <a href="https://wa.me/923555123929" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:bg-[#25d366] hover:text-white hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
            </a>
            <a href="mailto:devjibran0@gmail.com" className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:bg-white hover:text-black hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
