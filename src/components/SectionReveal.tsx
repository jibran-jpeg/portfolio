"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface SectionRevealProps {
    children: ReactNode;
    className?: string;
    direction?: "up" | "left" | "right";
    delay?: number;
    blur?: boolean;
}

export default function SectionReveal({
    children,
    className = "",
    direction = "up",
    delay = 0,
    blur = true,
}: SectionRevealProps) {
    const prefersReduced = useReducedMotion();

    const directionMap = {
        up: { y: 40, x: 0 },
        left: { y: 0, x: -40 },
        right: { y: 0, x: 40 },
    };

    const offset = directionMap[direction];

    return (
        <motion.div
            initial={
                prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, filter: blur ? "blur(8px)" : "none", ...offset }
            }
            whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity, filter" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
