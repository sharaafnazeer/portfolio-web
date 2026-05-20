import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { profile } from "@/lib/data";
import { ArrowUpRight, Mail } from "lucide-react";
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/site/social-icons";

const channels = [
  {
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "in/sharaaf-nazeer",
    href: profile.social.linkedin,
    Icon: LinkedinIcon,
  },
  {
    label: "Instagram",
    value: "@tech_with_sharaaf",
    href: profile.social.instagram,
    Icon: InstagramIcon,
  },
  {
    label: "GitHub",
    value: "sharaafnazeer",
    href: profile.social.github,
    Icon: GithubIcon,
  },
  {
    label: "X / Twitter",
    value: "@sharaafnazeer",
    href: profile.social.twitter,
    Icon: TwitterIcon,
  },
];

export function Contact() {
  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionHeader
              eyebrow="Contact"
              title={
                <>
                  Let&apos;s{" "}
                  <span className="font-display italic text-muted-foreground">
                    talk
                  </span>
                  .
                </>
              }
              description="Whether it's a freelance project, a full-time role, a coffee chat or a teaching gig — I'd love to hear from you."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={`mailto:${profile.email}`}>
                  Send a message
                  <ArrowUpRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={profile.social.linkedin} target="_blank" rel="noreferrer">
                  Connect on LinkedIn
                </a>
              </Button>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={0.05}>
            <ul className="divide-y divide-border/60 rounded-2xl bg-card ring-1 ring-foreground/10">
              {channels.map(({ label, value, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noreferrer" : undefined}
                    className="group/contact flex items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-center gap-4">
                      <span className="inline-flex size-9 items-center justify-center rounded-xl bg-foreground/[0.04] text-foreground ring-1 ring-foreground/10">
                        <Icon className="size-4" />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {label}
                        </span>
                        <span className="text-sm text-foreground">{value}</span>
                      </div>
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover/contact:-translate-y-0.5 group-hover/contact:translate-x-0.5 group-hover/contact:text-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
