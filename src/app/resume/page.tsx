import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin } from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/site/section";
import { ResumeActions } from "@/components/site/resume-actions";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/site/social-icons";
import {
  certifications,
  education,
  experiences,
  profile,
  skillGroups,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.name}'s engineering resume — selected experience, education and skill stack.`,
  alternates: { canonical: "/resume" },
};

const contacts = [
  { Icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  { Icon: MapPin, label: profile.location, href: undefined as string | undefined },
];

const socials = [
  { Icon: LinkedinIcon, label: "LinkedIn", href: profile.social.linkedin },
  { Icon: GithubIcon, label: "GitHub", href: profile.social.github },
  { Icon: TwitterIcon, label: "X / Twitter", href: profile.social.twitter },
  { Icon: InstagramIcon, label: "Instagram", href: profile.social.instagram },
];

export default function ResumePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section
          className="pt-16 pb-16 sm:pt-20 lg:pt-24"
          containerClassName="max-w-3xl"
        >
          <div className="flex items-center justify-between gap-4 print:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
            <ResumeActions pdfUrl={profile.resumePdfUrl} />
          </div>

          <div className="mt-10 flex flex-col gap-4 print:mt-0">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground print:hidden">
              Resume
            </span>
            <h1 className="font-display text-balance text-5xl leading-[1.05] tracking-tight sm:text-6xl print:text-3xl">
              {profile.name}
            </h1>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground print:text-[10px]">
              Technical Lead · Lead Engineer
            </p>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground print:text-xs">
              {contacts.map(({ Icon, label, href }) => (
                <span key={label} className="inline-flex items-center gap-1.5">
                  <Icon className="size-3.5" />
                  {href ? (
                    <a href={href} className="hover:text-foreground transition-colors">
                      {label}
                    </a>
                  ) : (
                    <span>{label}</span>
                  )}
                </span>
              ))}
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Icon className="size-3.5" />
                  {label}
                </a>
              ))}
            </div>
          </div>

          <ResumeSection title="Summary">
            <p className="text-base text-muted-foreground sm:text-lg print:text-sm">
              {profile.bio}
            </p>
          </ResumeSection>

          <ResumeSection title="Experience">
            <ol className="space-y-9">
              {experiences.map((e) => (
                <li
                  key={`${e.company}-${e.period}`}
                  className="grid gap-1 sm:grid-cols-[170px_1fr] sm:gap-6"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground print:text-[10px]">
                    {e.period}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-lg leading-tight text-foreground print:text-base">
                      {e.role}
                      <span className="text-muted-foreground">
                        {" "}
                        — {e.company}
                      </span>
                      {e.location ? (
                        <span className="text-muted-foreground">
                          {" "}
                          · {e.location}
                        </span>
                      ) : null}
                    </h3>
                    {e.description ? (
                      <p className="text-sm leading-relaxed text-muted-foreground print:text-[12px]">
                        {e.description}
                      </p>
                    ) : null}
                    {e.highlights && e.highlights.length > 0 ? (
                      <ul className="mt-1 space-y-2 border-l border-border/60 pl-4">
                        {e.highlights.map((h) => (
                          <li
                            key={h.name}
                            className="text-sm leading-relaxed text-muted-foreground print:text-[12px]"
                          >
                            <span className="text-foreground">{h.name}</span>
                            {" — "}
                            <span>{h.summary}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </ResumeSection>

          <ResumeSection title="Education">
            <ol className="space-y-5">
              {education.map((ed) => (
                <li
                  key={`${ed.school}-${ed.period}`}
                  className="grid gap-1 sm:grid-cols-[170px_1fr] sm:gap-6"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground print:text-[10px]">
                    {ed.period}
                  </span>
                  <div className="flex flex-col">
                    <h3 className="font-display text-lg leading-tight text-foreground print:text-base">
                      {ed.degree}
                    </h3>
                    <p className="text-sm text-muted-foreground print:text-[12px]">
                      {ed.school}
                    </p>
                    {ed.details ? (
                      <p className="mt-1 text-xs text-muted-foreground print:text-[11px]">
                        {ed.details}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </ResumeSection>

          {certifications.length > 0 ? (
            <ResumeSection title="Certifications">
              <ol className="space-y-4">
                {certifications.map((c) => (
                  <li
                    key={c.name}
                    className="grid gap-1 sm:grid-cols-[170px_1fr] sm:gap-6"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground print:text-[10px]">
                      {c.period}
                    </span>
                    <div className="flex flex-col">
                      <h3 className="font-display text-lg leading-tight text-foreground print:text-base">
                        {c.name}
                      </h3>
                      {c.issuer ? (
                        <p className="text-sm text-muted-foreground print:text-[12px]">
                          {c.issuer}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </ResumeSection>
          ) : null}

          <ResumeSection title="Skills">
            <div className="grid gap-6 sm:grid-cols-2 print:grid-cols-2 print:gap-4">
              {skillGroups.map((g) => (
                <div key={g.title}>
                  <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {g.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground print:text-[12px]">
                    {g.skills.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </ResumeSection>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 print:mt-6">
      <div className="flex items-center gap-3">
        <h2 className="font-display text-2xl leading-tight tracking-tight print:text-lg">
          {title}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-border/60" />
      </div>
      <div className="mt-6 print:mt-3">{children}</div>
    </section>
  );
}
