"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun01Icon, Moon02Icon } from "@hugeicons/core-free-icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg" disabled>
        <span className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="btn-press w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {isDark ? (
        <HugeiconsIcon icon={Sun01Icon} size={18} className="text-amber-400" />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} size={18} className="text-foreground" />
      )}
    </Button>
  );
}
