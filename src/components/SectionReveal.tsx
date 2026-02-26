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
        up: { y: 45, x: 0 },
        left: { y: 0, x: -45 },
        right: { y: 0, x: 45 },
    };

    const offset = directionMap[direction];

    return (
        <motion.div
            initial={
                prefersReduced
                    ? { opacity: 0 }
                    : { opacity: 0, filter: "blur(6px)", ...offset }
            }
            whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
                duration: 1.2,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
