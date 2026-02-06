import { jsPDF } from "jspdf";
import type { UserProfile, DerivedFinancials, MonthlyExpenseEntry } from "@/lib/types";
import { CURRENCIES } from "@/lib/types";

// Category labels for variable expenses
const categoryLabels: Record<string, string> = {
    food: "Food",
    transport: "Transport",
    shopping: "Shopping",
    entertainment: "Entertainment",
    health: "Health",
    education: "Education",
    other: "Other",
};

// Category labels for fixed expenses
const fixedCategoryLabels: Record<string, string> = {
    rent: "Rent/Mortgage",
    utilities: "Utilities",
    subscriptions: "Subscriptions",
    insurance: "Insurance",
    other: "Other",
};

interface ReportData {
    profile: UserProfile;
    derivedFinancials: DerivedFinancials;
    currentMonthExpenses: MonthlyExpenseEntry[];
    month: string;
    year: number;
}

function formatCurrencyForReport(amount: number, currencyCode: string): string {
    const currency = CURRENCIES.find((c) => c.code === currencyCode);
    const symbol = currency?.symbol ?? "$";
    return `${symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getMonthName(monthIndex: number): string {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return months[monthIndex];
}

export function generateMonthlyReportPDF(data: ReportData): jsPDF {
    const { profile, derivedFinancials, currentMonthExpenses, month, year } = data;
    const fmt = (amount: number) => formatCurrencyForReport(amount, profile.currency);

    // Calculate totals
    const fixedExpensesTotal = profile.expenseBreakdown.reduce((sum, e) => sum + e.amount, 0);
    const variableExpensesTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalSpent = fixedExpensesTotal + variableExpensesTotal;
    const amountSaved = Math.max(0, profile.monthlyIncome - totalSpent);
    const savingsRate = profile.monthlyIncome > 0
        ? Math.round((amountSaved / profile.monthlyIncome) * 100)
        : 0;

    // Group variable expenses by category
    const expensesByCategory: Record<string, number> = {};
    for (const expense of currentMonthExpenses) {
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] ?? 0) + expense.amount;
    }

    // Create PDF
    const doc = new jsPDF();
    let y = 20;
    const leftMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - leftMargin * 2;

    // Helper function to check and add new page if needed
    const checkNewPage = (requiredSpace: number = 30) => {
        if (y > 270 - requiredSpace) {
            doc.addPage();
            y = 20;
        }
    };

    // Helper to draw a horizontal line
    const drawLine = () => {
        doc.setDrawColor(200, 200, 200);
        doc.line(leftMargin, y, pageWidth - leftMargin, y);
        y += 5;
    };

    // ===== HEADER =====
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 150, 136); // Teal color
    doc.text("Monthly Financial Report", leftMargin, y);
    y += 12;

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`${month} ${year}`, leftMargin, y);
    y += 8;

    doc.setFontSize(10);
    doc.text(`Prepared for: ${profile.name}`, leftMargin, y);
    y += 5;
    doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { dateStyle: "full" })}`, leftMargin, y);
    y += 10;

    drawLine();
    y += 5;

    // ===== MONTHLY SUMMARY =====
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Monthly Summary", leftMargin, y);
    y += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    const summaryItems = [
        { label: "Monthly Income", value: fmt(profile.monthlyIncome), color: [34, 197, 94] }, // Green
        { label: "Fixed Expenses", value: fmt(fixedExpensesTotal), color: [80, 80, 80] },
        { label: "Variable Expenses", value: fmt(variableExpensesTotal), color: [80, 80, 80] },
        { label: "Total Spent", value: fmt(totalSpent), color: [234, 88, 12] }, // Orange
        { label: "Amount Saved", value: fmt(amountSaved), color: [0, 150, 136] }, // Teal
        { label: "Savings Rate", value: `${savingsRate}%`, color: savingsRate >= profile.savingsTargetPercentage ? [34, 197, 94] : [234, 88, 12] },
        { label: "Savings Target", value: `${profile.savingsTargetPercentage}%`, color: [80, 80, 80] },
        { label: "Daily Budget", value: fmt(derivedFinancials.dailyBudget), color: [80, 80, 80] },
    ];

    for (const item of summaryItems) {
        doc.setTextColor(80, 80, 80);
        doc.text(item.label + ":", leftMargin, y);
        doc.setTextColor(item.color[0], item.color[1], item.color[2]);
        doc.text(item.value, leftMargin + 60, y);
        y += 7;
    }

    y += 5;
    drawLine();
    y += 5;

    // ===== FIXED EXPENSES BREAKDOWN =====
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Fixed Expenses Breakdown", leftMargin, y);
    y += 10;

    if (profile.expenseBreakdown.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text("Name", leftMargin, y);
        doc.text("Category", leftMargin + 60, y);
        doc.text("Amount", leftMargin + 120, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        for (const expense of profile.expenseBreakdown) {
            checkNewPage();
            const categoryLabel = fixedCategoryLabels[expense.category] ?? expense.category;
            doc.text(expense.name.slice(0, 25), leftMargin, y);
            doc.text(categoryLabel, leftMargin + 60, y);
            doc.text(fmt(expense.amount), leftMargin + 120, y);
            y += 6;
        }

        doc.setFont("helvetica", "bold");
        doc.text("Total", leftMargin, y);
        doc.setTextColor(0, 150, 136);
        doc.text(fmt(fixedExpensesTotal), leftMargin + 120, y);
        y += 7;
    } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("No fixed expenses recorded.", leftMargin, y);
        y += 7;
    }

    y += 5;
    drawLine();
    y += 5;

    // ===== VARIABLE EXPENSES BY CATEGORY =====
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Variable Expenses by Category", leftMargin, y);
    y += 10;

    const categoryEntries = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);

    if (categoryEntries.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text("Category", leftMargin, y);
        doc.text("Amount", leftMargin + 60, y);
        doc.text("Percentage", leftMargin + 120, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        for (const [category, amount] of categoryEntries) {
            checkNewPage();
            const label = categoryLabels[category] ?? category;
            const pct = variableExpensesTotal > 0 ? Math.round((amount / variableExpensesTotal) * 100) : 0;
            doc.text(label, leftMargin, y);
            doc.text(fmt(amount), leftMargin + 60, y);
            doc.text(`${pct}%`, leftMargin + 120, y);
            y += 6;
        }

        doc.setFont("helvetica", "bold");
        doc.text("Total", leftMargin, y);
        doc.setTextColor(0, 150, 136);
        doc.text(fmt(variableExpensesTotal), leftMargin + 60, y);
        y += 7;
    } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("No variable expenses tracked this month.", leftMargin, y);
        y += 7;
    }

    y += 5;
    drawLine();
    y += 5;

    // ===== VARIABLE EXPENSES DETAIL =====
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Variable Expenses Detail", leftMargin, y);
    y += 10;

    const sortedExpenses = [...currentMonthExpenses].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedExpenses.length > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text("Date", leftMargin, y);
        doc.text("Name", leftMargin + 30, y);
        doc.text("Category", leftMargin + 90, y);
        doc.text("Amount", leftMargin + 140, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        for (const expense of sortedExpenses) {
            checkNewPage();
            const date = new Date(expense.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const categoryLabel = categoryLabels[expense.category] ?? expense.category;
            doc.text(date, leftMargin, y);
            doc.text(expense.name.slice(0, 25), leftMargin + 30, y);
            doc.text(categoryLabel, leftMargin + 90, y);
            doc.text(fmt(expense.amount), leftMargin + 140, y);
            y += 6;
        }
    } else {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("No expenses tracked this month.", leftMargin, y);
        y += 7;
    }

    y += 5;
    drawLine();
    y += 5;

    // ===== GOALS PROGRESS =====
    if (profile.goals.length > 0) {
        checkNewPage(40);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(50, 50, 50);
        doc.text("Goals Progress", leftMargin, y);
        y += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 100, 100);
        doc.text("Goal", leftMargin, y);
        doc.text("Progress", leftMargin + 60, y);
        doc.text("Target", leftMargin + 100, y);
        doc.text("Deadline", leftMargin + 140, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        for (const goal of profile.goals) {
            checkNewPage();
            const progress = goal.targetAmount > 0
                ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
                : 0;
            const deadline = new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", year: "numeric" });

            doc.text(goal.name.slice(0, 25), leftMargin, y);
            doc.setTextColor(progress >= 100 ? 34 : 80, progress >= 100 ? 197 : 80, progress >= 100 ? 94 : 80);
            doc.text(`${progress}%`, leftMargin + 60, y);
            doc.setTextColor(80, 80, 80);
            doc.text(fmt(goal.targetAmount), leftMargin + 100, y);
            doc.text(deadline, leftMargin + 140, y);
            y += 6;
        }

        y += 5;
        drawLine();
        y += 5;
    }

    // ===== INSIGHTS =====
    checkNewPage(50);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text("Insights", leftMargin, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);

    // Fixed expenses ratio
    const fixedRatio = profile.monthlyIncome > 0
        ? Math.round((fixedExpensesTotal / profile.monthlyIncome) * 100)
        : 0;
    doc.text(`• Fixed Expenses Ratio: ${fixedRatio}% of income`, leftMargin, y);
    y += 6;
    if (fixedRatio > 50) {
        doc.setTextColor(234, 88, 12);
        doc.text("  ⚠ Above the recommended 50% threshold", leftMargin, y);
        y += 6;
        doc.setTextColor(80, 80, 80);
    }

    // Savings performance
    if (savingsRate >= profile.savingsTargetPercentage) {
        doc.setTextColor(34, 197, 94);
        doc.text(`• Savings Performance: Great! Saving ${savingsRate}% vs ${profile.savingsTargetPercentage}% target`, leftMargin, y);
    } else {
        doc.setTextColor(234, 88, 12);
        doc.text(`• Savings Performance: Below target. Saving ${savingsRate}% vs ${profile.savingsTargetPercentage}% target`, leftMargin, y);
    }
    y += 6;

    // Highest spending category
    doc.setTextColor(80, 80, 80);
    if (categoryEntries.length > 0) {
        const [highestCategory, highestAmount] = categoryEntries[0];
        const label = categoryLabels[highestCategory] ?? highestCategory;
        doc.text(`• Highest Spending Category: ${label} (${fmt(highestAmount)})`, leftMargin, y);
        y += 6;
    }

    // ===== FOOTER =====
    y += 10;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by Clarity - AI Finance Coach", leftMargin, y);

    return doc;
}

export function downloadMonthlyReport(data: ReportData): void {
    const doc = generateMonthlyReportPDF(data);
    doc.save(`financial-report-${data.month.toLowerCase()}-${data.year}.pdf`);
}

export function getCurrentMonthReportData(
    profile: UserProfile,
    derivedFinancials: DerivedFinancials,
    currentMonthExpenses: MonthlyExpenseEntry[]
): ReportData {
    const now = new Date();
    return {
        profile,
        derivedFinancials,
        currentMonthExpenses,
        month: getMonthName(now.getMonth()),
        year: now.getFullYear(),
    };
}

// Generate report for a specific month (for historical reports)
export function getMonthReportData(
    profile: UserProfile,
    derivedFinancials: DerivedFinancials,
    monthIndex: number,
    year: number
): ReportData {
    // Filter expenses for the specific month
    const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const monthExpenses = profile.monthlyExpenses.filter((e) => e.date.startsWith(monthKey));

    return {
        profile,
        derivedFinancials,
        currentMonthExpenses: monthExpenses,
        month: getMonthName(monthIndex),
        year,
    };
}
