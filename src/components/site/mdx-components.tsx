import * as React from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/site/code-block";

type AnchorProps = React.ComponentProps<"a">;
type HeadingProps = React.ComponentProps<"h1">;
type PreProps = React.ComponentProps<"pre"> & {
  "data-language"?: string;
  "data-theme"?: string;
};
type CodeProps = React.ComponentProps<"code"> & {
  "data-language"?: string;
  "data-theme"?: string;
};

function isExternal(href: string | undefined) {
  return !!href && /^https?:\/\//.test(href);
}

export const mdxComponents = {
  h1: ({ className, ...props }: HeadingProps) => (
    <h1
      className={cn(
        "mt-12 mb-6 font-display text-4xl leading-tight tracking-tight sm:text-5xl",
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: HeadingProps) => (
    <h2
      className={cn(
        "mt-12 mb-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl",
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HeadingProps) => (
    <h3
      className={cn(
        "mt-10 mb-3 font-display text-2xl leading-tight",
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: HeadingProps) => (
    <h4
      className={cn(
        "mt-8 mb-2 font-display text-xl leading-tight",
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.ComponentProps<"p">) => (
    <p
      className={cn(
        "my-5 text-base leading-[1.75] text-foreground/85 sm:text-lg",
        className
      )}
      {...props}
    />
  ),
  a: ({ className, href, ...props }: AnchorProps) => {
    // Heading-anchor links from rehype-autolink-headings already have their
    // own styling in globals.css — don't apply the body-link chip styles.
    const isHeadingAnchor =
      typeof className === "string" && className.includes("heading-anchor");
    if (isHeadingAnchor) {
      return <a href={href} className={className} {...props} />;
    }
    return (
      <a
        href={href}
        className={cn(
          "font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground",
          className
        )}
        target={isExternal(href) ? "_blank" : undefined}
        rel={isExternal(href) ? "noreferrer" : undefined}
        {...props}
      />
    );
  },
  strong: ({ className, ...props }: React.ComponentProps<"strong">) => (
    <strong className={cn("font-semibold text-foreground", className)} {...props} />
  ),
  em: ({ className, ...props }: React.ComponentProps<"em">) => (
    <em className={cn("italic", className)} {...props} />
  ),
  ul: ({ className, ...props }: React.ComponentProps<"ul">) => (
    <ul
      className={cn(
        "my-6 ml-6 list-disc space-y-2 text-base text-foreground/85 marker:text-muted-foreground sm:text-lg",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.ComponentProps<"ol">) => (
    <ol
      className={cn(
        "my-6 ml-6 list-decimal space-y-2 text-base text-foreground/85 marker:text-muted-foreground sm:text-lg",
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.ComponentProps<"li">) => (
    <li className={cn("leading-[1.75]", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "my-6 rounded-r-xl border-l-2 border-brand bg-brand/5 py-3 pl-5 pr-4 text-base italic text-muted-foreground sm:text-lg",
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: React.ComponentProps<"hr">) => (
    <hr className={cn("my-10 border-border", className)} {...props} />
  ),
  code: ({ className, ...props }: CodeProps) => {
    // When rehype-pretty-code has highlighted this `<code>` it adds a
    // `data-theme` attribute (block or inline). In that case we let the
    // Shiki span styles do the work — no chip background, no padding.
    const highlighted = props["data-theme"] != null;
    if (highlighted) {
      return <code className={className} {...props} />;
    }
    return (
      <code
        className={cn(
          "rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground",
          className
        )}
        {...props}
      />
    );
  },
  pre: ({ className, ...props }: PreProps) => (
    <CodeBlock className={className} {...props} />
  ),
  img: ({ className, alt, ...props }: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className={cn("my-8 rounded-2xl ring-1 ring-border", className)}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.ComponentProps<"table">) => (
    <div className="my-8 w-full overflow-x-auto rounded-xl border border-border">
      <table
        className={cn("w-full text-sm", className)}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: React.ComponentProps<"thead">) => (
    <thead
      className={cn("bg-muted/50 text-left", className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: React.ComponentProps<"th">) => (
    <th
      className={cn(
        "border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }: React.ComponentProps<"tr">) => (
    <tr
      className={cn("border-b border-border/60 last:border-0", className)}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.ComponentProps<"td">) => (
    <td className={cn("px-4 py-2 align-top", className)} {...props} />
  ),
};
