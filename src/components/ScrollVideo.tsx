"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Intro reverse animation: scrub from this time back to 0
const INTRO_START_TIME = 1.0;
const INTRO_DURATION = 2.5; // seconds

// ─── Mobile detection helper ───
const isMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return (
        window.matchMedia("(max-width: 768px)").matches ||
        /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    );
};

// ─── Performance tuning per device ───
const DESKTOP = {
    LERP: 0.35,
    MIN_SEEK_DELTA: (1 / 60) * 0.5,   // seek every ~half frame at 60fps
    INTRO_ENABLED: true,
};
const MOBILE = {
    LERP: 0.55,                         // bigger jumps → fewer seeks
    MIN_SEEK_DELTA: 1 / 20,            // throttle to ~20 seeks/s max
    INTRO_ENABLED: false,               // skip reverse-seek intro on mobile
};

interface ScrollVideoProps {
    onReady?: () => void;
}

export default function ScrollVideo({ onReady }: ScrollVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false); // starts false to match SSR
    const rafRef = useRef<number>(0);
    const currentTimeRef = useRef(0);

    // Detect mobile after mount to avoid hydration mismatch
    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, []);

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

        let readyTimer: NodeJS.Timeout | null = null;
        if (video.readyState >= 2) {
            readyTimer = setTimeout(() => handleCanPlay(), 0);
        }

        const fallbackTimer = setTimeout(() => {
            handleCanPlay();
        }, 3500);

        return () => {
            if (readyTimer) clearTimeout(readyTimer);
            clearTimeout(fallbackTimer);
        };
    }, [handleCanPlay]);

    // iOS/Mobile: prime video for seeking
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const mobile = isMobileDevice();
        let primed = false;

        const prime = () => {
            if (primed) return;
            primed = true;

            // On mobile with intro disabled, prime to time 0 instead of INTRO_START_TIME
            const current = video.currentTime;
            const target = mobile
                ? 0
                : current > 0
                    ? current
                    : INTRO_START_TIME;

            video.play().then(() => {
                video.pause();
                video.currentTime = target;
            }).catch(() => {
                video.currentTime = target;
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

        const mobile = isMobileDevice();
        const cfg = mobile ? MOBILE : DESKTOP;

        let isActive = true;
        let lastSeekTime = -1;
        let lastSeekTimestamp = 0; // throttle by wall-clock time on mobile
        const FRAME_DURATION = 1 / 60;

        // Intro state (local to this effect run)
        let introStartStamp: number | null = null;
        let introComplete = !cfg.INTRO_ENABLED; // skip intro on mobile
        let waitingForData = cfg.INTRO_ENABLED;

        // If intro skipped, start at time 0
        if (!cfg.INTRO_ENABLED) {
            currentTimeRef.current = 0;
            video.currentTime = 0;
        }

        // Cache viewport to prevent jumping when mobile navigation bars hide/show
        let cachedViewportW = window.innerWidth;
        let cachedViewportH = window.innerHeight;

        const tick = (timestamp: number) => {
            if (!isActive) return;

            // Only update viewport cache on orientation change (width change), ignoring toolbar collapse.
            if (window.innerWidth !== cachedViewportW) {
                cachedViewportW = window.innerWidth;
                cachedViewportH = window.innerHeight;
            }

            // ─── PHASE 1: Intro reverse animation (desktop only) ───
            if (!introComplete) {
                // Wait until video actually has frame data before starting intro timer
                if (waitingForData) {
                    // Start intro immediately if ready, or force start after 1.5s fallback
                    if (video.readyState >= 2 || (timestamp - (introStartStamp || timestamp) > 1500)) {
                        waitingForData = false;
                        // Reset introStartStamp so the timeline starts fresh from this moment
                        introStartStamp = timestamp;
                        video.currentTime = INTRO_START_TIME;
                        currentTimeRef.current = INTRO_START_TIME;
                    } else {
                        // Track when we started waiting
                        if (introStartStamp === null) {
                            introStartStamp = timestamp;
                        }
                        rafRef.current = requestAnimationFrame(tick);
                        return;
                    }
                }

                // Normal intro timing elapsed check
                const elapsed = (timestamp - (introStartStamp as number)) / 1000;
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
            const scrollRange = rect.height - cachedViewportH;

            if (scrollRange > 0 && rect.bottom > 0 && rect.top < cachedViewportH) {
                const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
                const targetTime = progress * (video.duration || 0);

                const diff = targetTime - currentTimeRef.current;
                const absDiff = Math.abs(diff);

                if (absDiff < FRAME_DURATION) {
                    currentTimeRef.current = targetTime;
                } else {
                    currentTimeRef.current += diff * cfg.LERP;
                }

                const seekDelta = Math.abs(currentTimeRef.current - lastSeekTime);
                // On mobile, also throttle by wall-clock time (50ms = ~20fps)
                const timeSinceLast = timestamp - lastSeekTimestamp;
                const timeOk = mobile ? timeSinceLast >= 50 : true;

                if (seekDelta >= cfg.MIN_SEEK_DELTA && video.readyState >= 2 && timeOk) {
                    video.currentTime = currentTimeRef.current;
                    lastSeekTime = currentTimeRef.current;
                    lastSeekTimestamp = timestamp;
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
            <div className="sticky top-0 h-[100dvh] w-full overflow-hidden transition-[height] duration-500 ease-out">
                <motion.video
                    ref={videoRef}
                    src={`${basePath}/hero.mp4`}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onCanPlayThrough={handleCanPlay}
                    onCanPlay={handleCanPlay}
                    onLoadedData={handleCanPlay}
                    onError={handleCanPlay}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    style={{
                        pointerEvents: "none",
                        willChange: "transform",           // GPU compositing hint
                        transform: "translateZ(0)",         // force GPU layer
                    }}
                    initial={isMobile
                        ? { opacity: 0 }                    // simpler animation on mobile (no blur)
                        : { scale: 1.15, filter: "blur(10px)", opacity: 0 }
                    }
                    animate={isReady
                        ? isMobile
                            ? { opacity: 1, scale: 1, filter: "none" }  // clear SSR desktop initial
                            : { scale: 1, filter: "blur(0px)", opacity: 1 }
                        : {}
                    }
                    transition={isMobile
                        ? { opacity: { duration: 0.8, ease: "easeOut" } }
                        : {
                            scale: { duration: 2.0, ease: [0.25, 0.1, 0.25, 1] },
                            filter: { duration: 2.0, ease: [0.25, 0.1, 0.25, 1] },
                            opacity: { duration: 0.6, ease: "easeOut" },
                        }
                    }
                />
            </div>
        </div>
    );
}
