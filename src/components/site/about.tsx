import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { profile } from "@/lib/data";

const stats = [
  { label: "Years of experience", value: "9+" },
  { label: "Countries shipped to", value: "8" },
  { label: "Teams led", value: "5+" },
  { label: "Cup of coffee per day", value: "∞" },
];

export function About() {
  return (
    <Section id="about" className="bg-muted/40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <SectionHeader
              eyebrow="About me"
              title={
                <>
                  I build software that{" "}
                  <span className="font-display italic text-muted-foreground">
                    helps people
                  </span>
                  .
                </>
              }
            />
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.05}>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {profile.bio}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1.5">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {s.label}
                  </dt>
                  <dd className="font-display text-3xl text-foreground sm:text-4xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
