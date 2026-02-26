"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const FRAME_COUNT = 187; // frame_006 to frame_192
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const FRAME_FORMAT = (index: number) =>
    `${basePath}/sequence/frame_${(index + 6).toString().padStart(3, "0")}_delay-0.042s.webp`;

interface ScrollyCanvasProps {
    onLoadProgress?: (loaded: number, total: number, done: boolean) => void;
}

export default function ScrollyCanvas({ onLoadProgress }: ScrollyCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const readyRef = useRef(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const lastFrameRef = useRef(-1);

    // Preload all images
    useEffect(() => {
        // Prevent double-loading in Strict Mode
        if (imagesRef.current.length > 0) return;

        const imgs: HTMLImageElement[] = [];
        let loaded = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            img.src = FRAME_FORMAT(i);
            img.onload = () => {
                loaded++;
                onLoadProgress?.(loaded, FRAME_COUNT, loaded === FRAME_COUNT);
                if (loaded === FRAME_COUNT) {
                    readyRef.current = true;
                    setTimeout(() => setImagesLoaded(true), 400);
                }
            };
            imgs.push(img);
        }

        imagesRef.current = imgs;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Draw a specific frame on the canvas
    const drawFrame = useCallback((frameIdx: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const idx = Math.max(0, Math.min(Math.floor(frameIdx), FRAME_COUNT - 1));

        // Skip if same frame
        if (idx === lastFrameRef.current) return;
        lastFrameRef.current = idx;

        const img = imagesRef.current[idx];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        // Maximum quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Object-fit: cover
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const canvasRatio = cw / ch;
        const imgRatio = iw / ih;

        let dw: number, dh: number, dx: number, dy: number;
        if (canvasRatio > imgRatio) {
            dw = cw;
            dh = cw / imgRatio;
            dx = 0;
            dy = (ch - dh) / 2;
        } else {
            dw = ch * imgRatio;
            dh = ch;
            dx = (cw - dw) / 2;
            dy = 0;
        }

        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    // Get current frame based on scroll position
    const getScrollFrame = useCallback(() => {
        const container = containerRef.current;
        if (!container) return 0;

        const rect = container.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        if (scrollRange <= 0) return 0;

        const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
        return progress * (FRAME_COUNT - 1);
    }, []);

    // Continuous render loop — always reads latest scroll position
    useEffect(() => {
        if (!imagesLoaded) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas resolution — use devicePixelRatio for crisp HiDPI rendering
        const setSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            // Scale canvas CSS size to match viewport (canvas resolution is higher)
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            lastFrameRef.current = -1; // Force redraw after resize
        };
        setSize();

        let animId = 0;
        let currentFrame = getScrollFrame();

        const tick = () => {
            if (readyRef.current) {
                const targetFrame = getScrollFrame();
                // Adding a lerp (linear interpolation) factor for ultra-smooth scrolling
                currentFrame += (targetFrame - currentFrame) * 0.08;
                drawFrame(currentFrame);
            }
            animId = requestAnimationFrame(tick);
        };
        animId = requestAnimationFrame(tick);

        window.addEventListener("resize", setSize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", setSize);
        };
    }, [imagesLoaded, drawFrame, getScrollFrame]);

    return (
        <div ref={containerRef} className="relative h-[800vh] w-full bg-[#121212]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            </div>
        </div>
    );
}
