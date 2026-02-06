"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CalmEmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export function CalmEmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    className,
}: CalmEmptyStateProps) {
    return (
        <div className={cn("empty-state-calm", className)}>
            <Icon className="empty-icon w-10 h-10" />
            <h4 className="empty-title">{title}</h4>
            {description && (
                <p className="empty-description">{description}</p>
            )}
            {actionLabel && onAction && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
