"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Intro reverse animation: scrub from this time back to 0
const INTRO_START_TIME = 1.0;
const INTRO_DURATION = 2.5; // seconds

interface ScrollVideoProps {
    onReady?: () => void;
}

export default function ScrollVideo({ onReady }: ScrollVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isReady, setIsReady] = useState(false);
    const rafRef = useRef<number>(0);
    const currentTimeRef = useRef(0);

    // Signal "ready" to parent (loading screen) when we have enough data
    const handleCanPlay = useCallback(() => {
        if (!isReady) {
            setIsReady(true);
            onReady?.();
        }
    }, [isReady, onReady]);

    // Safety check for cached videos + fallback
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (video.readyState >= 2) {
            handleCanPlay();
        }

        const fallbackTimer = setTimeout(() => {
            handleCanPlay();
        }, 3500);

        return () => clearTimeout(fallbackTimer);
    }, [handleCanPlay]);

    // iOS/Mobile: prime video for seeking
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let primed = false;

        const prime = () => {
            if (primed) return;
            primed = true;
            video.play().then(() => {
                video.pause();
                video.currentTime = INTRO_START_TIME;
            }).catch(() => {
                video.currentTime = INTRO_START_TIME;
            });
        };

        if (video.readyState >= 2) prime();
        video.addEventListener("loadeddata", prime);
        window.addEventListener("touchstart", prime, { once: true });

        // Auto-play guard for 3s
        const guard = setInterval(() => {
            if (video && !video.paused && primed) video.pause();
        }, 250);
        const guardOff = setTimeout(() => clearInterval(guard), 3000);

        return () => {
            video.removeEventListener("loadeddata", prime);
            window.removeEventListener("touchstart", prime);
            clearInterval(guard);
            clearTimeout(guardOff);
        };
    }, []);

    // Main loop: intro reverse → scroll control
    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container || !isReady) return;

        let isActive = true;
        let lastSeekTime = -1;
        const FRAME_DURATION = 1 / 60;

        // Intro state (local to this effect run)
        let introStartStamp: number | null = null;
        let introComplete = false;
        let waitingForData = true;

        const tick = (timestamp: number) => {
            if (!isActive) return;

            // ─── PHASE 1: Intro reverse animation ───
            if (!introComplete) {
                // Wait until video actually has frame data before starting intro timer
                if (waitingForData) {
                    if (video.readyState >= 2) {
                        waitingForData = false;
                        // Set video to intro start position
                        video.currentTime = INTRO_START_TIME;
                        currentTimeRef.current = INTRO_START_TIME;
                    } else {
                        // Not ready yet, keep waiting
                        rafRef.current = requestAnimationFrame(tick);
                        return;
                    }
                }

                // Start timer on first data-ready frame
                if (introStartStamp === null) {
                    introStartStamp = timestamp;
                }

                const elapsed = (timestamp - introStartStamp) / 1000;
                const t = Math.min(1, elapsed / INTRO_DURATION);

                // Cubic ease-out for smooth deceleration
                const eased = 1 - Math.pow(1 - t, 3);
                const introTime = INTRO_START_TIME * (1 - eased);

                video.currentTime = introTime;
                currentTimeRef.current = introTime;

                if (t >= 1) {
                    introComplete = true;
                    currentTimeRef.current = 0;
                    video.currentTime = 0;
                }

                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            // ─── PHASE 2: Scroll-controlled video ───
            const rect = container.getBoundingClientRect();
            const scrollRange = rect.height - window.innerHeight;

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
                    onError={handleCanPlay}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{ pointerEvents: "none" }}
                    initial={{ scale: 1.15, filter: "blur(10px)", opacity: 0 }}
                    animate={isReady ? { scale: 1, filter: "blur(0px)", opacity: 1 } : {}}
                    transition={{
                        scale: { duration: 2.0, ease: [0.25, 0.1, 0.25, 1] },
                        filter: { duration: 2.0, ease: [0.25, 0.1, 0.25, 1] },
                        opacity: { duration: 0.6, ease: "easeOut" },
                    }}
                />
            </div>
        </div>
    );
}
