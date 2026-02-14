"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { Logo } from "@/components/global/Logo";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000); // Show for 2 seconds

        const cleanup = setTimeout(() => {
            onFinish();
        }, 2500); // Give time for exit animation

        return () => {
            clearTimeout(timer);
            clearTimeout(cleanup);
        };
    }, [onFinish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <FloatingOrbs variant="intense" />

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 260,
                                damping: 20,
                                delay: 0.2
                            }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-sm relative z-10">
                                <Logo size="lg" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-center space-y-2"
                        >
                            <h1 className="text-3xl font-black text-white tracking-tight shimmer-text">
                                Rupiyo
                            </h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                                Your Personal Finance Assistant
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        className="absolute bottom-10 left-0 right-0 flex justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
