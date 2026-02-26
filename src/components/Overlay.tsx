"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

const TAGLINES = ["Full-Stack Developer", "AI Architect", "UI/UX Specialist"];

// Unified, slower, more elegant rise-up variants
const heroContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const elegantFadeUp = {
    hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const },
    },
};

// Section 2 & 3 scroll-triggered variants (matching the elegant vibe)
const sectionSlideUp = {
    hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] as const },
    },
};

const sectionSubtext = {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
    },
};

export default function Overlay({ progress, revealed = true }: { progress?: MotionValue<number>; revealed?: boolean }) {
    const { scrollYProgress: defaultScroll } = useScroll();
    const scrollYProgress = progress || defaultScroll;

    // Opacities – each section fades in and out cleanly
    const opacity1 = useTransform(scrollYProgress, [0, 0.06, 0.1, 0.14], [1, 1, 0, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.28, 0.4, 0.48], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.63, 0.85, 0.92], [0, 1, 1, 0]);

    // Visibility – hard-hide sections when opacity is 0
    const vis1 = useTransform(scrollYProgress, (v) => (v <= 0.14 ? "visible" : "hidden") as "visible" | "hidden");
    const vis2 = useTransform(scrollYProgress, (v) => (v >= 0.2 && v <= 0.48 ? "visible" : "hidden") as "visible" | "hidden");
    const vis3 = useTransform(scrollYProgress, (v) => (v >= 0.55 && v <= 0.92 ? "visible" : "hidden") as "visible" | "hidden");

    // Y Transforms (Parallax)
    const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.48], [60, -60]);
    const y3 = useTransform(scrollYProgress, [0.55, 0.92], [40, -40]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center px-4 sm:px-6 md:px-24">
            {/* Section 1 — Name & Taglines with staggered rise-up */}
            <motion.div
                style={{ opacity: opacity1, y: y1, visibility: vis1 }}
                className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 pb-12 sm:pb-24"
            >
                <motion.div
                    variants={heroContainer}
                    initial="hidden"
                    animate={revealed ? "visible" : "hidden"}
                    className="flex flex-col items-center"
                >
                    <motion.h1
                        variants={elegantFadeUp}
                        className="text-[2.5rem] leading-tight sm:text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tighter text-white mb-3 sm:mb-6 drop-shadow-2xl"
                    >
                        Jibran <span className="opacity-80">Sarwar.</span>
                    </motion.h1>

                    <motion.div
                        variants={heroContainer} // Use the parent config for stagger
                        className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
                    >
                        {TAGLINES.map((tag) => (
                            <motion.span
                                key={tag}
                                variants={elegantFadeUp} // Then animate each pill individually
                                className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[9px] sm:text-[10px] md:text-xs font-body tracking-[0.12em] sm:tracking-[0.15em] text-[#a0a0a0] uppercase"
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Section 2 — slides up from bottom on scroll */}
            <motion.div
                style={{ opacity: opacity2, y: y2, visibility: vis2 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-8 md:px-32 text-center sm:text-right sm:items-end"
            >
                <motion.h2
                    variants={sectionSlideUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-xl sm:text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-white max-w-2xl leading-[1.2] sm:leading-[1.15] drop-shadow-xl"
                >
                    Building high-vibe digital products.
                </motion.h2>
                <motion.p
                    variants={sectionSubtext}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-3 sm:mt-6 text-xs sm:text-base md:text-lg text-white/40 max-w-lg font-body font-light leading-relaxed"
                >
                    Integrating GPT, Gemini &amp; Claude APIs into production apps. Building with React, Three.js, Node.js, Python &amp; C++, deployed on AWS.
                </motion.p>
            </motion.div>

            {/* Section 3 — slides up from bottom on scroll */}
            <motion.div
                style={{ opacity: opacity3, y: y3, visibility: vis3 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-8 md:px-32 text-center sm:text-left sm:items-start"
            >
                <motion.h2
                    variants={sectionSlideUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="text-xl sm:text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-white max-w-2xl leading-[1.2] sm:leading-[1.15] drop-shadow-xl"
                >
                    Crafting the Future of <br className="hidden lg:block" />
                    <span className="text-white/50 italic font-light">Autonomous AI.</span>
                </motion.h2>
                <motion.p
                    variants={sectionSubtext}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-3 sm:mt-6 text-xs sm:text-base md:text-lg text-white/40 max-w-lg font-body font-light leading-relaxed"
                >
                    Currently co-founding an AI-driven automation Software House and innovating at SZABIST &amp; ESQUAL.
                </motion.p>
            </motion.div>
        </div>
    );
}
