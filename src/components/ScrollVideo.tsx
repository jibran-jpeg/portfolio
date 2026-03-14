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
    MIN_SEEK_DELTA: 1 / 60 / 2, // half a frame at 60fps
    SEEK_THROTTLE_MS: 0,
    INTRO_ENABLED: true,
};
const MOBILE = {
    MIN_SEEK_DELTA: 1 / 60 / 2,
    SEEK_THROTTLE_MS: 0,
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
    const isUnlockedRef = useRef(false); // tracks if mobile video is gesture-unlocked

    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, []);

    // Add webkit-playsinline for older iOS Safari
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.setAttribute("webkit-playsinline", "true");
        video.setAttribute("x-webkit-airplay", "deny");
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

        // If we have at least metadata (readyState >= 1), we can start allowing the page to reveal.
        // We don't need readyState 3 (HAVE_FUTURE_DATA) immediately, as Vercel/CDNs might chunk the video.
        if (video.readyState >= 1) {
            handleCanPlay();
            return;
        }

        // Add event listeners for earlier lifecycle events
        video.addEventListener("loadedmetadata", handleCanPlay, { once: true });
        video.addEventListener("loadeddata", handleCanPlay, { once: true });

        // Fallback timer (3s mobile, 5s desktop)
        const fallbackTimer = setTimeout(() => handleCanPlay(), isMobileDevice() ? 3000 : 5000);
        
        return () => {
            clearTimeout(fallbackTimer);
            video.removeEventListener("loadedmetadata", handleCanPlay);
            video.removeEventListener("loadeddata", handleCanPlay);
        };
    }, [handleCanPlay]);

    // Prime video + mobile unlock
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const prime = () => {
            video.pause();
            video.currentTime = isMobileDevice() ? 0 : INTRO_START_TIME;
        };

        if (video.readyState >= 1) {
            prime();
        } else {
            video.addEventListener("loadedmetadata", prime, { once: true });
        }

        // ── Mobile unlock strategy ──
        // On mobile, the browser blocks seeking until the user has triggered
        // a play() via a real gesture. We track this with isUnlockedRef.
        // We try TWO approaches:
        // 1. Immediate silent play attempt (works on Android, fails quietly on iOS)
        // 2. First touchstart/touchend gesture (guaranteed to work on iOS)
        const doUnlock = () => {
            if (isUnlockedRef.current) return;
            const p = video.play();
            if (p !== undefined) {
                p.then(() => {
                    video.pause();
                    video.currentTime = currentTimeRef.current; // seek to where we are
                    isUnlockedRef.current = true;
                }).catch(() => {
                    // Failed — user gesture still needed, wait for touch
                });
            }
        };

        // Try immediately (works without gesture on Android)
        if (isMobileDevice()) {
            doUnlock();
        }

        // Always listen for first touch as guaranteed fallback
        const onFirstTouch = () => {
            doUnlock();
        };
        window.addEventListener("touchstart", onFirstTouch, { once: true });
        window.addEventListener("touchend", onFirstTouch, { once: true });

        return () => {
            video.removeEventListener("loadeddata", prime);
            window.removeEventListener("touchstart", onFirstTouch);
            window.removeEventListener("touchend", onFirstTouch);
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

        // KEY FIX: pause fully so currentTime seeks actually render frames
        video.pause();

        // Seek helper — simple direct seek, video is always paused
        const seekVideo = (time: number) => {
            video.currentTime = Math.max(0, Math.min(time, video.duration || 0));
        };

        // ─── Poll scroll progress every rAF frame ───
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
            updateProgress();

            const duration = video.duration;
            if (!duration || !isFinite(duration)) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            // All frames are keyframes — seek directly, no LERP needed
            const targetTime = scrollProgress * duration;
            currentTimeRef.current = targetTime;

            const seekDelta = Math.abs(currentTimeRef.current - lastSeekTime);
            const timeSinceLast = timestamp - lastSeekTimestamp;
            const throttleOk = cfg.SEEK_THROTTLE_MS > 0
                ? timeSinceLast >= cfg.SEEK_THROTTLE_MS
                : true;

            // On mobile: only seek if video is unlocked (gesture fired)
            // On desktop: always seekable
            const canSeek = mobile ? isUnlockedRef.current : true;

            if (canSeek && seekDelta >= cfg.MIN_SEEK_DELTA && video.readyState >= 1 && throttleOk) {
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
                        // Force GPU layer on mobile
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
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
