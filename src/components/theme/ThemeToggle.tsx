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
      <Button variant="ghost" size="icon" pill className="size-11" disabled>
        <span className="w-5 h-5 rounded-pill bg-muted animate-pulse" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      pill
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="btn-press size-11 text-muted-foreground hover:text-foreground hover:bg-muted"
    >
      {isDark ? (
        <HugeiconsIcon icon={Sun01Icon} size={20} className="text-sun-500" />
      ) : (
        <HugeiconsIcon icon={Moon02Icon} size={20} className="text-foreground" />
      )}
    </Button>
  );
}
