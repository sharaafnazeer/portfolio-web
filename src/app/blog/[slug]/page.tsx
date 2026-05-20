import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { TagBadge } from "@/components/site/tag-badge";
import { mdxComponents } from "@/components/site/mdx-components";
import { mdxOptions } from "@/lib/mdx-options";
import {
  formatPostDate,
  getAdjacentPosts,
  getAllPostSlugs,
  getPost,
  getRelatedPosts,
  listPosts,
} from "@/lib/posts";
import { BlogCard } from "@/components/site/blog-card";
import { PostNav } from "@/components/site/post-nav";
import { JsonLd } from "@/components/site/json-ld";
import { absoluteUrl } from "@/lib/site";
import {
  blogPostingSchema,
  breadcrumbSchema,
} from "@/lib/structured-data";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Sharaaf Nazeer`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: [post.tag],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) notFound();

  const allPosts = await listPosts();
  // Use the listing as the source of "current post" so we share its sort order
  // when computing adjacency. Fall back to the raw post if it's a draft.
  const postListItem =
    allPosts.find((p) => p.slug === post.slug) ?? {
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tag: post.tag,
      tags: post.tags,
      categories: post.categories,
      coverImage: post.coverImage,
      readingTime: post.readingTime,
    };
  const { prev, next } = getAdjacentPosts(allPosts, post.slug);
  const related = getRelatedPosts(allPosts, postListItem, 3);

  return (
    <>
      <JsonLd id="ld-article" data={blogPostingSchema(post)} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: "Blog", url: absoluteUrl("/blog") },
          { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
        ])}
      />
      <Navbar />
      <main className="flex-1">
        <Section className="pt-16 sm:pt-20 lg:pt-24" containerClassName="max-w-3xl">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All posts
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <header className="mt-10 flex flex-col gap-5">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <TagBadge tag={post.tag} />
                <span>{formatPostDate(post.date)}</span>
                <span aria-hidden>·</span>
                <span>{post.readingTime}</span>
              </div>
              <h1 className="font-display text-balance text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                {post.description}
              </p>
            </header>
          </Reveal>

          {post.coverImage ? (
            <Reveal delay={0.08}>
              <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.1}>
            <hr className="my-10 border-border" />
          </Reveal>

          <article className="font-sans">
            <MDXRemote
              source={post.content}
              components={mdxComponents}
              options={mdxOptions}
            />
          </article>

          {post.tags && post.tags.length > 0 ? (
            <Reveal delay={0.05}>
              <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border/60 pt-8">
                <span className="mr-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Tags
                </span>
                {post.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.05}>
            <PostNav prev={prev} next={next} />
          </Reveal>
        </Section>

        {related.length > 0 ? (
          <Section className="border-t border-border/60 bg-muted/40">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl sm:text-3xl">
                Keep reading
              </h2>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                All posts →
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <BlogCard post={p} />
                </Reveal>
              ))}
            </div>
          </Section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
