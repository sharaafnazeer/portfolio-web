import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { tagToSlug } from "@/lib/posts";

type TagBadgeProps = {
  tag: string;
  className?: string;
  /**
   * When set, the badge is rendered as a plain (non-link) badge — useful inside
   * a card that's already wrapped in a <Link> (nested anchors are invalid HTML).
   */
  asLink?: boolean;
};

/**
 * Themed Badge that links to `/blog/tag/[slug]`. Falls back to a plain badge
 * when `asLink={false}` so it can be embedded inside another anchor.
 */
export function TagBadge({ tag, className, asLink = true }: TagBadgeProps) {
  const inner = (
    <Badge
      variant="outline"
      className={
        "h-6 px-2 transition-colors hover:border-brand/60 hover:text-foreground " +
        (className ?? "")
      }
    >
      {tag}
    </Badge>
  );

  if (!asLink) return inner;

  return (
    <Link href={`/blog/tag/${tagToSlug(tag)}`} aria-label={`Browse posts tagged ${tag}`}>
      {inner}
    </Link>
  );
}
