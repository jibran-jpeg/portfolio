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
    SEEK_THROTTLE_MS: 0,               // no throttle on desktop
    INTRO_ENABLED: true,
    USE_FAST_SEEK: false,
};
const MOBILE = {
    LERP: 0.5,                          // balanced: smooth interpolation without too many seeks
    MIN_SEEK_DELTA: 1 / 24,            // only seek when delta is meaningful (~24fps worth)
    SEEK_THROTTLE_MS: 50,              // throttle to ~20 seeks/s
    INTRO_ENABLED: false,               // skip reverse-seek intro on mobile
    USE_FAST_SEEK: false,               // disabled: fastSeek jumps to distant keyframes causing choppiness
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

            // Safari/Chrome mobile play button hack: keep video "playing" but at 0 speed.
            // This prevents the OS from natively injecting a large play button on a "paused" video.
            video.playbackRate = 0;
            video.currentTime = target;

            video.play().catch(() => {
                // If play() is blocked due to browser policies, we simply leave the video as-is.
                // explicitly calling video.pause() here triggers Android Chrome and iOS Safari
                // to display a native large play button overlay because it enters a user-paused state.
                // The video will still scrub normally since we manually set currentTime.
            });
        };

        if (video.readyState >= 2) prime();
        video.addEventListener("loadeddata", prime);
        window.addEventListener("touchstart", prime, { once: true });

        return () => {
            video.removeEventListener("loadeddata", prime);
            window.removeEventListener("touchstart", prime);
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
        let lastSeekTimestamp = 0;
        const FRAME_DURATION = 1 / 60;

        // Seek helper — always use currentTime for frame-accurate seeking
        const seekVideo = (time: number) => {
            video.currentTime = time;
        };

        // ─── Track scroll progress via passive scroll listener (cheaper than polling getBoundingClientRect) ───
        let scrollProgress = 0;
        let scrollDirty = true; // flag to avoid redundant rect reads

        const updateProgress = () => {
            const rect = container.getBoundingClientRect();
            const vh = mobile ? cachedViewportH : window.innerHeight;
            const scrollRange = rect.height - vh;
            if (scrollRange > 0) {
                scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollRange));
            }
            scrollDirty = false;
        };

        const onScroll = () => { scrollDirty = true; };
        window.addEventListener("scroll", onScroll, { passive: true });

        // Intro state (local to this effect run)
        let introStartStamp: number | null = null;
        let introComplete = !cfg.INTRO_ENABLED;
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

            // Only update viewport cache on orientation change (width change)
            if (window.innerWidth !== cachedViewportW) {
                cachedViewportW = window.innerWidth;
                cachedViewportH = window.innerHeight;
            }

            // ─── PHASE 1: Intro reverse animation (desktop only) ───
            if (!introComplete) {
                if (waitingForData) {
                    if (video.readyState >= 2 || (timestamp - (introStartStamp || timestamp) > 1500)) {
                        waitingForData = false;
                        introStartStamp = timestamp;
                        video.currentTime = INTRO_START_TIME;
                        currentTimeRef.current = INTRO_START_TIME;
                    } else {
                        if (introStartStamp === null) introStartStamp = timestamp;
                        rafRef.current = requestAnimationFrame(tick);
                        return;
                    }
                }

                const elapsed = (timestamp - (introStartStamp as number)) / 1000;
                const t = Math.min(1, elapsed / INTRO_DURATION);
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
            // Only recalculate rect when scroll actually happened
            if (scrollDirty) updateProgress();

            const targetTime = scrollProgress * (video.duration || 0);
            const diff = targetTime - currentTimeRef.current;
            const absDiff = Math.abs(diff);

            if (absDiff < FRAME_DURATION) {
                currentTimeRef.current = targetTime;
            } else {
                currentTimeRef.current += diff * cfg.LERP;
            }

            const seekDelta = Math.abs(currentTimeRef.current - lastSeekTime);
            const timeSinceLast = timestamp - lastSeekTimestamp;
            const throttleOk = cfg.SEEK_THROTTLE_MS > 0
                ? timeSinceLast >= cfg.SEEK_THROTTLE_MS
                : true;

            if (seekDelta >= cfg.MIN_SEEK_DELTA && video.readyState >= 2 && throttleOk) {
                seekVideo(currentTimeRef.current);
                lastSeekTime = currentTimeRef.current;
                lastSeekTimestamp = timestamp;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        // Do an initial progress read
        updateProgress();
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            isActive = false;
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("scroll", onScroll);
        };
    }, [isReady]);

    return (
        <div ref={containerRef} className="relative h-[800vh] w-full bg-[#0a0a0a]">
            <div className="sticky top-0 h-[100dvh] w-full overflow-hidden transition-[height] duration-500 ease-out">
                <motion.video
                    ref={videoRef}
                    src={`${basePath}/hero.mp4`}
                    autoPlay
                    loop
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    muted
                    playsInline
                    tabIndex={-1}
                    preload="auto"
                    onCanPlayThrough={handleCanPlay}
                    onCanPlay={handleCanPlay}
                    onLoadedData={handleCanPlay}
                    onError={handleCanPlay}
                    className="absolute inset-0 w-full h-full object-cover z-0 hero-video"
                    style={{
                        pointerEvents: "none",
                        willChange: "transform",
                        transform: "translateZ(0)",
                    }}
                    initial={isMobile
                        ? { opacity: 0 }
                        : { scale: 1.15, filter: "blur(10px)", opacity: 0 }
                    }
                    animate={isReady
                        ? isMobile
                            ? { opacity: 1, scale: 1, filter: "none" }
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
                {/* Invisible overlay to absolutely prevent touch/tap events from reaching the video and showing the play button */}
                <div className="absolute inset-0 z-10 w-full h-full bg-transparent select-none pointer-events-none" />
            </div>
        </div>
    );
}
