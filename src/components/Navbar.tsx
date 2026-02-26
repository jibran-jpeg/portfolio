"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Menu, X, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [pastHero, setPastHero] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Hero section is the first relative w-full div (800vh scrolly container)
            const heroSection = document.querySelector('[class*="h-[800vh]"]');
            if (heroSection) {
                const heroBottom = heroSection.getBoundingClientRect().bottom;
                setPastHero(heroBottom <= 0);
            } else {
                setPastHero(window.scrollY > window.innerHeight * 7);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMobileOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        const html = document.documentElement;
        if (mobileOpen) {
            document.body.style.overflow = "hidden";
            html.style.overflow = "hidden";
            document.body.style.touchAction = "none";
        } else {
            document.body.style.overflow = "";
            html.style.overflow = "";
            document.body.style.touchAction = "";
        }
        return () => {
            document.body.style.overflow = "";
            html.style.overflow = "";
            document.body.style.touchAction = "";
        };
    }, [mobileOpen]);

    const navLinks = [
        { label: "Home", href: "#home" },
        { label: "Projects", href: "#projects" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${pastHero
                    ? "bg-[#0a0a0a]/75 backdrop-blur-2xl border-b border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
                    : "bg-transparent border-b border-transparent py-4 md:py-6"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
                    {/* Logo — clean text only */}
                    <Link href="/" className="group flex items-center">
                        <span className="font-bold text-lg md:text-xl tracking-wide text-white group-hover:text-white/80 transition-colors">
                            Jibran<span className="text-white/40">.</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm font-medium text-white/50 hover:text-white transition-colors duration-300">
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side — minimal */}
                    <div className="flex items-center gap-3">
                        <a href="/resume.pdf" download="Jibran-Sarwar-Resume.pdf" className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/10 bg-white/5 text-white/50 text-xs font-medium hover:bg-white/10 hover:text-white transition-all duration-300">
                            <Download size={14} />
                            <span>Resume</span>
                        </a>
                        <a href="#contact" className="hidden sm:flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 hover:scale-105 transition-all duration-300">
                            <Mail size={16} />
                            <span>Hire Me</span>
                        </a>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/10 transition-all"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[49] bg-[#0a0a0a]/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center"
                    >
                        <nav className="flex flex-col items-center gap-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ delay: i * 0.08, duration: 0.3 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className="text-2xl font-semibold text-white/80 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        {/* Mobile CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 flex flex-col items-center gap-4"
                        >
                            <a
                                href="/resume.pdf"
                                download="Jibran-Sarwar-Resume.pdf"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-all"
                            >
                                <Download size={16} />
                                Resume
                            </a>
                            <a
                                href="#contact"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all"
                            >
                                <Mail size={16} />
                                Hire Me
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
