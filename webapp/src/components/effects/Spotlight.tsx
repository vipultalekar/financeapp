"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
    children: ReactNode;
    className?: string;
    color?: string;
}

export function Spotlight({ children, className, color = "hsla(217, 91%, 60%, 0.15)" }: SpotlightProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        containerRef.current.style.setProperty("--mouse-x", `${x}px`);
        containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn("relative overflow-hidden group/spotlight", className)}
        >
            <div
                className="pointer-events-none absolute -inset-px z-10 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${color}, transparent 80%)`,
                }}
            />
            {children}
        </div>
    );
}
