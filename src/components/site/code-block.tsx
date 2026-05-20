"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Client wrapper around the `<pre>` blocks produced by rehype-pretty-code.
 *
 * Responsibilities:
 *  - Render a "Copy" button anchored to the top-right of the block.
 *  - Show the source language (from `data-language`) as a small label so
 *    readers know what's being highlighted.
 *  - Strip the trailing newline before copying (Shiki's last token is
 *    usually an empty line which is noise in the clipboard).
 */
export function CodeBlock({
  className,
  children,
  ...props
}: React.ComponentProps<"pre"> & { "data-language"?: string }) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);
  const language = (props as Record<string, string>)["data-language"];

  const handleCopy = React.useCallback(async () => {
    const text = ref.current?.innerText.replace(/\n$/, "") ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be blocked in certain contexts (no HTTPS, no perms);
      // failing silently is acceptable here.
    }
  }, []);

  return (
    <div className="group relative">
      {language && language !== "plaintext" ? (
        <span className="pointer-events-none absolute right-12 top-2 z-10 select-none rounded-md bg-background/60 px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          {language}
        </span>
      ) : null}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        title={copied ? "Copied" : "Copy"}
        className={cn(
          "absolute right-2 top-2 z-10 inline-flex size-7 items-center justify-center rounded-md border border-border/60 bg-background/60 text-muted-foreground backdrop-blur transition-all hover:text-foreground",
          "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
          copied && "text-foreground opacity-100"
        )}
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
      <pre ref={ref} className={className} {...props}>
        {children}
      </pre>
    </div>
  );
}
