"use client";

import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Target, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BarChart3, label: "Insights", href: "/insights" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: User, label: "Profile", href: "/profile" },
];

import { motion, AnimatePresence } from "framer-motion";

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 sm:pb-8 pointer-events-none">
      <div className="bg-card/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-w-lg mx-auto pointer-events-auto">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl relative transition-colors duration-300 min-w-[64px]",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-xl shadow-[inset_0_0_8px_rgba(255,255,255,0.02)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <motion.div
                  whileTap={{ scale: 0.8 }}
                  animate={isActive ? { y: -2 } : { y: 0 }}
                >
                  <Icon className={cn("w-5 h-5 relative z-10", isActive && "drop-shadow-[0_0_8px_hsla(var(--primary),0.6)]")} />
                </motion.div>
                <span className="text-[9px] font-black uppercase tracking-widest relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
