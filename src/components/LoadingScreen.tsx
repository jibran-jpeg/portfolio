"use client";

import { motion } from "framer-motion";

interface LoadingScreenProps {
    loaded: number;
    total: number;
}

export default function LoadingScreen({ loaded, total }: LoadingScreenProps) {
    const percent = total > 0 ? Math.floor((loaded / total) * 100) : 0;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a]">

            {/* Subtle radial glow behind */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] rounded-full bg-white/[0.015] blur-[120px]" />
            </div>

            <div className="relative w-full max-w-xs px-6 flex flex-col items-center">

                {/* Name — branding */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-white/80 font-semibold text-lg tracking-tight mb-12"
                >
                    Jibran<span className="text-white/30">.</span>
                </motion.p>

                {/* Minimal progress bar */}
                <motion.div
                    initial={{ opacity: 0, scaleX: 0.8 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full"
                >
                    <div className="w-full h-[1px] bg-white/[0.08] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white/60 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>
                </motion.div>

                {/* Percentage */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-5 flex items-center justify-between w-full"
                >
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/20">
                        Loading
                    </span>
                    <span className="text-[11px] text-white/30 font-mono tabular-nums">
                        {percent}%
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
