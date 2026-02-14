import type {
  SpendingCategory,
  MonthlySnapshot,
  Transaction,
  AIInsight,
  SavingsGoal,
  InvestmentTopic,
  CashFlowData,
  BudgetLimit,
  SpendingEntry,
} from "@/lib/types";

// Spending Categories with realistic Gen Z data
export const spendingCategories: SpendingCategory[] = [
  {
    id: "1",
    name: "Food & Delivery",
    icon: "utensils",
    color: "hsl(var(--chart-1))",
    amount: 680,
    percentage: 28,
    trend: "up",
    trendAmount: 12,
  },
  {
    id: "2",
    name: "Subscriptions",
    icon: "tv",
    color: "hsl(var(--chart-2))",
    amount: 145,
    percentage: 6,
    trend: "stable",
    trendAmount: 0,
  },
  {
    id: "3",
    name: "Transport",
    icon: "car",
    color: "hsl(var(--chart-3))",
    amount: 320,
    percentage: 13,
    trend: "down",
    trendAmount: 8,
  },
  {
    id: "4",
    name: "Shopping",
    icon: "shopping-bag",
    color: "hsl(var(--chart-4))",
    amount: 450,
    percentage: 19,
    trend: "up",
    trendAmount: 25,
  },
  {
    id: "5",
    name: "Entertainment",
    icon: "gamepad-2",
    color: "hsl(var(--chart-5))",
    amount: 180,
    percentage: 7,
    trend: "down",
    trendAmount: 5,
  },
  {
    id: "6",
    name: "Rent & Utilities",
    icon: "home",
    color: "hsl(220, 15%, 40%)",
    amount: 650,
    percentage: 27,
    trend: "stable",
    trendAmount: 0,
  },
];

// Monthly snapshots for the past 6 months
export const monthlySnapshots: MonthlySnapshot[] = [
  { month: "Sep", income: 4200, spent: 3100, saved: 1100, savingsRate: 26 },
  { month: "Oct", income: 4200, spent: 3400, saved: 800, savingsRate: 19 },
  { month: "Nov", income: 4500, spent: 3200, saved: 1300, savingsRate: 29 },
  { month: "Dec", income: 4800, spent: 4100, saved: 700, savingsRate: 15 },
  { month: "Jan", income: 4200, spent: 2900, saved: 1300, savingsRate: 31 },
  { month: "Feb", income: 4200, spent: 2425, saved: 1775, savingsRate: 42 },
];

// Current month data
export const currentMonthData = {
  income: 4200,
  spent: 2425,
  saved: 1775,
  savingsRate: 42,
  daysLeft: 12,
  projectedSavings: 1900,
};

// Cash flow trend data
export const cashFlowData: CashFlowData[] = [
  { date: "Feb 1", balance: 4200 },
  { date: "Feb 5", balance: 3550 },
  { date: "Feb 10", balance: 3200 },
  { date: "Feb 15", balance: 2900 },
  { date: "Feb 20", balance: 2600 },
  { date: "Feb 25", balance: 2100 },
  { date: "Today", balance: 1775 },
];

// Recent transactions
export const recentTransactions: Transaction[] = [
  { id: "1", description: "Uber Eats - Chipotle", amount: 18.50, category: "Food & Delivery", date: "2024-02-05", type: "expense" },
  { id: "2", description: "Spotify Premium", amount: 10.99, category: "Subscriptions", date: "2024-02-04", type: "expense" },
  { id: "3", description: "Target", amount: 67.23, category: "Shopping", date: "2024-02-03", type: "expense" },
  { id: "4", description: "Lyft to airport", amount: 42.00, category: "Transport", date: "2024-02-02", type: "expense" },
  { id: "5", description: "Salary deposit", amount: 4200, category: "Income", date: "2024-02-01", type: "income" },
];

