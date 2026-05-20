import { Section, SectionHeader } from "@/components/site/section";
import { SkillsCarousel } from "@/components/site/skills-carousel";
import { skillGroups } from "@/lib/data";

export function Skills() {
  return (
    <Section id="skills" className="bg-muted/40">
      <SectionHeader
        eyebrow="Expertise"
        title={
          <>
            Tools I reach for{" "}
            <span className="font-display italic text-muted-foreground">
              every day
            </span>
          </>
        }
        description="A pragmatic stack — proven where it matters, modern where it pays off."
      />

      <SkillsCarousel groups={skillGroups} />
    </Section>
  );
}
