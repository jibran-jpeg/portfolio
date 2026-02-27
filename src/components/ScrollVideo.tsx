"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Starting frame offset for the intro reverse animation (~5 frames at 24fps)
const INTRO_START_TIME = 0.2;
// Duration of the reverse intro animation in seconds (synced with reveal animation)
const INTRO_DURATION = 2.0;

interface ScrollVideoProps {
    onReady?: () => void;
}

export default function ScrollVideo({ onReady }: ScrollVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isReady, setIsReady] = useState(false);
    const rafRef = useRef<number>(0);
    const currentTimeRef = useRef(INTRO_START_TIME);
    const introCompleteRef = useRef(false);
    const introStartTimeRef = useRef<number | null>(null);

    // Wait until enough data is buffered for smooth seeking
    const handleCanPlay = useCallback(() => {
        if (!isReady) {
            setIsReady(true);
            onReady?.();
        }
    }, [isReady, onReady]);

    // Safety check for cached videos
    useEffect(() => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
            handleCanPlay();
        }

        const fallbackTimer = setTimeout(() => {
            handleCanPlay();
        }, 3500);

        return () => clearTimeout(fallbackTimer);
    }, [handleCanPlay]);

    // iOS/Mobile video initialization — prime for seeking + show starting frame
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let primingInProgress = false;
        let primed = false;

        const initVideo = () => {
            if (primingInProgress || primed) return;
            primingInProgress = true;

            video.play().then(() => {
                video.pause();
                // Start at frame ~5 for the reverse intro animation
                video.currentTime = INTRO_START_TIME;
                primed = true;
                primingInProgress = false;
            }).catch(() => {
                video.currentTime = INTRO_START_TIME;
                primed = true;
                primingInProgress = false;
            });
        };

        if (video.readyState >= 2) {
            initVideo();
        }
        video.addEventListener('loadeddata', initVideo);

        const primeTouch = () => initVideo();
        window.addEventListener('touchstart', primeTouch, { once: true });

        // Auto-play guard (only after priming completes)
        const guardInterval = setInterval(() => {
            if (video && !video.paused && primed) {
                video.pause();
            }
        }, 200);
        const guardTimeout = setTimeout(() => clearInterval(guardInterval), 3000);

        return () => {
            video.removeEventListener('loadeddata', initVideo);
            window.removeEventListener('touchstart', primeTouch);
            clearInterval(guardInterval);
            clearTimeout(guardTimeout);
        };
    }, []);

    // Main animation loop: intro reverse animation → scroll control
    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        let isActive = true;
        let lastSeekTime = -1;
        const FRAME_DURATION = 1 / 60;

        const tick = (timestamp: number) => {
            if (!isActive) return;

            // PHASE 1: Intro reverse animation (frame 5 → frame 1)
            if (!introCompleteRef.current) {
                if (introStartTimeRef.current === null) {
                    introStartTimeRef.current = timestamp;
                }

                const elapsed = (timestamp - introStartTimeRef.current) / 1000;
                const t = Math.min(1, elapsed / INTRO_DURATION);

                // Ease-out curve for smooth deceleration
                const eased = 1 - Math.pow(1 - t, 3);

                // Interpolate from INTRO_START_TIME → 0
                const introTime = INTRO_START_TIME * (1 - eased);

                if (video.readyState >= 2) {
                    video.currentTime = introTime;
                    currentTimeRef.current = introTime;
                }

                if (t >= 1) {
                    introCompleteRef.current = true;
                    currentTimeRef.current = 0;
                    video.currentTime = 0;
                }

                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            // PHASE 2: Scroll-controlled video
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
                    transition={{ duration: 2.0, ease: [0.25, 0.1, 0.25, 1] }}
                />
            </div>
        </div>
    );
}