// AI-generated insights
export const aiInsights: AIInsight[] = [
  {
    id: "1",
    type: "pattern",
    title: "Late-night ordering",
    message: "You spend more on food delivery when workdays go past 10 hours. That's human. But a quick meal prep on Sunday could save you around ₹12,000/month.",
    icon: "moon",
    action: { label: "Show me how", href: "/learn" },
  },
  {
    id: "2",
    type: "celebration",
    title: "Best savings month yet!",
    message: "You saved 42% of your income this month. That's your highest ever. Whatever you're doing, it's working.",
    icon: "sparkles",
  },
  {
    id: "3",
    type: "suggestion",
    title: "Subscription check-in",
    message: "You have 6 active subscriptions totaling ₹2,500/month. When's the last time you used Apple TV+?",
    icon: "credit-card",
    action: { label: "Review subscriptions", href: "/insights" },
  },
  {
    id: "4",
    type: "tip",
    title: "Small win opportunity",
    message: "Switching your daily coffee from Starbucks to making it at home could save you ₹3,500/month. That's ₹42,000/year toward your goals.",
    icon: "coffee",
  },
];

// Savings goals
export const savingsGoals: SavingsGoal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 4200,
    deadline: "2024-12-31",
    monthlyContribution: 500,
    icon: "shield",
    color: "hsl(var(--chart-1))",
  },
  {
    id: "2",
    name: "Japan Trip",
    targetAmount: 5000,
    currentAmount: 1800,
    deadline: "2025-04-01",
    monthlyContribution: 300,
    icon: "plane",
    color: "hsl(var(--chart-2))",
  },
  {
    id: "3",
    name: "New Laptop",
    targetAmount: 2000,
    currentAmount: 650,
    deadline: "2024-09-01",
    monthlyContribution: 200,
    icon: "laptop",
    color: "hsl(var(--chart-3))",
  },
];

// Investment education topics
export const investmentTopics: InvestmentTopic[] = [
  {
    id: "1",
    title: "What even is investing?",
    description: "The basics, explained like you're smart but new to this",
    icon: "lightbulb",
    riskLevel: "low",
    timeHorizon: "Learn in 5 min",
    content: "Investing is basically putting your money to work so it can grow over time. Instead of letting cash sit in a savings account earning almost nothing, you buy things that might increase in value - like pieces of companies (stocks), loans to governments or companies (bonds), or real estate.\n\nThe key idea: time is your superpower. The earlier you start, the more your money can compound (earn returns on your returns). Even small amounts invested consistently can grow significantly over decades.",
  },
  {
    id: "2",
    title: "Is this risky?",
    description: "Understanding risk without the fear-mongering",
    icon: "scale",
    riskLevel: "medium",
    timeHorizon: "Learn in 7 min",
    content: "All investing involves some risk, but 'risky' isn't the same as 'bad.' Here's the real talk:\n\n- Keeping all your money in cash? That's also a risk - inflation eats away at its value every year.\n- Stock market goes up and down, but historically, it's gone up way more than it's gone down over long periods.\n- The key is matching your risk level to your timeline. Money you need next year? Keep it safe. Money for retirement in 30+ years? You can ride out the waves.",
  },
  {
    id: "3",
    title: "Index funds: the cheat code",
    description: "Why most experts recommend these for beginners",
    icon: "trending-up",
    riskLevel: "medium",
    timeHorizon: "Learn in 6 min",
    content: "Index funds are like buying a tiny piece of the entire stock market (or a specific slice of it) all at once. Instead of trying to pick winning stocks, you just... own a little bit of everything.\n\nWhy this works:\n- You automatically get diversification (don't put all eggs in one basket)\n- Super low fees compared to managed funds\n- Historically outperforms most actively managed funds\n- Takes about 10 minutes to set up and basically runs itself\n\nPopular options: S&P 500 index funds, Total Market index funds",
  },
  {
    id: "4",
    title: "401(k) & IRA explained",
    description: "Free money you might be leaving on the table",
    icon: "piggy-bank",
    riskLevel: "low",
    timeHorizon: "Learn in 8 min",
    content: "These are special accounts that give you tax benefits for saving for retirement.\n\n401(k): Through your employer. Key thing - if they offer a match, that's literally free money. If they match 50% up to 6%, put in at least 6%. You just got a 50% instant return.\n\nIRA (Individual Retirement Account): You open this yourself. Traditional IRA = tax break now, pay taxes later. Roth IRA = pay taxes now, withdraw tax-free later (usually better if you're young).\n\nThe move: At minimum, get the full employer match. Then max out a Roth IRA ($7,000/year in 2024). Then add more to 401(k) if you can.",
  },
  {
    id: "5",
    title: "When should I start?",
    description: "Spoiler: probably now",
    icon: "clock",
    riskLevel: "low",
    timeHorizon: "Learn in 4 min",
    content: "The best time to start investing was yesterday. The second best time is today.\n\nHere's why timing matters less than you think:\n- Trying to time the market (buy low, sell high) almost never works, even for pros\n- Regular, consistent investing beats trying to be clever\n- $100/month starting at 25 can grow to more than $200/month starting at 35\n\nBefore you invest though:\n1. Have an emergency fund (3-6 months expenses)\n2. Pay off high-interest debt (credit cards)\n3. Then start investing, even if it's just $50/month",
  },
];

