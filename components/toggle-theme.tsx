"use client";
// @ts-nocheck

import * as React from "react";
import { MonitorCog, MoonStar, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  {
    icon: MonitorCog,
    value: "system",
  },
  {
    icon: Sun,
    value: "light",
  },
  {
    icon: MoonStar,
    value: "dark",
  },
];

export function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-md",
        "dark:bg-white/10 dark:border-white/20"
      )}
    >
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon;

        return (
          <motion.button
            key={option.value} // ✅ fixes the “key” warning
            type="button"
            onClick={() => setTheme(option.value)}
            className={cn(
              "relative flex items-center justify-center rounded-full p-1.5 transition",
              theme === option.value
                ? "bg-white text-black dark:bg-black dark:text-white"
                : "text-gray-400 hover:bg-white/10 dark:hover:bg-white/20"
            )}
            whileTap={{ scale: 0.85 }}
          >
            <Icon className="h-4 w-4" />
          </motion.button>
        );
      })}
    </div>
  );
}
