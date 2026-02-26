"use client";

import { useEffect, useRef } from "react";

export default function NoiseOverlay() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        let lastTime = 0;
        const FPS = 12; // Low FPS for cinematic grain feel
        const interval = 1000 / FPS;

        const resize = () => {
            // Use a smaller resolution for performance, CSS scales it up
            canvas.width = 256;
            canvas.height = 256;
        };
        resize();

        const drawNoise = (time: number) => {
            animId = requestAnimationFrame(drawNoise);

            if (time - lastTime < interval) return;
            lastTime = time;

            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const v = Math.random() * 255;
                data[i] = v;     // R
                data[i + 1] = v; // G
                data[i + 2] = v; // B
                data[i + 3] = 18; // Alpha — very subtle
            }

            ctx.putImageData(imageData, 0, 0);
        };

        animId = requestAnimationFrame(drawNoise);

        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[9999] w-full h-full opacity-[0.035] mix-blend-overlay"
            style={{ imageRendering: "pixelated" }}
            aria-hidden="true"
        />
    );
}
