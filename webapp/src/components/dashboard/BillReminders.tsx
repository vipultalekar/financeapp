"use client";

import { useState } from "react";
import {
    Home,
    CreditCard,
    Banknote,
    Zap,
    Shield,
    MoreHorizontal,
    Plus,
    Trash2,
    Bell,
    Check,
    Calendar,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalmEmptyState } from "@/components/ui/CalmEmptyState";
import { SuccessToast, useSuccessToast } from "@/components/ui/SuccessToast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { BillCategory, Bill } from "@/lib/types";

// Category icon map
const categoryIconMap: Record<BillCategory, typeof Home> = {
    rent: Home,
    creditCard: CreditCard,
    emi: Banknote,
    utilities: Zap,
    insurance: Shield,
    other: MoreHorizontal,
};

// Category colors
const categoryColorMap: Record<BillCategory, string> = {
    rent: "hsl(217, 91%, 60%)",
    creditCard: "hsl(260, 60%, 55%)",
    emi: "hsl(35, 70%, 55%)",
    utilities: "hsl(210, 60%, 55%)",
    insurance: "hsl(120, 50%, 50%)",
    other: "hsl(220, 15%, 50%)",
};

// Category labels
const categoryLabels: Record<BillCategory, string> = {
    rent: "Rent",
    creditCard: "Credit Card",
    emi: "EMI / Loan",
    utilities: "Utilities",
    insurance: "Insurance",
    other: "Other",
};

const ALL_CATEGORIES: BillCategory[] = [
    "rent",
    "creditCard",
    "emi",
    "utilities",
    "insurance",
    "other",
];

