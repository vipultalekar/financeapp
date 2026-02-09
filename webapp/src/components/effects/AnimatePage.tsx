"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface AnimatePageProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
}

export function AnimatePage({ children, ...props }: AnimatePageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function AnimateList({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                        delayChildren: delay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function AnimateItem({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
        >
            {children}
        </motion.div>
    );
}

export function HoverScale({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
}

export function FloatAnimation({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -8, 0],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {children}
        </motion.div>
    );
}

