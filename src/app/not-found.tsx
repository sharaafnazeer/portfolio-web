import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home, Rss } from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";

export const metadata: Metadata = {
  title: "404 — Page not found",
  description:
    "The page you were looking for doesn't exist or has moved. Pick a different route below.",
  robots: { index: false, follow: false },
};

const suggestions = [
  {
    href: "/",
    label: "Home",
    description: "Hero, services, experience and the rest of the front page.",
    Icon: Home,
  },
  {
    href: "/blog",
    label: "Blog",
    description: "Notes on shipping software, architecture and the craft.",
    Icon: ArrowRight,
  },
  {
    href: "/rss.xml",
    label: "RSS feed",
    description: "Subscribe to new posts in your favourite reader.",
    Icon: Rss,
  },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="pt-20 sm:pt-28 lg:pt-32">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  404 · Page not found
                </span>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="mt-5 font-display text-balance text-5xl leading-[1.02] tracking-tight sm:text-7xl">
                  Looks like that page{" "}
                  <span className="font-display italic text-muted-foreground">
                    drifted off
                  </span>
                  .
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
                  The URL you followed either doesn&apos;t exist anymore or has
                  moved. Pick a route below — or head back to the home page.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.12}>
                <ul className="divide-y divide-border/60 rounded-2xl border border-border bg-muted/30">
                  {suggestions.map(({ href, label, description, Icon }, i) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="group/contact flex items-center justify-between gap-5 px-5 py-4 transition-colors hover:bg-muted/60"
                        prefetch={i < 3}
                      >
                        <div className="flex items-center gap-4">
                          <span className="inline-flex size-9 items-center justify-center rounded-xl bg-foreground/[0.05] text-foreground ring-1 ring-foreground/10">
                            <Icon className="size-4" />
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">
                              {label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {description}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover/contact:translate-x-0.5 group-hover/contact:text-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
