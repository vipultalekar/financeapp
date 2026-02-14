"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessToastProps {
    message: string;
    show: boolean;
    onClose: () => void;
    duration?: number;
}

export function SuccessToast({
    message,
    show,
    onClose,
    duration = 2000
}: SuccessToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(onClose, 300); // Wait for fade out animation
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!show && !isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-24 left-1/2 -translate-x-1/2 z-50",
                "bg-success/90 text-white-foreground px-4 py-2.5 rounded-full",
                "flex items-center gap-2 text-sm font-medium",
                "shadow-lg backdrop-blur-sm",
                "transition-all duration-300",
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
            )}
        >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-success-pop">
                <Check className="w-3 h-3" />
            </div>
            {message}
        </div>
    );
}

// Hook to easily use the success toast
export function useSuccessToast() {
    const [toastState, setToastState] = useState({
        show: false,
        message: "",
    });

    const showToast = (message: string) => {
        setToastState({ show: true, message });
    };

    const hideToast = () => {
        setToastState({ show: false, message: "" });
    };

    return {
        showToast,
        hideToast,
        toastProps: {
            show: toastState.show,
            message: toastState.message,
            onClose: hideToast,
        },
    };
}