// Financial vibes descriptions
export const vibeDescriptions = {
  control: {
    title: "Strict Budgeting",
    description: "I want to track every penny and stick to a strict plan.",
    aiHelp: "I'll help you track every expense and keep you exactly on budget.",
  },
  save: {
    title: "Aggressive Saving",
    description: "I want to save as much as possible right now.",
    aiHelp: "I'll help you find ways to cut costs and boost your savings.",
  },
  invest: {
    title: "Growing Wealth",
    description: "I want to focus on investing and growing my money.",
    aiHelp: "I'll help you balance spending and investing for long-term growth.",
  },
  "figuring-out": {
    title: "Just Starting",
    description: "I'm just starting to figure out my finances.",
    aiHelp: "I'll help you understand where your money goes without any pressure.",
  },
};

// Income range options for onboarding
export const incomeRanges = [
  { value: 25000, label: "Under ₹30,000" },
  { value: 40000, label: "₹30,000 - ₹50,000" },
  { value: 60000, label: "₹50,000 - ₹75,000" },
  { value: 90000, label: "₹75,000 - ₹1,00,000" },
  { value: 125000, label: "₹1,00,000 - ₹1,50,000" },
  { value: 175000, label: "₹1,50,000 - ₹2,00,000" },
  { value: 250000, label: "Over ₹2,00,000" },
];

// Budget limits and spending tracking
export const budgetLimits: BudgetLimit[] = [
  {
    id: "1",
    category: "food",
    categoryName: "Food & Dining",
    limit: 1000,
    spent: 200,
    icon: "utensils",
    color: "hsl(var(--chart-1))",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "2",
    category: "transport",
    categoryName: "Transport",
    limit: 2000,
    spent: 0,
    icon: "car",
    color: "hsl(var(--chart-3))",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    category: "shopping",
    categoryName: "Shopping",
    limit: 1500,
    spent: 450,
    icon: "shopping-bag",
    color: "hsl(var(--chart-4))",
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "4",
    category: "entertainment",
    categoryName: "Entertainment",
    limit: 800,
    spent: 180,
    icon: "gamepad-2",
    color: "hsl(var(--chart-5))",
    createdAt: "2024-02-01T00:00:00Z",
  },
];

export const spendingEntries: SpendingEntry[] = [
  {
    id: "1",
    budgetId: "1",
    description: "Lunch at restaurant",
    amount: 200,
    date: "2024-02-05T12:30:00Z",
    createdAt: "2024-02-05T12:30:00Z",
  },
  {
    id: "2",
    budgetId: "3",
    description: "New headphones",
    amount: 250,
    date: "2024-02-03T15:00:00Z",
    createdAt: "2024-02-03T15:00:00Z",
  },
  {
    id: "3",
    budgetId: "3",
    description: "Clothing",
    amount: 200,
    date: "2024-02-01T10:00:00Z",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "4",
    budgetId: "4",
    description: "Movie tickets",
    amount: 180,
    date: "2024-02-04T19:00:00Z",
    createdAt: "2024-02-04T19:00:00Z",
  },
];

