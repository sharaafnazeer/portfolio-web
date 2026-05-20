import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { ArrowUpRight } from "lucide-react";

export function CTA() {
  return (
    <Section id="hire" className="relative">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-foreground px-8 py-16 text-background sm:px-12 sm:py-20 lg:px-16">
          <div
            aria-hidden
            className="absolute -right-32 -top-32 size-[420px] rounded-full bg-brand/40 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 -left-24 size-[340px] rounded-full bg-brand/20 blur-3xl"
          />

          <div className="relative flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-background/70">
                <span className="size-1.5 rounded-full bg-brand" />
                Freelance availability
              </span>
              <h2 className="mt-5 font-display text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                I&apos;m available for{" "}
                <span className="italic text-background/70">freelance</span>{" "}
                work.
              </h2>
              <p className="mt-4 max-w-xl text-base text-background/70 sm:text-lg">
                Bring me into your team to ship a new product, untangle a
                difficult system, or coach engineers — fully remote or on-site
                in Singapore.
              </p>
            </div>

            <Button asChild size="lg" variant="secondary">
              <a href="#contact">
                Hire me now
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
