"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Code2, Sparkles } from "lucide-react";

const EXPERIENCES = [
    {
        role: "AI & Full-Stack Freelancer",
        company: "Fiverr / Global Clients",
        period: "2026 – Present",
        description: "Developing autonomous AI agents, intelligent chatbots, and modern web applications. Specialized in AI automation via n8n workflows and local LLM integrations (Ollama).",
        icon: Sparkles
    },
    {
        role: "Web Development Intern",
        company: "ESQUAL",
        period: "2025",
        description: "Contributed to full-stack web projects building responsive React frontends and Node.js backends. Gained hands-on experience with AWS and CI/CD pipelines.",
        icon: Briefcase
    }
];

const EDUCATION = [
    {
        degree: "BS Computer Science",
        institution: "SZABIST Islamabad",
        period: "2023 – Present",
        description: "Focusing on advanced AI systems and software engineering while building a strong foundation in computer science and modern development practices.",
        icon: GraduationCap
    }
];

// Reusable animation variants
const fadeInUp: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: any = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
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
                    viewport={{ once: true, margin: "-80px" }}
                    variants={fadeInUp}
                    className="mb-10 sm:mb-16 md:mb-24 max-w-2xl"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-[1px] w-8 md:w-16 bg-white/20" />
                        <span className="text-white/40 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium">
                            About Me
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4 sm:mb-6">
                        Engineering <span className="text-white/40 italic">intelligent</span> digital experiences.
                    </h2>
                    <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed font-light">
                        I am a Full-Stack Developer and AI Architect passionate about bridging the gap between cutting-edge artificial intelligence and beautiful, high-performance web applications. I specialize in building autonomous agents and premium digital products.
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
                        <motion.h3 variants={fadeInUp} className="flex items-center gap-3 text-xl font-medium text-white mb-8">
                            <Briefcase size={20} className="text-white/40" />
                            Experience
                        </motion.h3>

                        <div className="space-y-8 relative">
                            {EXPERIENCES.map((exp, i) => (
                                <motion.div key={i} variants={fadeInUp} className="relative flex items-start gap-4 sm:gap-6 group">
                                    <div className="sticky top-24 z-10 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#0a0a0a] border border-white/20 group-hover:border-white/60 group-hover:bg-white/10 transition-colors duration-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors duration-300" />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                            <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-white/90 transition-colors">{exp.role}</h4>
                                            <span className="text-xs sm:text-sm text-white/40 font-mono mt-1 sm:mt-0">{exp.period}</span>
                                        </div>
                                        <div className="text-sm font-medium text-white/60 mb-3">{exp.company}</div>
                                        <p className="text-sm text-white/40 leading-relaxed font-light">{exp.description}</p>
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
                        <motion.h3 variants={fadeInUp} className="flex items-center gap-3 text-xl font-medium text-white mb-8">
                            <GraduationCap size={20} className="text-white/40" />
                            Education
                        </motion.h3>

                        <div className="space-y-8 relative">
                            {EDUCATION.map((edu, i) => (
                                <motion.div key={i} variants={fadeInUp} className="relative flex items-start gap-4 sm:gap-6 group">
                                    <div className="sticky top-24 z-10 flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#0a0a0a] border border-white/20 group-hover:border-white/60 group-hover:bg-white/10 transition-colors duration-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors duration-300" />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                                            <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-white/90 transition-colors">{edu.degree}</h4>
                                            <span className="text-xs sm:text-sm text-white/40 font-mono mt-1 sm:mt-0">{edu.period}</span>
                                        </div>
                                        <div className="text-sm font-medium text-white/60 mb-3">{edu.institution}</div>
                                        <p className="text-sm text-white/40 leading-relaxed font-light">{edu.description}</p>
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
