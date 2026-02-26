"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface PageRevealProps {
    isLoaded?: boolean;
    onComplete?: () => void;
}

export default function PageReveal({ isLoaded = false, onComplete }: PageRevealProps) {
    const [phase, setPhase] = useState<"intro" | "loading" | "done">("intro");
    const [fakeProgress, setFakeProgress] = useState(0);
    const minTimeReached = useRef(false);

    // Phase 1: Name intro animation (1.2s) → Phase 2: Loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setPhase("loading");
            minTimeReached.current = true;
        }, 1400);
        return () => clearTimeout(timer);
    }, []);

    // Fake progress that ramps up, then waits for real load
    useEffect(() => {
        if (phase !== "loading") return;

        const interval = setInterval(() => {
            setFakeProgress((prev) => {
                if (isLoaded) {
                    // Jump to 100 quickly when actually loaded
                    return Math.min(prev + 8, 100);
                }
                // Slow crawl toward 85% while loading
                if (prev < 30) return prev + 2;
                if (prev < 60) return prev + 1;
                if (prev < 85) return prev + 0.3;
                return prev;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [phase, isLoaded]);

    // When progress hits 100, dismiss
    useEffect(() => {
        if (fakeProgress >= 100 && minTimeReached.current) {
            const timer = setTimeout(() => {
                setPhase("done");
                onComplete?.();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [fakeProgress, onComplete]);

    // If loaded before intro finishes, skip to done after intro
    useEffect(() => {
        if (isLoaded && phase === "loading" && fakeProgress < 30) {
            setFakeProgress(90);
        }
    }, [isLoaded, phase, fakeProgress]);

    const percent = Math.floor(fakeProgress);

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Radial glow pulse */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0.3] }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        <div className="w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[120px]" />
                    </motion.div>

                    {/* Content */}
                    <div className="relative flex flex-col items-center w-full max-w-xs px-6">
                        {/* Horizontal line that draws in */}
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 300, opacity: [0, 1, 0.3] }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 1] }}
                        />

                        <motion.div className="flex items-center overflow-hidden mb-8">
                            {"Jibran.".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    className={`text-3xl sm:text-4xl font-bold tracking-tight ${char === "." ? "text-white/30" : "text-white"
                                        }`}
                                    initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                    transition={{
                                        duration: 1.2,
                                        delay: 0.15 + i * 0.05,
                                        ease: [0.25, 0.1, 0.25, 1],
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Progress bar — appears after name animation */}
                        <motion.div
                            className="w-full"
                            initial={{ opacity: 0, scaleX: 0.8 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        >
                            <div className="w-full h-[1px] bg-white/[0.08] rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white/60 rounded-full"
                                    style={{ width: `${percent}%` }}
                                    transition={{ duration: 0.1, ease: "linear" }}
                                />
                            </div>
                        </motion.div>

                        {/* Loading text + percentage */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 1 }}
                            className="mt-4 flex items-center justify-between w-full"
                        >
                            <span className="text-[10px] uppercase tracking-[0.25em] text-white/20">
                                Loading
                            </span>
                            <span className="text-[10px] text-white/30 font-mono tabular-nums">
                                {percent}%
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
