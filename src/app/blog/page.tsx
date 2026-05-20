import type { Metadata } from "next";
import Link from "next/link";
import { Rss } from "lucide-react";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { BlogCard } from "@/components/site/blog-card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/site/pagination";
import { getAllTags, listPosts, paginatePosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Sharaaf Nazeer",
  description:
    "Notes on shipping software — Angular, Node.js, architecture, cloud and the craft of engineering teams.",
  openGraph: {
    title: "Blog — Sharaaf Nazeer",
    description:
      "Notes on shipping software — Angular, Node.js, architecture, cloud and the craft of engineering teams.",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const allPosts = await listPosts();
  const tags = getAllTags(allPosts).slice(0, 14);
  const { posts, page, pageCount } = paginatePosts(allPosts, 1);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="pt-16 sm:pt-20 lg:pt-24">
          <SectionHeader
            eyebrow="Blog"
            title={
              <>
                Notes on{" "}
                <span className="font-display italic text-muted-foreground">
                  shipping software
                </span>
              </>
            }
            description="Long-form thinking on the patterns, mistakes and tools that make software teams actually ship."
          />

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <a
              href="/rss.xml"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 transition-colors hover:border-brand/60 hover:text-foreground"
            >
              <Rss className="size-3.5" />
              <span>Subscribe via RSS</span>
            </a>
            <a
              href="/atom.xml"
              className="hover:text-foreground transition-colors"
            >
              Atom
            </a>
          </div>

          {tags.length > 0 ? (
            <Reveal delay={0.05}>
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <span className="mr-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Browse by tag
                </span>
                {tags.map(({ tag, slug, count }) => (
                  <Link
                    key={slug}
                    href={`/blog/tag/${slug}`}
                    aria-label={`${count} posts tagged ${tag}`}
                  >
                    <Badge
                      variant="outline"
                      className="h-7 gap-1.5 px-2.5 transition-colors hover:border-brand/60 hover:text-foreground"
                    >
                      <span>{tag}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </Badge>
                  </Link>
                ))}
              </div>
            </Reveal>
          ) : null}

          {posts.length === 0 ? (
            <p className="mt-12 text-muted-foreground">No posts yet.</p>
          ) : (
            <>
              <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <Reveal key={post.slug} delay={i * 0.05}>
                    <BlogCard post={post} />
                  </Reveal>
                ))}
              </div>
              <Pagination
                page={page}
                pageCount={pageCount}
                hrefForPage={(p) => (p === 1 ? "/blog" : `/blog/page/${p}`)}
              />
            </>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
