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
    MIN_SEEK_DELTA: (1 / 60) * 0.5,
    SEEK_THROTTLE_MS: 0,
    INTRO_ENABLED: true,
};
const MOBILE = {
    LERP: 0.5,
    MIN_SEEK_DELTA: 1 / 24,
    SEEK_THROTTLE_MS: 50,
    INTRO_ENABLED: false,
};

interface ScrollVideoProps {
    onReady?: () => void;
}

export default function ScrollVideo({ onReady }: ScrollVideoProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const rafRef = useRef<number>(0);
    const currentTimeRef = useRef(0);

    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, []);

    const handleCanPlay = useCallback(() => {
        if (!isReady) {
            setIsReady(true);
            onReady?.();
        }
    }, [isReady, onReady]);

    // Fallback timer so loading screen doesn't hang forever
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // If already has data, fire immediately
        if (video.readyState >= 3) {
            handleCanPlay();
            return;
        }

        const fallbackTimer = setTimeout(() => handleCanPlay(), 5000);
        return () => clearTimeout(fallbackTimer);
    }, [handleCanPlay]);

    // Prime video: pause it and set frame 0 so browser renders the first frame
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const prime = () => {
            // KEY: fully pause the video — playbackRate=0 tricks don't reliably render frames
            video.pause();
            video.currentTime = isMobileDevice() ? 0 : INTRO_START_TIME;
        };

        if (video.readyState >= 2) {
            prime();
        } else {
            video.addEventListener("loadeddata", prime, { once: true });
        }

        // On mobile: one touch event to unlock the media element
        const unlock = () => {
            video.play().then(() => video.pause()).catch(() => {});
        };
        window.addEventListener("touchstart", unlock, { once: true });

        return () => {
            video.removeEventListener("loadeddata", prime);
            window.removeEventListener("touchstart", unlock);
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

        // KEY FIX: pause fully so currentTime seeks actually render frames
        video.pause();

        // Seek helper — simple direct seek, video is always paused
        const seekVideo = (time: number) => {
            video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
        };

        // ─── Always poll scroll progress every rAF frame ───
        // This works with Lenis, native scroll, and everything else
        let scrollProgress = 0;
        let cachedViewportW = window.innerWidth;
        let cachedViewportH = window.innerHeight;

        const updateProgress = () => {
            const rect = container.getBoundingClientRect();
            const vh = mobile ? cachedViewportH : window.innerHeight;
            const scrollRange = rect.height - vh;
            if (scrollRange > 0) {
                scrollProgress = Math.max(0, Math.min(1, -rect.top / scrollRange));
            }
        };

        // Intro state
        let introStartStamp: number | null = null;
        let introComplete = !cfg.INTRO_ENABLED;
        let waitingForData = cfg.INTRO_ENABLED;

        if (!cfg.INTRO_ENABLED) {
            currentTimeRef.current = 0;
            seekVideo(0);
        }

        const tick = (timestamp: number) => {
            if (!isActive) return;

            // Update viewport cache on orientation change
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
                        seekVideo(INTRO_START_TIME);
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

                seekVideo(introTime);
                currentTimeRef.current = introTime;

                if (t >= 1) {
                    introComplete = true;
                    currentTimeRef.current = 0;
                    seekVideo(0);
                }

                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            // ─── PHASE 2: Scroll-controlled video ───
            // Always poll every frame — works with Lenis and native scroll
            updateProgress();

            const duration = video.duration;
            if (!duration || !isFinite(duration)) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            const targetTime = scrollProgress * duration;
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

        updateProgress();
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
                {/* Invisible overlay to prevent touch/tap events reaching the video */}
                <div className="absolute inset-0 z-10 w-full h-full bg-transparent select-none pointer-events-none" />
            </div>
        </div>
    );
}
