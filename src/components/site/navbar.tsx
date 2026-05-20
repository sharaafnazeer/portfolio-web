"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { navLinks, profile } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/site/theme-toggle";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/75 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="inline-flex size-7 items-center justify-center rounded-full bg-foreground text-background"
          >
            <span className="font-display text-sm leading-none">S</span>
          </span>
          <span>{profile.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex"
          >
            <Link href="/#contact">
              Let&apos;s talk
              <ArrowUpRight />
            </Link>
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            className="md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "block h-px w-4 bg-current transition-transform",
                  open && "translate-y-[3px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-px w-4 bg-current transition-transform",
                  open && "-translate-y-[3px] -rotate-45"
                )}
              />
            </div>
          </Button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 border-t border-border/60 bg-background/95 px-6 py-4 backdrop-blur-xl sm:px-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2 self-start">
              <Link href="/#contact" onClick={() => setOpen(false)}>
                Let&apos;s talk
                <ArrowUpRight />
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
