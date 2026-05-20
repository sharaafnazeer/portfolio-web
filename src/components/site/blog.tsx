import Link from "next/link";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { BlogCard } from "@/components/site/blog-card";
import { listPosts } from "@/lib/posts";
import { ArrowUpRight } from "lucide-react";

export async function Blog() {
  const posts = (await listPosts()).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <Section id="blog">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          eyebrow="Latest from the blog"
          title={
            <>
              Notes on{" "}
              <span className="font-display italic text-muted-foreground">
                shipping software
              </span>
            </>
          }
        />
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all posts
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <BlogCard post={post} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
