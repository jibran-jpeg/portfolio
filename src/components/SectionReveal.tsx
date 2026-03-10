"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface SectionRevealProps {
    children: ReactNode;
    className?: string;
    direction?: "up" | "left" | "right";
    delay?: number;
}

export default function SectionReveal({
    children,
    className = "",
    direction = "up",
    delay = 0,
}: SectionRevealProps) {
    const prefersReduced = useReducedMotion();

    const directionMap = {
        up: { y: 30, x: 0 },
        left: { y: 0, x: -30 },
        right: { y: 0, x: 30 },
    };

    const offset = directionMap[direction];

    return (
        <motion.div
            initial={
                prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, ...offset }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: "transform, opacity" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
