import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
    className?: string;
    variant?: "default" | "minimal";
    size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className, variant = "default", size = "md" }: LogoProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-20 h-20 md:w-32 md:h-32",
    };

    return (
        <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
            {variant === "default" ? (
                <img
                    src="/logo.svg"
                    alt="Rupiyo Logo"
                    className="w-full h-full drop-shadow-2xl"
                />
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Minimalist Rupee icon for smaller UI elements */}
                    <svg viewBox="0 0 512 512" fill="none" className="w-[70%] h-[70%] drop-shadow-lg" stroke="currentColor">
                        <path
                            d="M140 140H372M140 210H372M200 210C200 340 320 340 320 340M200 280L340 420"
                            strokeWidth="48"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="stroke-white"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}
