"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/lib/data";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";

export function Hero() {
  const reduced = useReducedMotion();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % profile.roles.length);
    }, 2600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32"
    >
      <div aria-hidden className="grain absolute inset-0 -z-10 opacity-50" />
      {/* Brand glow shifted slightly right so it pools behind the hero
          portrait without overpowering the headline column. */}
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] -z-10 h-[520px] w-[520px] rounded-full bg-brand/30 blur-3xl lg:right-[5%]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Text column ------------------------------------------------- */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col items-start gap-8 lg:col-span-7"
          >
            {profile.available ? (
              <Badge
                variant="outline"
                className="gap-2 bg-background/60 backdrop-blur"
              >
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                </span>
                Available for freelance
              </Badge>
            ) : null}

            <h1 className="font-display text-balance text-5xl leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.5rem]">
              <span className="block text-muted-foreground italic">
                {profile.greeting}.
              </span>
              <span className="block">
                I&apos;m <span className="text-foreground">{profile.name}</span>
                <span className="text-brand">.</span>
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-lg text-muted-foreground sm:text-xl">
              <span className="inline-flex h-9 items-center">A</span>
              <span className="relative inline-flex h-9 min-w-[14ch] items-center overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={profile.roles[index]}
                    initial={reduced ? false : { y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { y: -24, opacity: 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    className="font-display text-foreground"
                  >
                    {profile.roles[index]}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span>building things people love.</span>
            </div>

            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              9+ years architecting web, mobile and cloud-native products —
              from scrappy startups to global enterprises across Singapore,
              the US, Europe and South Asia.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg">
                <a href="#contact">
                  Let&apos;s work together
                  <ArrowUpRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={profile.resumeUrl}>My Resume</Link>
              </Button>
              <span className="inline-flex items-center gap-1.5 pl-2 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {profile.location}
              </span>
            </div>

            <a
              href="#services"
              className="mt-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Scroll
              <motion.span
                animate={reduced ? undefined : { y: [0, 4, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-flex"
              >
                <ArrowDown className="size-3.5" />
              </motion.span>
            </a>
          </motion.div>

          {/* Image column ------------------------------------------------ */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none"
          >
            {/* Soft brand glow that hugs the bottom-left of the portrait —
                gives the image visual weight without a hard frame. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-brand/40 via-brand/0 to-foreground/10 blur-2xl"
            />

            {/* Slight float — disabled when prefers-reduced-motion. The
                outer wrapper carries the soft drop-shadow; we use
                `filter: drop-shadow(...)` (not `box-shadow`) so the shadow
                follows the masked alpha of the image rather than a hard
                rectangle. */}
            <motion.div
              animate={reduced ? undefined : { y: [0, -10, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative aspect-[2/3] w-full [filter:drop-shadow(0_25px_40px_rgba(0,0,0,0.18))_drop-shadow(0_10px_20px_rgba(0,0,0,0.12))] dark:[filter:drop-shadow(0_25px_40px_rgba(0,0,0,0.55))_drop-shadow(0_10px_20px_rgba(0,0,0,0.35))]"
            >
              {/* Soft-feathered image: a radial mask fades the portrait
                  smoothly into the page in every direction, eliminating
                  the hard card edge. Slight dim + desat keep it moody;
                  hover wakes it up.

                  Both `mask-image` and `-webkit-mask-image` are emitted
                  for Safari compatibility. */}
              <Image
                src="/images/hero.png"
                alt={`${profile.name} — illustrated portrait`}
                fill
                priority
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 384px, 100vw"
                className={[
                  "object-cover",
                  "brightness-[0.92] saturate-[0.95] contrast-[1.02]",
                  "transition-[filter] duration-500 hover:brightness-100 hover:saturate-100",
                  "dark:brightness-[0.82] dark:saturate-[0.9]",
                  // Sharp centre, feathered edges: solid for the inner
                  // 60% of the ellipse, transparent at 95%. Only the
                  // outermost ~35% of the radius dissolves into the page.
                  "[mask-image:radial-gradient(ellipse_85%_85%_at_50%_48%,black_60%,transparent_95%)]",
                  "[-webkit-mask-image:radial-gradient(ellipse_85%_85%_at_50%_48%,black_60%,transparent_95%)]",
                ].join(" ")}
              />

              {/* Theme-aware page-coloured shade fades the silhouette into
                  the surrounding background instead of into pure black, so
                  light mode no longer reads as a dark vignette. Same mask
                  so the overlay also feathers. */}
              <div
                aria-hidden
                className={[
                  "pointer-events-none absolute inset-0",
                  "bg-gradient-to-t from-background/70 via-background/20 to-transparent",
                  "dark:from-background/80 dark:via-background/25",
                  "[mask-image:radial-gradient(ellipse_85%_85%_at_50%_48%,black_60%,transparent_95%)]",
                  "[-webkit-mask-image:radial-gradient(ellipse_85%_85%_at_50%_48%,black_60%,transparent_95%)]",
                ].join(" ")}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
