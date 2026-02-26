"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

export default function Overlay({ progress }: { progress?: MotionValue<number> }) {
    const { scrollYProgress: defaultScroll } = useScroll();
    const scrollYProgress = progress || defaultScroll;

    // Opacities – each section fades in and out cleanly, section 3 extends to the end
    const opacity1 = useTransform(scrollYProgress, [0, 0.06, 0.1, 0.14], [1, 1, 0, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.28, 0.4, 0.48], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.55, 0.63, 0.85, 0.92], [0, 1, 1, 0]);

    // Visibility – hard-hide sections when opacity is 0 so nothing bleeds through
    const vis1 = useTransform(scrollYProgress, (v) => (v <= 0.14 ? "visible" : "hidden") as "visible" | "hidden");
    const vis2 = useTransform(scrollYProgress, (v) => (v >= 0.2 && v <= 0.48 ? "visible" : "hidden") as "visible" | "hidden");
    const vis3 = useTransform(scrollYProgress, (v) => (v >= 0.55 && v <= 0.92 ? "visible" : "hidden") as "visible" | "hidden");

    // Y Transforms (Parallax)
    const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.48], [100, -100]);
    const y3 = useTransform(scrollYProgress, [0.55, 0.92], [60, -60]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center px-6 md:px-24">
            {/* Section 1 */}
            <motion.div
                style={{ opacity: opacity1, y: y1, visibility: vis1 }}
                className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 pb-16 sm:pb-24"
            >
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tighter text-white mb-4 sm:mb-6 drop-shadow-2xl">
                    Jibran <span className="opacity-80">Sarwar.</span>
                </h1>
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] md:text-xs font-body tracking-[0.15em] text-[#a0a0a0] uppercase">
                        Full-Stack Developer
                    </span>
                    <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] md:text-xs font-body tracking-[0.15em] text-[#a0a0a0] uppercase">
                        AI Architect
                    </span>
                    <span className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] md:text-xs font-body tracking-[0.15em] text-[#a0a0a0] uppercase">
                        UI/UX Specialist
                    </span>
                </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div
                style={{ opacity: opacity2, y: y2, visibility: vis2 }}
                className="absolute inset-0 flex flex-col items-center sm:items-end justify-center px-6 sm:px-8 md:px-32 text-center sm:text-right"
            >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-white max-w-2xl leading-[1.15] drop-shadow-xl">
                    Building high-vibe digital products.
                </h2>
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/40 max-w-lg font-body font-light leading-relaxed">
                    Specialized in AI Automation, intelligent Chatbots integrated via n8n, and modern UI styles like Glassmorphism and Vibe Code.
                </p>
            </motion.div>

            {/* Section 3 */}
            <motion.div
                style={{ opacity: opacity3, y: y3, visibility: vis3 }}
                className="absolute inset-0 flex flex-col items-center sm:items-start justify-center px-6 sm:px-8 md:px-32 text-center sm:text-left"
            >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] font-semibold tracking-tight text-white max-w-2xl leading-[1.15] drop-shadow-xl">
                    Crafting the Future of <br className="hidden lg:block" />
                    <span className="text-white/50 italic font-light">Autonomous AI.</span>
                </h2>
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/40 max-w-lg font-body font-light leading-relaxed">
                    Currently co-founding an AI-driven automation Software House and innovating at SZABIST & ESQUAL.
                </p>
            </motion.div>
        </div>
    );
}
