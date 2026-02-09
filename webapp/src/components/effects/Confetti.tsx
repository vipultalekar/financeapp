"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    size: number;
    angle: number;
    velocity: number;
}

const COLORS = ["#0ea5e9", "#22d3ee", "#818cf8", "#c084fc", "#fb7185", "#fbbf24"];

export function Confetti({ trigger }: { trigger: boolean }) {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        if (trigger) {
            const newParticles = Array.from({ length: 40 }).map((_, i) => ({
                id: Math.random(),
                x: 50, // center %
                y: 50, // center %
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: Math.random() * 8 + 4,
                angle: Math.random() * 360,
                velocity: Math.random() * 20 + 10,
            }));
            setParticles(newParticles);

            const timer = setTimeout(() => setParticles([]), 2000);
            return () => clearTimeout(timer);
        }
    }, [trigger]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ x: "50vw", y: "50vh", opacity: 1, scale: 1 }}
                        animate={{
                            x: `calc(50vw + ${Math.cos(p.angle) * p.velocity * 20}px)`,
                            y: `calc(50vh + ${Math.sin(p.angle) * p.velocity * 20}px)`,
                            opacity: 0,
                            scale: 0,
                            rotate: p.angle * 5,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute rounded-sm"
                        style={{
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export function useConfetti() {
    const [trigger, setTrigger] = useState(false);
    const fire = () => {
        setTrigger(false);
        setTimeout(() => setTrigger(true), 10);
    };
    return { trigger, fire, ConfettiComponent: () => <Confetti trigger={trigger} /> };
}
