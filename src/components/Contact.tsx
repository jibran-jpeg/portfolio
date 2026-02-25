"use client";

import { motion } from "framer-motion";
import { Send, Mail, MessageSquare, Phone, ArrowUpRight } from "lucide-react";
import { useState, FormEvent } from "react";

export default function Contact() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // mailto fallback
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
            {/* Top separator */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16">
                <div className="h-px bg-white/[0.06]" />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-16 pt-20 sm:pt-32 pb-20 sm:pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left — Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <p className="text-xs uppercase tracking-[0.3em] text-white/30 mb-3">Get in Touch</p>
                        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-4">
                            Let&apos;s Build Something
                        </h2>
                        <p className="text-white/35 text-sm sm:text-base leading-relaxed mb-10 max-w-md">
                            Have a project idea, freelance opportunity, or just want to say hi? I&apos;d love to hear from you. Let&apos;s connect and create something extraordinary.
                        </p>

                        {/* Contact Cards */}
                        <div className="space-y-4">
                            {/* Email */}
                            <a
                                href="mailto:devjibran0@gmail.com"
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition-colors duration-300">
                                    <Mail size={18} className="text-white/50" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/30 text-xs uppercase tracking-wider mb-0.5">Email</p>
                                    <p className="text-white/70 text-sm group-hover:text-white transition-colors truncate">devjibran0@gmail.com</p>
                                </div>
                                <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                            </a>

                            {/* WhatsApp */}
                            <a
                                href="https://wa.me/923555123929"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-[#25d366]/20 transition-colors duration-300">
                                    <Phone size={18} className="text-white/50 group-hover:text-[#25d366] transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/30 text-xs uppercase tracking-wider mb-0.5">WhatsApp</p>
                                    <p className="text-white/70 text-sm group-hover:text-white transition-colors">+92 355 5123929</p>
                                </div>
                                <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                            </a>

                            {/* GitHub */}
                            <a
                                href="https://github.com/jibran-jpeg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.1] transition-colors duration-300">
                                    <MessageSquare size={18} className="text-white/50" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/30 text-xs uppercase tracking-wider mb-0.5">GitHub</p>
                                    <p className="text-white/70 text-sm group-hover:text-white transition-colors">jibran-jpeg</p>
                                </div>
                                <ArrowUpRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors flex-shrink-0" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Right — Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={formState.name}
                                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={formState.email}
                                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={5}
                                    value={formState.message}
                                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all duration-300 resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitted}
                                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitted ? (
                                    <>
                                        <span>Message Sent!</span>
                                        <span className="text-green-600">✓</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
