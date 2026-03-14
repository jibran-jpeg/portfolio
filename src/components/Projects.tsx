"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "GeoLead — Maps Lead Finder",
    category: "Chrome Extension",
    description:
      "Built a Google Chrome Extension that scrapes Google Maps for business leads by location, extracting contacts, emails, and phone numbers with automated scrolling and smart deduplication.",
    link: "https://github.com/jibran-jpeg",
    tags: ["JavaScript", "Chrome API", "DOM Scraping"],
  },
  {
    id: 2,
    title: "AI Voice & Chat Integration",
    category: "AI & Automation",
    description:
      "Built and deployed autonomous AI agents using GPT, Gemini & Claude APIs, capable of handling calls and chats, fully integrated with backend systems via n8n.",
    link: "https://github.com/jibran-jpeg",
    tags: ["OpenAI", "n8n", "Node.js"],
  },
  {
    id: 3,
    title: "The Skardu Basket",
    category: "Full-Stack Web",
    description:
      "Vibe coded a premium e-commerce interface focusing on modern aesthetics, Glassmorphism, and Neumorphism.",
    link: "https://jibran-jpeg.github.io/the-skardu-basket/",
    tags: ["React", "Tailwind CSS", "UI/UX"],
  },
  {
    id: 4,
    title: "Intelligent Chatbots via Ollama",
    category: "Agentic AI",
    description:
      "Building complex n8n workflows connecting autonomous AI agents with databases, CRMs, and APIs for global clients.",
    link: "https://github.com/jibran-jpeg",
    tags: ["Ollama", "Local LLMs", "Automation"],
  },
  {
    id: 5,
    title: "PK Tours",
    category: "Web Development",
    description:
      "Premium trekking expeditions through Northern Pakistan's Karakoram range. Designed and developed to showcase Hunza, Skardu, Gilgit, and beyond.",
    link: "https://jibran-jpeg.github.io/pk-tours/",
    tags: ["HTML5", "CSS3", "JavaScript"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full bg-[#0a0a0a] z-20 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] rounded-full bg-[#8a5cff]/20 blur-[80px] sm:blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#ff5c7a]/15 blur-[80px] sm:blur-[120px]" />
      </div>

      {/* Top fade from hero into this section */}
      <div className="relative z-10 pt-24 sm:pt-40 pb-0">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#121212] to-transparent z-[1]" />

        {/* ─── Projects Section ─── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-16 pb-16 sm:pb-24 md:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-white/40 to-transparent" />
              <span className="text-xs uppercase tracking-[0.3em] text-white/30">
                Portfolio
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2 sm:mb-3">
              Selected Work
            </h2>
            <p className="text-white/35 text-sm sm:text-base max-w-lg leading-relaxed">
              Recent projects focusing on AI integration, autonomous agents,
              and vibe-coded modern web applications.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            {PROJECTS.map((project, idx) => (
              <motion.a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className={`group relative block rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 overflow-hidden ${
                  idx === PROJECTS.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                {/* Top accent gradient line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover shine sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rotate-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out" />
                </div>

                <div className="relative p-4 sm:p-5 md:p-7">
                  <div className="flex flex-col h-full justify-between min-h-[140px] sm:min-h-[160px] md:min-h-[200px]">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className="text-white/10 text-2xl sm:text-3xl font-black font-mono tabular-nums group-hover:text-white/20 transition-colors duration-500">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors duration-300">
                          {project.category}
                        </span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:bg-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-400">
                        <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-black transition-colors duration-300" />
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90 mb-2 group-hover:text-white transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/50 transition-colors duration-300 mb-4">
                        {project.description}
                      </p>
                      {/* Tech Stack Tags */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.04]">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-white/40 px-2.5 py-1 bg-white/[0.02] rounded-lg border border-white/[0.06] group-hover:bg-white/[0.06] group-hover:border-white/[0.1] group-hover:text-white/60 transition-all duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