export function BillReminders() {
    const {
        profile,
        addBill,
        updateBill,
        deleteBill,
        markBillPaid,
        upcomingBills,
    } = useUserProfile();
    const { formatCurrency, symbol } = useCurrency();
    const { showToast, toastProps } = useSuccessToast();

    // Form state
    const [sheetOpen, setSheetOpen] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState<BillCategory>("rent");
    const [dueDate, setDueDate] = useState("1");
    const [reminderDays, setReminderDays] = useState("3");

    if (!profile) return null;

    const bills = profile.bills;
    const today = new Date();
    const currentDay = today.getDate();

    // Calculate days until due
    const getDaysUntilDue = (dueDateNum: number): number => {
        let days = dueDateNum - currentDay;
        if (days < 0) {
            // Already passed this month
            const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            days = daysInMonth - currentDay + dueDateNum;
        }
        return days;
    };

    // Get urgency level
    const getUrgency = (bill: Bill): "overdue" | "urgent" | "upcoming" | "normal" => {
        if (bill.isPaid) return "normal";
        const days = getDaysUntilDue(bill.dueDate);
        if (days === 0 || (bill.dueDate < currentDay && !bill.isPaid)) return "overdue";
        if (days <= 3) return "urgent";
        if (days <= 7) return "upcoming";
        return "normal";
    };

    const handleAddBill = () => {
        if (!name.trim() || !amount || parseFloat(amount) <= 0) return;

        addBill({
            name: name.trim(),
            amount: parseFloat(amount),
            category,
            dueDate: parseInt(dueDate),
            isRecurring: true,
            reminderDays: parseInt(reminderDays),
        });

        // Show success toast
        showToast(`${name} added`);

        // Reset form
        setName("");
        setAmount("");
        setCategory("rent");
        setDueDate("1");
        setReminderDays("3");
        setSheetOpen(false);
    };

    // Handle marking bill as paid with toast
    const handleMarkPaid = (billId: string, billName: string) => {
        markBillPaid(billId);
        showToast(`${billName} marked as paid ✓`);
    };

    // Separate bills by status
    const unpaidBills = bills.filter((b) => !b.isPaid).sort((a, b) => {
        const daysA = getDaysUntilDue(a.dueDate);
        const daysB = getDaysUntilDue(b.dueDate);
        return daysA - daysB;
    });
    const paidBills = bills.filter((b) => b.isPaid);

    // Calculate total upcoming payments
    const totalUpcoming = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Bills & Reminders</h3>
                    <p className="text-lg font-bold">
                        {formatCurrency(totalUpcoming)}
                        <span className="text-xs font-normal text-muted-foreground"> upcoming</span>
                    </p>
                </div>
                <Button size="sm" onClick={() => setSheetOpen(true)} className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add
                </Button>
            </div>

            {/* Urgent Bills Alert */}
            {upcomingBills.length > 0 && (
                <div className="glass-card p-4 border-accent/30 bg-accent/5">
                    <div className="flex items-start gap-3">
                        <Bell className="w-5 h-5 text-accent shrink-0 mt-0.5 animate-pulse" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-accent">
                                Gentle reminder
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {upcomingBills.length} bill{upcomingBills.length > 1 ? "s" : ""} due soon:
                            </p>
                            <div className="mt-2 space-y-2">
                                {upcomingBills.slice(0, 3).map((bill) => {
                                    const Icon = categoryIconMap[bill.category];
                                    const urgency = getUrgency(bill);
                                    const daysLeft = getDaysUntilDue(bill.dueDate);

                                    return (
                                        <div key={bill.id} className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm">
                                                <Icon className="w-4 h-4" style={{ color: categoryColorMap[bill.category] }} />
                                                <span>{bill.name}</span>
                                                <span className={cn(
                                                    "text-xs px-1.5 py-0.5 rounded-full",
                                                    urgency === "overdue" && "bg-destructive/20 text-destructive",
                                                    urgency === "urgent" && "bg-warning/20 text-warning",
                                                    urgency === "upcoming" && "bg-accent/20 text-accent"
                                                )}>
                                                    {urgency === "overdue" ? "Overdue" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                                                </span>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{formatCurrency(bill.amount)}</span>
                                                <button
                                                    onClick={() => handleMarkPaid(bill.id, bill.name)}
                                                    className="p-1 rounded-md bg-success/20 text-white hover:bg-success/30"
                                                    title="Mark as paid"
                                                >
                                                    <Check className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* All Bills List */}
            {unpaidBills.length > 0 ? (
                <div className="glass-card-3d p-4 space-y-3">
                    {unpaidBills.map((bill) => {
                        const Icon = categoryIconMap[bill.category];
                        const color = categoryColorMap[bill.category];
                        const urgency = getUrgency(bill);
                        const daysLeft = getDaysUntilDue(bill.dueDate);

                        return (
                            <div key={bill.id} className="flex items-center gap-3 group hover-scale-subtle">
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${color}20` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm truncate">{bill.name}</span>
                                        <span className="font-semibold text-sm ml-2 shrink-0">
                                            {formatCurrency(bill.amount)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Due {bill.dueDate}{getOrdinal(bill.dueDate)}
                                        </span>
                                        <span className={cn(
                                            "text-xs",
                                            urgency === "overdue" && "text-destructive",
                                            urgency === "urgent" && "text-warning",
                                            urgency === "upcoming" && "text-accent",
                                            urgency === "normal" && "text-muted-foreground"
                                        )}>
                                            • {urgency === "overdue" ? "Overdue!" : `${daysLeft} days left`}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleMarkPaid(bill.id, bill.name)}
                                        className="p-1.5 rounded-md bg-success/10 text-white hover:bg-success/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Mark as paid"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteBill(bill.id)}
                                        className="p-1.5 rounded-md hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : bills.length === 0 ? (
                <CalmEmptyState
                    icon={Bell}
                    title="No bills or reminders set up yet"
                    description="Track rent, credit cards, and recurring bills to stay on top of due dates"
                    actionLabel="Add your first bill"
                    onAction={() => setSheetOpen(true)}
                    className="glass-card"
                />
            ) : null}

            {/* Paid Bills This Month */}
            {paidBills.length > 0 && (
                <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Check className="w-3 h-3 text-white" />
                        Paid this month
                    </p>
                    <div className="space-y-2">
                        {paidBills.map((bill) => (
                            <div
                                key={bill.id}
                                className="flex items-center justify-between text-sm text-muted-foreground bg-success/5 rounded-lg px-3 py-2 line-through"
                            >
                                <span>{bill.name}</span>
                                <span>{formatCurrency(bill.amount)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Bill Sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="bottom" className="rounded-t-2xl">
                    <SheetHeader className="text-left">
                        <SheetTitle>Add Bill Reminder</SheetTitle>
                        <SheetDescription>
                            Set up a reminder for recurring bills.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="bill-name">Name</Label>
                            <Input
                                id="bill-name"
                                placeholder="e.g. Rent, Credit Card, WiFi"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="bill-amount">Amount ({symbol})</Label>
                                <Input
                                    id="bill-amount"
                                    type="number"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bill-due">Due Date (day of month)</Label>
                                <Input
                                    id="bill-due"
                                    type="number"
                                    placeholder="1"
                                    min="1"
                                    max="31"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={category}
                                    onValueChange={(val) => setCategory(val as BillCategory)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ALL_CATEGORIES.map((cat) => {
                                            const Icon = categoryIconMap[cat];
                                            return (
                                                <SelectItem key={cat} value={cat}>
                                                    <span className="flex items-center gap-2">
                                                        <Icon className="w-4 h-4" style={{ color: categoryColorMap[cat] }} />
                                                        {categoryLabels[cat]}
                                                    </span>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reminder-days">Remind me (days before)</Label>
                                <Input
                                    id="reminder-days"
                                    type="number"
                                    placeholder="3"
                                    min="0"
                                    max="30"
                                    value={reminderDays}
                                    onChange={(e) => setReminderDays(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full mt-2"
                            onClick={handleAddBill}
                            disabled={!name.trim() || !amount || parseFloat(amount) <= 0}
                        >
                            Add Bill
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Success Toast */}
            <SuccessToast {...toastProps} />
        </div>
    );
}

// Helper function for ordinal suffix
function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}
