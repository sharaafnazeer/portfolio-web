import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PaginationProps = {
  page: number;
  pageCount: number;
  /** URL builder — receives a 1-indexed page number, returns its href. */
  hrefForPage: (page: number) => string;
};

/**
 * Minimal pagination: "← Newer" / "Older →" + a compact page indicator.
 * We deliberately keep this simple — at the current content density a numeric
 * page-list would be more chrome than value.
 */
export function Pagination({ page, pageCount, hrefForPage }: PaginationProps) {
  if (pageCount <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  return (
    <nav
      aria-label="Blog pages"
      className="mt-14 flex items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm"
    >
      {hasPrev ? (
        <Link
          href={hrefForPage(page - 1)}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-muted-foreground transition-colors hover:border-brand/60 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Newer posts</span>
        </Link>
      ) : (
        <span />
      )}

      <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Page {page} of {pageCount}
      </span>

      {hasNext ? (
        <Link
          href={hrefForPage(page + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-muted-foreground transition-colors hover:border-brand/60 hover:text-foreground"
        >
          <span>Older posts</span>
          <ArrowRight className="size-3.5" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
