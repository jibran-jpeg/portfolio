"use client";

import { motion } from "framer-motion";
import { Send, Mail, Phone, ArrowUpRight, Github } from "lucide-react";
import { useState, FormEvent } from "react";

const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const CONTACTS = [
    {
        label: "Email",
        value: "devjibran0@gmail.com",
        href: "mailto:devjibran0@gmail.com",
        icon: Mail,
        hoverBg: "group-hover:bg-white/[0.1]",
        hoverIcon: "",
    },
    {
        label: "WhatsApp",
        value: "+92 355 5123929",
        href: "https://wa.me/923555123929",
        icon: Phone,
        hoverBg: "group-hover:bg-[#25d366]/15",
        hoverIcon: "group-hover:text-[#25d366]",
        external: true,
    },
    {
        label: "GitHub",
        value: "jibran-jpeg",
        href: "https://github.com/jibran-jpeg",
        icon: Github,
        hoverBg: "group-hover:bg-violet-500/15",
        hoverIcon: "group-hover:text-violet-400",
        external: true,
    },
];

export default function Contact() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Portfolio Contact from ${formState.name}`);
        const body = encodeURIComponent(
            `Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`
        );
        window.open(`mailto:devjibran0@gmail.com?subject=${subject}&body=${body}`, "_blank");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    return (
        <section id="contact" className="relative w-full bg-[#0a0a0a] z-20 overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-1/3 right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] rounded-full bg-[#8a5cff]/20 blur-[80px] sm:blur-[120px]" />
                <div className="absolute bottom-1/3 left-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] rounded-full bg-[#ff5c7a]/15 blur-[80px] sm:blur-[120px]" />
            </div>

            {/* Top separator */}
            <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-16">
                <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6 md:px-16 pt-16 sm:pt-20 md:pt-32 pb-16 sm:pb-20 md:pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left — Info */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.15 }}
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-white/40 to-transparent" />
                                <span className="text-xs uppercase tracking-[0.3em] text-white/30">Get in Touch</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white tracking-tight mb-3 sm:mb-4">
                                Let&apos;s Build Something
                            </h2>
                            <p className="text-white/35 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 max-w-md">
                                Have a project idea, freelance opportunity, or just want to say hi? I&apos;d love to hear from you. Let&apos;s connect and create something extraordinary.
                            </p>
                        </motion.div>

                        {/* Contact Cards */}
                        <div className="space-y-3 sm:space-y-4">
                            {CONTACTS.map((contact) => (
                                <motion.a
                                    key={contact.label}
                                    variants={fadeInUp}
                                    href={contact.href}
                                    target={contact.external ? "_blank" : undefined}
                                    rel={contact.external ? "noopener noreferrer" : undefined}
                                    className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-500"
                                >
                                    <div className={`w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 ${contact.hoverBg} transition-all duration-400`}>
                                        <contact.icon size={18} className={`text-white/50 ${contact.hoverIcon} transition-colors duration-400`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/30 text-xs uppercase tracking-wider mb-0.5">{contact.label}</p>
                                        <p className="text-white/70 text-sm group-hover:text-white transition-colors truncate">{contact.value}</p>
                                    </div>
                                    <ArrowUpRight size={16} className="text-white/15 group-hover:text-white/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 flex-shrink-0" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        style={{ willChange: "transform, opacity" }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div className="relative">
                                <label
                                    htmlFor="name"
                                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                                        focused === "name" || formState.name
                                            ? "top-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40"
                                            : "top-3.5 text-sm text-white/20"
                                    }`}
                                >
                                    Your name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={formState.name}
                                    onFocus={() => setFocused("name")}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full px-4 pt-6 pb-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] transition-all duration-300"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <label
                                    htmlFor="email"
                                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                                        focused === "email" || formState.email
                                            ? "top-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40"
                                            : "top-3.5 text-sm text-white/20"
                                    }`}
                                >
                                    your@email.com
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formState.email}
                                    onFocus={() => setFocused("email")}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full px-4 pt-6 pb-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] transition-all duration-300"
                                />
                            </div>

                            {/* Message Field */}
                            <div className="relative">
                                <label
                                    htmlFor="message"
                                    className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                                        focused === "message" || formState.message
                                            ? "top-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40"
                                            : "top-3.5 text-sm text-white/20"
                                    }`}
                                >
                                    Tell me about your project...
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={5}
                                    value={formState.message}
                                    onFocus={() => setFocused("message")}
                                    onBlur={() => setFocused(null)}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    className="w-full px-4 pt-6 pb-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] transition-all duration-300 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={submitted}
                                className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black text-sm font-semibold overflow-hidden hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                                <span className="relative z-10 flex items-center gap-2">
                                    {submitted ? (
                                        <>
                                            <span>Message Sent!</span>
                                            <span className="text-green-600">✓</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
