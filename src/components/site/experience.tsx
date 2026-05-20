import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { education, experiences } from "@/lib/data";

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="Experience"
        title={
          <>
            A timeline of{" "}
            <span className="font-display italic text-muted-foreground">
              the work
            </span>
          </>
        }
      />

      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ol className="relative space-y-10 border-l border-border/70 pl-8">
            {experiences.map((exp, i) => (
              <li key={`${exp.company}-${exp.period}`} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[33px] top-1.5 flex size-3.5 items-center justify-center"
                >
                  <span className="size-3.5 rounded-full border border-border bg-background" />
                  {i === 0 ? (
                    <span className="absolute size-1.5 rounded-full bg-brand" />
                  ) : null}
                </span>
                <Reveal delay={i * 0.04}>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {exp.period}
                    </span>
                    <h3 className="font-display text-2xl leading-tight">
                      {exp.role}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground">{exp.company}</span>
                      {exp.location ? ` · ${exp.location}` : ""}
                    </p>
                    {exp.description ? (
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                        {exp.description}
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-4">
          <Reveal>
            <div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Education
              </h3>
              <ul className="mt-5 space-y-6">
                {education.map((ed) => (
                  <li
                    key={ed.degree}
                    className="border-b border-border/60 pb-5 last:border-0 last:pb-0"
                  >
                    <p className="font-display text-lg leading-tight">
                      {ed.degree}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {ed.school}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {ed.period}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
