"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Sparkles } from "lucide-react";

const EXPERIENCES = [
    {
        role: "AI & Full-Stack Freelancer",
        company: "Fiverr / Global Clients",
        period: "2026 – Present",
        description: "Building AI agents, intelligent chatbots, and full-stack web apps using vibe coding workflows. Specialized in AI automation via n8n workflows, local LLM integrations (Ollama), and shipping fast with Cursor AI.",
        icon: Sparkles,
        accent: "from-violet-500/20 to-fuchsia-500/20",
    },
    {
        role: "Web Development Intern",
        company: "ESQUAL",
        period: "2025",
        description: "Contributed to full-stack web projects building responsive React frontends and Node.js backends. Applied vibe-coding principles to ship features fast, with hands-on experience on AWS and CI/CD pipelines.",
        icon: Briefcase,
        accent: "from-sky-500/20 to-cyan-500/20",
    }
];

const EDUCATION = [
    {
        degree: "BS Computer Science",
        institution: "SZABIST Islamabad",
        period: "2023 – Present",
        description: "Focusing on advanced AI systems and software engineering while building a strong foundation in computer science and modern development practices.",
        icon: GraduationCap,
        accent: "from-amber-500/20 to-orange-500/20",
    }
];

// Reusable animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
};

export default function About() {
    return (
        <section id="about" className="w-full relative bg-[#0a0a0a] py-16 sm:py-24 md:py-32 scroll-mt-20 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[#8a5cff]/20 blur-[80px] sm:blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#ff5c7a]/15 blur-[80px] sm:blur-[120px]" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
                {/* Section Header */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    variants={fadeInUp}
                    className="mb-10 sm:mb-16 md:mb-24 max-w-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-white/40 to-transparent" />
                        <span className="text-white/40 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium">
                            About Me
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4 sm:mb-6">
                        Engineering <span className="text-white/40 italic">AI-powered</span> digital products.
                    </h2>
                    <p className="text-white/50 text-sm sm:text-base md:text-lg leading-relaxed font-light">
                        I&apos;m a Full-Stack AI Developer who vibe codes — combining the speed of AI-assisted development with deep technical know-how to ship premium web apps and autonomous AI agents. I move fast, build clean, and deliver impact.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">

                    {/* Experience Column */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.h3 variants={fadeInUp} className="flex items-center gap-3 text-xl font-medium text-white mb-10">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-white/[0.08] flex items-center justify-center">
                                <Briefcase size={16} className="text-white/50" />
                            </div>
                            Experience
                        </motion.h3>

                        <div className="space-y-0 relative">
                            {/* Glowing timeline line */}
                            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-violet-500/30 via-white/[0.06] to-transparent" />

                            {EXPERIENCES.map((exp, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="relative flex items-start gap-5 sm:gap-6 group pb-10 last:pb-0"
                                >
                                    {/* Timeline dot */}
                                    <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-[23px] h-[23px] rounded-full bg-[#0a0a0a] border border-white/15 group-hover:border-violet-400/50 transition-all duration-500">
                                        <div className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-violet-400 group-hover:shadow-[0_0_12px_rgba(139,92,246,0.5)] transition-all duration-500" />
                                    </div>

                                    {/* Card */}
                                    <div className="flex-1 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] group-hover:bg-white/[0.04] group-hover:border-white/[0.1] transition-all duration-500 backdrop-blur-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                            <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-white transition-colors">{exp.role}</h4>
                                            <span className="text-xs sm:text-sm text-white/30 font-mono mt-1 sm:mt-0">{exp.period}</span>
                                        </div>
                                        <div className="text-sm font-medium text-white/50 mb-3">{exp.company}</div>
                                        <p className="text-sm text-white/35 leading-relaxed font-light group-hover:text-white/45 transition-colors duration-500">{exp.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Education Column */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                    >
                        <motion.h3 variants={fadeInUp} className="flex items-center gap-3 text-xl font-medium text-white mb-10">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-white/[0.08] flex items-center justify-center">
                                <GraduationCap size={16} className="text-white/50" />
                            </div>
                            Education
                        </motion.h3>

                        <div className="space-y-0 relative">
                            {/* Glowing timeline line */}
                            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-amber-500/30 via-white/[0.06] to-transparent" />

                            {EDUCATION.map((edu, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="relative flex items-start gap-5 sm:gap-6 group pb-10 last:pb-0"
                                >
                                    {/* Timeline dot */}
                                    <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-[23px] h-[23px] rounded-full bg-[#0a0a0a] border border-white/15 group-hover:border-amber-400/50 transition-all duration-500">
                                        <div className="w-2 h-2 rounded-full bg-white/30 group-hover:bg-amber-400 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.5)] transition-all duration-500" />
                                    </div>

                                    {/* Card */}
                                    <div className="flex-1 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] group-hover:bg-white/[0.04] group-hover:border-white/[0.1] transition-all duration-500 backdrop-blur-sm">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                            <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-white transition-colors">{edu.degree}</h4>
                                            <span className="text-xs sm:text-sm text-white/30 font-mono mt-1 sm:mt-0">{edu.period}</span>
                                        </div>
                                        <div className="text-sm font-medium text-white/50 mb-3">{edu.institution}</div>
                                        <p className="text-sm text-white/35 leading-relaxed font-light group-hover:text-white/45 transition-colors duration-500">{edu.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
