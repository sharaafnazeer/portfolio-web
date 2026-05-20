import Link from "next/link";
import { profile, navLinks } from "@/lib/data";
import {
  GithubIcon,
  LinkedinIcon,
  TwitterIcon,
  InstagramIcon,
} from "@/components/site/social-icons";

const socials = [
  { href: profile.social.github, label: "GitHub", Icon: GithubIcon },
  { href: profile.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: profile.social.twitter, label: "Twitter / X", Icon: TwitterIcon },
  { href: profile.social.instagram, label: "Instagram", Icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base font-semibold tracking-tight"
            >
              <span
                aria-hidden
                className="inline-flex size-7 items-center justify-center rounded-full bg-foreground text-background"
              >
                <span className="font-display text-sm leading-none">S</span>
              </span>
              {profile.name}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Software engineer based in {profile.location}, building thoughtful
              digital products and writing about the craft of shipping software.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}. Made with care.
          </p>
          <ul className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground ring-1 ring-border transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
