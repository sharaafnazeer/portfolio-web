"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Tri-state theme toggle: System → Light → Dark → System.
 *
 * Renders a 3-pill segmented control on `md+` (desktop) and a single
 * icon button that cycles through states on small screens.
 *
 * Until hydration completes we render an invisible placeholder so the
 * server-rendered HTML (which has no `theme` cookie/localStorage) matches
 * the client paint — this avoids the next-themes hydration mismatch.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="size-9 rounded-full border border-border/60 bg-background/40 md:w-[7.25rem]"
      />
    );
  }

  const current = theme === "system" ? "system" : resolvedTheme;
  const cycle = () => {
    if (theme === "system") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("system");
  };

  const SegBtn = ({
    id,
    label,
    icon: Icon,
  }: {
    id: "system" | "light" | "dark";
    label: string;
    icon: typeof Sun;
  }) => {
    const active =
      (id === "system" && theme === "system") ||
      (id !== "system" && theme !== "system" && current === id);
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        aria-pressed={active}
        onClick={() => setTheme(id)}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full transition-colors",
          active
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className="size-3.5" />
      </button>
    );
  };

  return (
    <>
      {/* Segmented control on md+ */}
      <div className="hidden items-center gap-0.5 rounded-full border border-border/60 bg-background/40 p-0.5 backdrop-blur md:inline-flex">
        <SegBtn id="system" label="System theme" icon={Monitor} />
        <SegBtn id="light" label="Light theme" icon={Sun} />
        <SegBtn id="dark" label="Dark theme" icon={Moon} />
      </div>

      {/* Cycle button on small screens */}
      <button
        type="button"
        onClick={cycle}
        aria-label={`Switch theme (current: ${theme})`}
        className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/40 text-muted-foreground backdrop-blur transition-colors hover:text-foreground md:hidden"
      >
        {theme === "system" ? (
          <Monitor className="size-4" />
        ) : current === "dark" ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )}
      </button>
    </>
  );
}
