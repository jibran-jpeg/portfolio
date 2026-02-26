"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const FRAME_COUNT = 237; // 240 minus first 3 frames
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const FRAME_FORMAT = (index: number) =>
    `${basePath}/sequence/frame_${(index + 4).toString().padStart(3, "0")}.jpg`;

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

    // Continuous render loop — pauses when hero section is off-screen
    useEffect(() => {
        if (!imagesLoaded) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        let lastWidth = window.innerWidth;

        // Set canvas resolution — capped DPR for mobile performance
        const setSize = () => {
            const currentWidth = window.innerWidth;
            // Ignore height-only resizes on ALL devices (e.g., address bar hiding/showing on mobile/tablet browsers) to prevent jarring zoom glitches
            if (canvas.width > 0 && currentWidth === lastWidth) {
                return;
            }
            lastWidth = currentWidth;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = currentWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            // Use CSS to keep it filling the container, ignoring internal resolution jumps
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            lastFrameRef.current = -1;
        };
        setSize();

        // Draw frame 0 immediately to prevent blank screen
        lastFrameRef.current = -1;
        drawFrame(0);

        let animId = 0;
        let currentFrame = getScrollFrame();
        let isActive = true;

        const tick = () => {
            if (readyRef.current) {
                const rect = container.getBoundingClientRect();
                const heroVisible = rect.bottom > 0 && rect.top < window.innerHeight;

                if (heroVisible) {
                    const targetFrame = getScrollFrame();
                    const diff = targetFrame - currentFrame;
                    if (Math.abs(diff) > 0.05) {
                        currentFrame += diff * 0.15;
                        drawFrame(currentFrame);
                    }
                }
            }
            if (isActive) {
                animId = requestAnimationFrame(tick);
            }
        };
        animId = requestAnimationFrame(tick);

        window.addEventListener("resize", setSize);

        return () => {
            isActive = false;
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", setSize);
        };
    }, [imagesLoaded, drawFrame, getScrollFrame]);

    return (
        <div ref={containerRef} className="relative h-[800vh] w-full bg-[#121212]">
            <div className="sticky top-0 h-[100vh] w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            </div>
        </div>
    );
}
