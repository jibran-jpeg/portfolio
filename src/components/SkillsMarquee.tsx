"use client";

import { motion } from "framer-motion";

const skillsRow1 = [
    "React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS",
    "Three.js", "Framer Motion", "Cursor AI", "OpenAI API", "Gemini API",
];

const skillsRow2 = [
    "Claude API", "n8n Workflows", "Agentic AI", "Ollama",
    "Python", "PostgreSQL", "Supabase", "AWS", "Vibe Coding", "C++",
];

// Triple for seamless infinite loop
const marquee1 = [...skillsRow1, ...skillsRow1, ...skillsRow1];
const marquee2 = [...skillsRow2, ...skillsRow2, ...skillsRow2];

export default function SkillsMarquee() {
    return (
        <section className="w-full py-12 sm:py-20 bg-[#0a0a0a] overflow-hidden border-y border-white/[0.04] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-8 md:mb-12">
                <motion.h3
                    initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-white/40 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium"
                >
                    Tech Arsenal
                </motion.h3>
            </div>

            {/* Row 1 — scrolls left */}
            <div className="relative flex overflow-x-hidden w-full mb-3 sm:mb-4">
                <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex whitespace-nowrap gap-3 sm:gap-4 py-2"
                    initial={{ x: 0 }}
                    animate={{ x: "-33.33%" }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    style={{ willChange: "transform" }}
                >
                    {marquee1.map((skill, i) => (
                        <div
                            key={`r1-${skill}-${i}`}
                            className="px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/60 text-sm sm:text-base font-medium tracking-wide hover:bg-white/[0.08] hover:text-white hover:border-white/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-400 cursor-default select-none"
                        >
                            {skill}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Row 2 — scrolls right (opposite direction) */}
            <div className="relative flex overflow-x-hidden w-full">
                <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex whitespace-nowrap gap-3 sm:gap-4 py-2"
                    initial={{ x: "-33.33%" }}
                    animate={{ x: "0%" }}
                    transition={{
                        duration: 35,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    style={{ willChange: "transform" }}
                >
                    {marquee2.map((skill, i) => (
                        <div
                            key={`r2-${skill}-${i}`}
                            className="px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-full border border-white/[0.06] bg-white/[0.02] text-white/60 text-sm sm:text-base font-medium tracking-wide hover:bg-white/[0.08] hover:text-white hover:border-white/20 hover:shadow-[0_0_20px_rgba(251,113,133,0.15)] transition-all duration-400 cursor-default select-none"
                        >
                            {skill}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
