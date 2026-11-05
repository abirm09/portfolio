"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components";
import { Moon, SunMedium, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const ThemeSwitcher = () => {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { theme, setTheme, resolvedTheme } = useTheme();

  if (!mounted) {
    return (
      <div className="ml-1">
        <div className="border-input bg-background/50 h-9 w-14 animate-pulse rounded-md border" />
      </div>
    );
  }

  const currentTheme = theme || resolvedTheme || "system";

  return (
    <div className="ml-1">
      <Select value={currentTheme} onValueChange={setTheme}>
        <SelectTrigger className="h-9 rounded-md px-2.5" aria-label="Select theme">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="light">
            <span className="flex items-center gap-2">
              <SunMedium className="h-4 w-4" />
              <span>Light</span>
            </span>
          </SelectItem>
          <SelectItem value="dark">
            <span className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </span>
          </SelectItem>
          <SelectItem value="system">
            <span className="flex items-center gap-2">
              <SunMoon className="h-4 w-4" />
              <span>System</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSwitcher;
