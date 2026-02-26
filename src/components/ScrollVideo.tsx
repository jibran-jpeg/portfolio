"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

interface ScrollVideoProps {
    onReady?: () => void;
}

export default function ScrollVideo({ onReady }: ScrollVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isReady, setIsReady] = useState(false);
    const rafRef = useRef<number>(0);
    const currentTimeRef = useRef(0);

    // Wait until enough data is buffered for smooth seeking
    const handleCanPlay = useCallback(() => {
        if (!isReady) {
            setIsReady(true);
            onReady?.();
        }
    }, [isReady, onReady]);

    // Safety check for cached videos
    useEffect(() => {
        // readyState >= 2 (HAVE_CURRENT_DATA) is enough to show the first frame visually
        if (videoRef.current && videoRef.current.readyState >= 2) {
            handleCanPlay();
        }
    }, [handleCanPlay]);

    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        let isActive = true;

        let lastSeekTime = -1;
        const FRAME_DURATION = 1 / 60; // 60fps interpolated video

        const tick = () => {
            if (!isActive) return;

            const rect = container.getBoundingClientRect();
            const scrollRange = rect.height - window.innerHeight;

            // SCROLL PHASE: Interpolate based on scroll position
            if (scrollRange > 0 && rect.bottom > 0 && rect.top < window.innerHeight) {
                const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
                const targetTime = progress * (video.duration || 0);

                const diff = targetTime - currentTimeRef.current;
                const absDiff = Math.abs(diff);

                if (absDiff < FRAME_DURATION) {
                    currentTimeRef.current = targetTime;
                } else {
                    currentTimeRef.current += diff * 0.35;
                }

                const seekDelta = Math.abs(currentTimeRef.current - lastSeekTime);
                if (seekDelta >= FRAME_DURATION * 0.5 && video.readyState >= 2) {
                    video.currentTime = currentTimeRef.current;
                    lastSeekTime = currentTimeRef.current;
                }
            }

            rafRef.current = requestAnimationFrame(tick);
        };


        rafRef.current = requestAnimationFrame(tick);

        return () => {
            isActive = false;
            cancelAnimationFrame(rafRef.current);
        };
    }, [isReady]);

    return (
        <div ref={containerRef} className="relative h-[800vh] w-full bg-[#0a0a0a]">
            <div className="sticky top-0 h-[100lvh] w-full overflow-hidden">
                <motion.video
                    ref={videoRef}
                    src={`${basePath}/hero.mp4`}
                    muted
                    playsInline
                    preload="auto"
                    onCanPlayThrough={handleCanPlay}
                    onCanPlay={handleCanPlay}
                    onLoadedData={handleCanPlay}
                    onLoadedMetadata={handleCanPlay}
                    onProgress={handleCanPlay}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ pointerEvents: "none" }}
                    initial={{ scale: 1.15, filter: "blur(10px)", opacity: 0 }}
                    animate={isReady ? { scale: 1, filter: "blur(0px)", opacity: 1 } : {}}
                    transition={{ duration: 2.0, ease: [0.25, 0.1, 0.25, 1] }}
                />
            </div>
        </div>
    );
}
