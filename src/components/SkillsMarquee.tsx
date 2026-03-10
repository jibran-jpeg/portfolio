"use client";

import { motion } from "framer-motion";

const skills = [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "Three.js",
    "Framer Motion",
    "OpenAI API",
    "Gemini API",
    "Claude API",
    "n8n Workflows",
    "Agentic AI",
    "Ollama",
    "Python",
    "PostgreSQL",
    "Supabase",
    "AWS",
];

// Duplicate skills array to create a seamless infinite loop
const marqueeSkills = [...skills, ...skills, ...skills];

export default function SkillsMarquee() {
    return (
        <section className="w-full py-12 sm:py-20 bg-[#0a0a0a] overflow-hidden border-y border-white/[0.04] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-8 md:mb-12">
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-white/40 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium"
                >
                    Tech Arsenal
                </motion.h3>
            </div>

            <div className="relative flex overflow-x-hidden w-full group">
                {/* Left/Right fading gradients for neat edges */}
                <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

                <motion.div
                    className="flex whitespace-nowrap gap-4 sm:gap-6 py-4"
                    initial={{ x: 0 }}
                    animate={{ x: "-33.33%" }} // Moves exactly one full subset
                    transition={{
                        duration: 25,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    style={{ willChange: "transform" }}
                >
                    {marqueeSkills.map((skill, i) => (
                        <div
                            key={`${skill}-${i}`}
                            className="px-6 py-3 sm:px-8 sm:py-4 rounded-full border border-white/5 bg-white/[0.02] text-white/70 text-sm sm:text-base font-medium tracking-wide hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300 cursor-default"
                        >
                            {skill}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
