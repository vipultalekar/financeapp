"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Target, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BarChart3, label: "Spending", href: "/insights" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: Wallet, label: "Budget", href: "/money-tracker" },
];

import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/global/Logo";

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 sm:pb-5 pointer-events-none">
      <div className="bg-[#0A0A0B]/80 backdrop-blur-md border border-white/5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-lg mx-auto pointer-events-auto">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl relative transition-all duration-500 min-w-[60px]",
                  isActive ? "text-primary scale-110" : "text-muted-foreground/60 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  initial={false}
                  animate={isActive ? { y: -2 } : { y: 0 }}
                >
                  <Icon className={cn(
                    "w-5 h-5 relative z-10 transition-all duration-500",
                    isActive ? "drop-shadow-[0_0_12px_hsla(var(--primary),0.8)]" : "opacity-70"
                  )} />
                </motion.div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-[0.1em] relative z-10 transition-all duration-500",
                  isActive ? "opacity-100" : "opacity-40"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
