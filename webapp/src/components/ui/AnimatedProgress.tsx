"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
    value: number; // 0-100
    className?: string;
    showGlow?: boolean;
    color?: "primary" | "success" | "warning" | "accent";
    size?: "sm" | "md" | "lg";
    animated?: boolean;
}

export function AnimatedProgress({
    value,
    className,
    showGlow = true,
    color = "primary",
    size = "md",
    animated = true,
}: AnimatedProgressProps) {
    const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!animated) {
            setDisplayValue(value);
            return;
        }

        // Animate from current to target value
        const startValue = displayValue;
        const endValue = Math.min(100, Math.max(0, value));
        const duration = 800; // ms
        const startTime = performance.now();

        const animateProgress = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOut;

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animateProgress);
            }
        };

        requestAnimationFrame(animateProgress);
    }, [value, animated]);

    const colorClasses = {
        primary: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        accent: "bg-accent",
    };

    const glowClasses = {
        primary: "shadow-[0_0_10px_hsla(175,65%,50%,0.5)]",
        success: "shadow-[0_0_10px_hsla(160,45%,45%,0.5)]",
        warning: "shadow-[0_0_10px_hsla(35,70%,55%,0.5)]",
        accent: "shadow-[0_0_10px_hsla(260,50%,60%,0.5)]",
    };

    const sizeClasses = {
        sm: "h-1",
        md: "h-1.5",
        lg: "h-2",
    };

    return (
        <div
            className={cn(
                "w-full bg-secondary/50 rounded-full overflow-hidden",
                sizeClasses[size],
                className
            )}
        >
            <div
                ref={progressRef}
                className={cn(
                    "h-full rounded-full transition-all duration-300 progress-animated",
                    colorClasses[color],
                    showGlow && glowClasses[color]
                )}
                style={{ width: `${displayValue}%` }}
            />
        </div>
    );
}

// Animated number counter
interface AnimatedNumberProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    className?: string;
}

export function AnimatedNumber({
    value,
    duration = 800,
    prefix = "",
    suffix = "",
    decimals = 0,
    className,
}: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const previousValueRef = useRef(0);

    useEffect(() => {
        const startValue = previousValueRef.current;
        const endValue = value;
        const startTime = performance.now();

        const animateNumber = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (endValue - startValue) * easeOut;

            setDisplayValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animateNumber);
            } else {
                previousValueRef.current = endValue;
            }
        };

        requestAnimationFrame(animateNumber);
    }, [value, duration]);

    const formattedValue = decimals > 0
        ? displayValue.toFixed(decimals)
        : Math.round(displayValue).toString();

    return (
        <span className={cn("tabular-nums animate-count-up", className)}>
            {prefix}{formattedValue}{suffix}
        </span>
    );
}

// Savings ring with animation
interface AnimatedSavingsRingProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    className?: string;
    showLabel?: boolean;
}

export function AnimatedSavingsRing({
    percentage,
    size = 120,
    strokeWidth = 8,
    className,
    showLabel = true,
}: AnimatedSavingsRingProps) {
    const [displayPercentage, setDisplayPercentage] = useState(0);

    useEffect(() => {
        const duration = 1000; // ms
        const startTime = performance.now();
        const endValue = Math.min(100, Math.max(0, percentage));

        const animateRing = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = endValue * easeOut;

            setDisplayPercentage(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animateRing);
            }
        };

        requestAnimationFrame(animateRing);
    }, [percentage]);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 ring-glow"
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-primary animate-savings-pulse">
                        {Math.round(displayPercentage)}%
                    </span>
                    <span className="text-xs text-muted-foreground">saved</span>
                </div>
            )}
        </div>
    );
}
