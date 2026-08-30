"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
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
        <div className="h-9 w-14 rounded-md border border-input bg-background/50 animate-pulse" />
      </div>
    );
  }

  const currentTheme = theme || resolvedTheme || "system";

  return (
    <div className="ml-1">
      <Select value={currentTheme} onValueChange={setTheme}>
        <SelectTrigger className="rounded-md h-9 px-2.5" aria-label="Select theme">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="light">
            <span className="flex items-center gap-2">
              <SunMedium className="w-4 h-4" />
              <span>Light</span>
            </span>
          </SelectItem>
          <SelectItem value="dark">
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span>Dark</span>
            </span>
          </SelectItem>
          <SelectItem value="system">
            <span className="flex items-center gap-2">
              <SunMoon className="w-4 h-4" />
              <span>System</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSwitcher;
