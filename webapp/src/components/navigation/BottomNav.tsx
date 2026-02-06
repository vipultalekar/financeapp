"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, PieChart, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: PieChart, label: "Insights", href: "/insights" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 z-40">
      <div className="flex items-center justify-around px-2 sm:px-4 py-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 sm:px-4 py-1.5 rounded-xl transition-all min-w-[56px] min-h-[44px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "drop-shadow-[0_0_8px_hsl(var(--primary))]")} />
              <span className="text-[10px] sm:text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
