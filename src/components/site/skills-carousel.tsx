"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  Code2,
  Cog,
  Database,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SkillGroup } from "@/lib/data";

type SkillsCarouselProps = {
  groups: SkillGroup[];
};

/**
 * Map a skill-group title to a small accent icon. Falls back to the cog icon
 * for groups that don't have an explicit entry — keeps the JSX clean even if
 * data.ts gains new categories before this map is updated.
 */
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Languages & Frameworks": Code2,
  "Cloud & DevOps": Cloud,
  "Data & Messaging": Database,
  "AI / LLM": Sparkles,
  "Architecture & Practices": Cog,
};

export function SkillsCarousel({ groups }: SkillsCarouselProps) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);

  // Recompute prev/next availability whenever the scroller fires `scroll`.
  // We also track which card is currently centred so the pagination dots
  // stay in sync with both arrow clicks and touch swipes.
  const onScroll = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);

    // Find the card whose centre is closest to the scroller's centre.
    const items = Array.from(el.children) as HTMLElement[];
    const center = scrollLeft + clientWidth / 2;
    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    items.forEach((item, idx) => {
      const c = item.offsetLeft + item.offsetWidth / 2;
      const d = Math.abs(c - center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = idx;
      }
    });
    setActiveIndex(bestIdx);
  }, []);

  React.useEffect(() => {
    onScroll();
    const el = scrollerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [onScroll]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    if (!first) return;
    const step = first.offsetWidth + 16; // gap-4 = 16px
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const scrollToIndex = (idx: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = el.children.item(idx) as HTMLElement | null;
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  };

  return (
    <div className="mt-14">
      <div className="relative">
        {/* Edge fades — only visible when overflow exists on that side. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-muted/40 to-transparent transition-opacity",
            canPrev ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-muted/40 to-transparent transition-opacity",
            canNext ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={scrollerRef}
          onScroll={onScroll}
          role="region"
          aria-label="Tools and skills"
          tabIndex={0}
          className={cn(
            // Horizontal scroll with snap. `-mx-6 px-6` extends the scroll
            // gutter to the section padding so the first/last card can rest
            // flush with the screen edge on mobile.
            "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth",
            "-mx-6 px-6 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10",
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
        >
          {groups.map((group, i) => {
            const Icon = ICONS[group.title] ?? Cog;
            return (
              <article
                key={group.title}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${groups.length}: ${group.title}`}
                className={cn(
                  "snap-start shrink-0 rounded-2xl bg-card p-6 ring-1 ring-foreground/10",
                  // Card width: full on mobile, ~half on tablet, ~third on desktop.
                  "w-[calc(100%-2rem)] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-foreground/[0.05] text-foreground ring-1 ring-foreground/10">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {group.title}
                  </h3>
                </div>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill}>
                      <Badge variant="outline" className="h-7 px-2.5 text-xs">
                        {skill}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>

      {/* Controls row: arrows on the left, dot pagination on the right. */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Previous skills"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/40 text-muted-foreground transition-all",
              "hover:border-brand/60 hover:text-foreground",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border/60 disabled:hover:text-muted-foreground"
            )}
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Next skills"
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/40 text-muted-foreground transition-all",
              "hover:border-brand/60 hover:text-foreground",
              "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border/60 disabled:hover:text-muted-foreground"
            )}
          >
            <ArrowRight className="size-4" />
          </button>
        </div>

        <ol className="flex items-center gap-1.5" aria-label="Slide pagination">
          {groups.map((group, i) => (
            <li key={group.title}>
              <button
                type="button"
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to ${group.title}`}
                aria-current={i === activeIndex ? "true" : undefined}
                className={cn(
                  "block h-1.5 rounded-full transition-all",
                  i === activeIndex
                    ? "w-6 bg-foreground"
                    : "w-1.5 bg-foreground/30 hover:bg-foreground/60"
                )}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
