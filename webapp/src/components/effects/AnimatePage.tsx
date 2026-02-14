"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React, { ReactNode } from "react";

interface AnimatePageProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
}

export const AnimatePage = React.forwardRef<HTMLDivElement, AnimatePageProps>(
    ({ children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
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
);
AnimatePage.displayName = "AnimatePage";

interface AnimateListProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
}

export const AnimateList = React.forwardRef<HTMLDivElement, AnimateListProps>(
    ({ children, delay = 0, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
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
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
AnimateList.displayName = "AnimateList";

export const AnimateItem = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    ({ children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
AnimateItem.displayName = "AnimateItem";

export const HoverScale = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    ({ children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
HoverScale.displayName = "HoverScale";

export const FloatAnimation = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
    ({ children, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);
FloatAnimation.displayName = "FloatAnimation";

