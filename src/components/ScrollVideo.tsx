"use client";

import { useRef } from "react";

export default function ScrollVideo() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative h-[800vh] w-full bg-[#0a0a0a]">
            <div className="sticky top-0 h-[100lvh] w-full overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] z-0" />
            </div>
        </div>
    );
}
