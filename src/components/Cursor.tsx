"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
    const [isMounted, setIsMounted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Detect touch devices — no custom cursor on mobile/tablet
        const hasTouchScreen =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0 ||
            window.matchMedia("(pointer: coarse)").matches;
        setIsTouchDevice(hasTouchScreen);
    }, []);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth out the movement using a spring
    const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if the element being hovered is interactive (button, link, input, etc)
            if (
                target.tagName.toLowerCase() === "button" ||
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "input" ||
                target.closest("button") ||
                target.closest("a")
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    if (!isMounted || isTouchDevice) return null;

    return (
        <>
            <style>{`
        @media (pointer: fine) {
          body {
            cursor: none;
          }
          a, button, input, [role="button"] {
            cursor: none !important;
          }
        }
      `}</style>

            {/* Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white/50 pointer-events-none z-[100] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
            />

            {/* Inner Dot */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] flex items-center justify-center mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{ duration: 0.2 }}
            >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
        </>
    );
}
