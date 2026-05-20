import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { BlogCard } from "@/components/site/blog-card";
import {
  getAllTags,
  getPostsByTagSlug,
  listPosts,
} from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await listPosts();
  const tags = getAllTags(posts);
  return tags.map(({ slug }) => ({ tag: slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/tag/[tag]">
): Promise<Metadata> {
  const { tag } = await props.params;
  const posts = await listPosts();
  const { displayTag } = getPostsByTagSlug(posts, tag);
  if (!displayTag) return {};

  const title = `${displayTag} — Posts tagged on Sharaaf Nazeer's blog`;
  const description = `Articles, notes and tutorials tagged "${displayTag}" — by Sharaaf Nazeer.`;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/blog/tag/${tag}`) },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

export default async function BlogTagPage(
  props: PageProps<"/blog/tag/[tag]">
) {
  const { tag } = await props.params;
  const allPosts = await listPosts();
  const { posts, displayTag } = getPostsByTagSlug(allPosts, tag);

  if (!displayTag || posts.length === 0) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="pt-16 sm:pt-20 lg:pt-24">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All posts
            </Link>
          </Reveal>

          <div className="mt-10">
            <SectionHeader
              eyebrow={`${posts.length} ${posts.length === 1 ? "post" : "posts"}`}
              title={
                <>
                  Posts tagged{" "}
                  <span className="font-display italic text-muted-foreground">
                    “{displayTag}”
                  </span>
                </>
              }
              description="Curated by topic — explore deeper into the things I write about most."
            />
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} delay={i * 0.05}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
