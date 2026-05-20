import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { services } from "@/lib/data";
import { Cloud, Code2, Palette, Smartphone } from "lucide-react";

const iconMap = {
  code: Code2,
  phone: Smartphone,
  palette: Palette,
  cloud: Cloud,
} as const;

export function Services() {
  return (
    <Section id="services">
      <SectionHeader
        eyebrow="What I do"
        title={
          <>
            Crafting digital products{" "}
            <span className="font-display italic text-muted-foreground">
              end-to-end
            </span>
          </>
        }
        description="From product strategy to pixel-perfect delivery, I help teams ship software that's resilient, accessible and a joy to use."
      />

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => {
          const Icon = iconMap[service.iconKey];
          return (
            <Reveal key={service.title} delay={i * 0.05}>
              <Card className="group/service h-full transition-all hover:ring-foreground/20">
                <CardContent className="flex h-full flex-col gap-4">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-foreground/[0.04] text-foreground ring-1 ring-foreground/10 transition-colors group-hover/service:bg-brand/15 group-hover/service:text-brand">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-display text-xl leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
