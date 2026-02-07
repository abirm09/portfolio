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
  const { setTheme, resolvedTheme } = useTheme();

  if (!mounted) return null;
  return (
    <div className="ml-1">
      <Select defaultValue={resolvedTheme} onValueChange={setTheme}>
        <SelectTrigger className="rounded-sm">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <SunMedium />
          </SelectItem>
          <SelectItem value="dark">
            <Moon />
          </SelectItem>
          <SelectItem value="system">
            <SunMoon />
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSwitcher;
