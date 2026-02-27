"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Briefcase, GraduationCap, Sparkles } from "lucide-react";

const PROJECTS = [
    {
        id: 1,
        title: "GeoLead — Maps Lead Finder",
        category: "Chrome Extension",
        description: "Built a Google Chrome Extension that scrapes Google Maps for business leads by location, extracting contacts, emails, and phone numbers with automated scrolling and smart deduplication.",
        link: "https://github.com/jibran-jpeg",
    },
    {
        id: 2,
        title: "AI Voice & Chat Integration",
        category: "AI & Automation",
        description: "Built and deployed autonomous AI agents using GPT, Gemini & Claude APIs, capable of handling calls and chats, fully integrated with backend systems via n8n.",
        link: "https://github.com/jibran-jpeg",
    },
    {
        id: 3,
        title: "The Skardu Basket",
        category: "Full-Stack Web",
        description: "Developed a premium e-commerce interface focusing on modern aesthetic 'Vibe Code', Glassmorphism, and Neumorphism.",
        link: "https://jibran-jpeg.github.io/the-skardu-basket/",
    },
    {
        id: 4,
        title: "Intelligent Chatbots via Ollama",
        category: "Agentic AI",
        description: "Developing complex n8n workflows connecting AI agents with databases, CRMs, and social media platforms for Fiverr clients.",
        link: "https://github.com/jibran-jpeg",
    },
    {
        id: 5,
        title: "PK Tours",
        category: "Web Development",
        description: "Premium trekking expeditions through Northern Pakistan's Karakoram range. Designed and developed to showcase Hunza, Skardu, Gilgit, and beyond.",
        link: "https://jibran-jpeg.github.io/pk-tours/",
    },
];

const SKILLS = [
    "AI & Automation", "AI Voice Agents", "n8n Workflows", "Agentic AI", "Ollama",
    "OpenAI GPT API", "Gemini API", "Claude API", "API Integration",
    "React", "Next.js", "Three.js", "Node.js", "Flutter", "Tailwind CSS",
    "Python", "C++", "C", "AWS", "Chrome Extensions",
    "Supabase", "PostgreSQL", "Firebase"
];

const EXPERIENCE = [
    {
        role: "Web Development Intern",
        company: "ESQUAL",
        period: "2025",
        location: "Islamabad, PK",
        description: "Worked on full-stack web development projects, building responsive frontends with React and Node.js backends. Gained hands-on experience with AWS deployment, CI/CD pipelines, and industry-level software development practices.",
        icon: Briefcase,
    },
    {
        role: "AI & Full-Stack Freelancer",
        company: "Fiverr & Local Clients",
        period: "2025 – Present",
        location: "Global & Pakistan",
        description: "Developing and deploying AI Chatbots and AI Voice Calling systems on Fiverr. Building complex n8n workflows to connect AI agents with CRM, databases, and social media. Also handling local clients for web development and AI automation solutions.",
        icon: Sparkles,
    },
];

// Stagger children animation
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
    },
};

export default function Projects() {
    return (
        <section id="projects" className="relative w-full bg-[#0a0a0a] z-20 overflow-hidden">
            {/* Lightweight CSS gradient background instead of heavy WebGL */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#8a5cff]/20 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ff5c7a]/15 blur-[120px]" />
            </div>

            {/* Top fade from hero into this section */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#121212] to-transparent z-[1]" />

            <div className="relative z-10">

                {/* ─── Experience & Skills ─── */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16 pt-24 sm:pt-40 pb-20 sm:pb-32">
                    <div id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                        {/* Experience Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">Career</p>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-10">
                                Experience
                            </h2>

                            <div className="space-y-6">
                                {EXPERIENCE.map((exp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                                        className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition-colors duration-300">
                                                <exp.icon size={18} className="text-white/50" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="font-semibold text-white text-base">{exp.role}</h3>
                                                </div>
                                                <p className="text-white/50 text-sm mb-3">
                                                    {exp.company} <span className="text-white/20 mx-1.5">·</span> {exp.location} {exp.period && <><span className="text-white/20 mx-1.5">·</span> <span className="text-white/40">{exp.period}</span></>}
                                                </p>
                                                <p className="text-white/40 text-sm leading-relaxed">{exp.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Skills Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">Stack</p>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-10">
                                Technical Arsenal
                            </h2>

                            <motion.div
                                className="flex flex-wrap gap-2.5"
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                            >
                                {SKILLS.map((skill, index) => (
                                    <motion.span
                                        key={index}
                                        variants={itemVariants}
                                        className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/60 text-sm hover:bg-white/[0.08] hover:text-white/90 hover:border-white/[0.15] transition-all duration-300 cursor-default"
                                    >
                                        {skill}
                                    </motion.span>
                                ))}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                className="mt-10 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                                        <GraduationCap size={18} className="text-white/50" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-base mb-1">BS Computer Science</h3>
                                        <p className="text-white/50 text-sm mb-3">SZABIST, Islamabad · In Progress</p>
                                        <p className="text-white/35 text-sm leading-relaxed italic">
                                            &quot;Co-founding a Software House specializing in AI-driven automation, with plans to pursue a Master&apos;s in Europe to specialize in Advanced AI Systems.&quot;
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                                className="mt-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                                        <GraduationCap size={18} className="text-white/50" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white text-base mb-1">Higher Secondary Education</h3>
                                        <p className="text-white/50 text-sm">Public School and College · Skardu, Gilgit-Baltistan</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* ─── Thin Separator ─── */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16">
                    <div className="h-px bg-white/[0.06]" />
                </div>

                {/* ─── Projects Section ─── */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16 pt-20 sm:pt-32 pb-24 sm:pb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-16"
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">Portfolio</p>
                        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3">
                            Selected Work
                        </h2>
                        <p className="text-white/35 text-base max-w-lg leading-relaxed">
                            Recent projects focusing on AI integration, automated workflows, and modern web aesthetics.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {PROJECTS.map((project, idx) => (
                            <motion.a
                                key={project.id}
                                href={project.link}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.9, delay: idx * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                                className="group relative block p-5 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
                            >
                                <div className="flex flex-col h-full justify-between min-h-[160px] sm:min-h-[200px]">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors duration-300">
                                            {project.category}
                                        </span>
                                        <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                            <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-black transition-colors duration-300" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-2 group-hover:text-white transition-colors duration-300">
                                            {project.title}
                                        </h3>
                                        <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/50 transition-colors duration-300">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
