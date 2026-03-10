"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrolling({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        // Initialize Lenis for buttery smooth page scrolling
        const lenis = new Lenis({
            lerp: 0.09, // Responsive yet smooth — not floaty
            duration: 1.2,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            smoothWheel: true,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
