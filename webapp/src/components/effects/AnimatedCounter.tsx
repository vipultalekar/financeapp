"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1000,
  className,
  decimals = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const displayValueRef = useRef(0);

  // Keep ref in sync with state for access in effects
  useEffect(() => {
    displayValueRef.current = displayValue;
  }, [displayValue]);

  const animateValue = useCallback((start: number, end: number, animDuration: number) => {
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animDuration, 1);

      // Easing function - ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue(0, value, duration);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated, animateValue]);

  // Re-animate when value changes
  useEffect(() => {
    if (hasAnimated) {
      animateValue(displayValueRef.current, value, duration / 2);
    }
  }, [value, hasAnimated, duration, animateValue]);

  const formattedValue = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
