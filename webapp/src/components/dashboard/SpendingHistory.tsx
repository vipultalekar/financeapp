"use client";

import { Pencil, Trash2, Calendar } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import type { SpendingEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SpendingHistoryProps {
    entries: SpendingEntry[];
    onEdit: (entry: SpendingEntry) => void;
    onDelete: (entryId: string) => void;
}

export function SpendingHistory({ entries, onEdit, onDelete }: SpendingHistoryProps) {
    const { formatCurrency } = useCurrency();

    if (entries.length === 0) {
        return (
            <div className="empty-state-calm py-12">
                <div className="empty-icon w-16 h-16 mx-auto mb-4">
                    <div className="text-6xl opacity-40">📝</div>
                </div>
                <h3 className="empty-title">No expenses yet</h3>
                <p className="empty-description">
                    Click the edit button on a budget card to add your first expense
                </p>
            </div>
        );
    }

    // Sort entries by date (newest first)
    const sortedEntries = [...entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
    };

    return (
        <div className="space-y-2 animate-stagger-in">
            {sortedEntries.map((entry, index) => (
                <div
                    key={entry.id}
                    className={cn(
                        "glass-card p-3 sm:p-4 flex items-center justify-between gap-3",
                        "hover:bg-card/90 transition-all duration-200 group"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium text-base text-foreground truncate">
                                {entry.description}
                            </p>
                            <p className="font-bold text-base text-foreground shrink-0">
                                {formatCurrency(entry.amount)}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(entry.date)}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                            onClick={() => onEdit(entry)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onDelete(entry.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
