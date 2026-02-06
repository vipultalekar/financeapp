// Finance Coach Types

export type FinancialVibe =
  | "control"
  | "save"
  | "invest"
  | "figuring-out";

// Currency types
export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "CAD" | "AUD" | "JPY";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20AC", name: "Euro" },
  { code: "GBP", symbol: "\u00A3", name: "British Pound" },
  { code: "INR", symbol: "\u20B9", name: "Indian Rupee" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "\u00A5", name: "Japanese Yen" },
];

// Goal types
export type GoalCategory =
  | "emergency-fund"
  | "vacation"
  | "car"
  | "house"
  | "education"
  | "retirement"
  | "other";

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: GoalCategory;
  createdAt: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: "rent" | "utilities" | "subscriptions" | "insurance" | "other";
}

// Monthly variable expense tracking
export type VariableExpenseCategory = "food" | "transport" | "shopping" | "entertainment" | "health" | "education" | "other";

export interface MonthlyExpenseEntry {
  id: string;
  name: string;
  amount: number;
  category: VariableExpenseCategory;
  date: string; // ISO date string
}

// Subscription tracking
export type SubscriptionCategory = "streaming" | "music" | "gaming" | "productivity" | "fitness" | "news" | "cloud" | "other";

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: SubscriptionCategory;
  billingCycle: "weekly" | "monthly" | "quarterly" | "yearly";
  nextBillingDate: string; // ISO date string
  lastUsed?: string; // ISO date string - to detect forgotten subscriptions
  isActive: boolean;
  createdAt: string;
}

// Bill & Reminder types
export type BillCategory = "rent" | "creditCard" | "emi" | "utilities" | "insurance" | "other";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  category: BillCategory;
  dueDate: number; // Day of month (1-31)
  isRecurring: boolean;
  reminderDays: number; // Days before due date to remind
  isPaid: boolean; // For current month
  lastPaidDate?: string; // ISO date string
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  onboardingComplete: boolean;
  monthlyIncome: number;
  fixedExpenses: number;
  expenseBreakdown: ExpenseItem[];
  savingsTargetPercentage: number;
  financialVibe: FinancialVibe;
  currency: CurrencyCode;
  goals: Goal[];
  monthlyExpenses: MonthlyExpenseEntry[];
  subscriptions: Subscription[];
  bills: Bill[];
  createdAt: string;
}


// Derived financial data computed from user profile
export interface DerivedFinancials {
  availableForSpending: number;
  targetSavingsAmount: number;
  actualSavingsRate: number;
  spent: number;
  saved: number;
  daysInMonth: number;
  daysLeft: number;
  dailyBudget: number;
}

export interface SpendingCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  percentage: number;
  trend: "up" | "down" | "stable";
  trendAmount: number;
}

export interface MonthlySnapshot {
  month: string;
  income: number;
  spent: number;
  saved: number;
  savingsRate: number;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "income" | "expense";
}

export interface AIInsight {
  id: string;
  type: "pattern" | "suggestion" | "celebration" | "tip";
  title: string;
  message: string;
  icon: string;
  action?: {
    label: string;
    href: string;
  };
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
  icon: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  visual?: ChatVisual;
}

export interface ChatVisual {
  type: "bar-chart" | "pie-chart" | "progress" | "comparison";
  data: Record<string, unknown>;
  title?: string;
}

export interface InvestmentTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  riskLevel: "low" | "medium" | "high";
  timeHorizon: string;
  content: string;
}

export interface CashFlowData {
  date: string;
  balance: number;
}
