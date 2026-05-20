import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostListItem } from "@/lib/posts";

type Props = {
  prev?: PostListItem;
  next?: PostListItem;
};

/**
 * Previous / next post navigation shown at the bottom of a single blog post.
 * Each cell links to the adjacent post (by publish date) with title preview.
 */
export function PostNav({ prev, next }: Props) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Post navigation"
      className="mt-16 grid gap-3 border-t border-border/60 pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-2xl border border-border bg-muted/40 p-5 transition-colors hover:border-foreground/30 hover:bg-muted/70"
        >
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <ArrowLeft className="size-3" /> Previous
          </span>
          <span className="line-clamp-2 font-display text-base leading-snug text-foreground transition-colors group-hover:text-brand">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div aria-hidden />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col items-end gap-1 rounded-2xl border border-border bg-muted/40 p-5 text-right transition-colors hover:border-foreground/30 hover:bg-muted/70"
        >
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Next <ArrowRight className="size-3" />
          </span>
          <span className="line-clamp-2 font-display text-base leading-snug text-foreground transition-colors group-hover:text-brand">
            {next.title}
          </span>
        </Link>
      ) : (
        <div aria-hidden />
      )}
    </nav>
  );
}
