import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { BlogCard } from "@/components/site/blog-card";
import { Pagination } from "@/components/site/pagination";
import { listPosts, paginatePosts, POSTS_PER_PAGE } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await listPosts();
  const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  // Pre-render page 2..N (page 1 lives at `/blog`).
  return Array.from({ length: pageCount - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata(
  props: PageProps<"/blog/page/[page]">
): Promise<Metadata> {
  const { page: pageParam } = await props.params;
  const page = Number(pageParam);
  if (!Number.isFinite(page) || page < 2) return {};

  const title = `Blog — Page ${page} · Sharaaf Nazeer`;
  return {
    title,
    description: "Older posts from the archive.",
    alternates: { canonical: absoluteUrl(`/blog/page/${page}`) },
    openGraph: { title, type: "website" },
  };
}

export default async function BlogPagePage(
  props: PageProps<"/blog/page/[page]">
) {
  const { page: pageParam } = await props.params;
  const pageNum = Number(pageParam);

  // `/blog/page/1` should just live at `/blog` — keep one canonical URL.
  if (!Number.isFinite(pageNum) || pageNum < 1) notFound();
  if (pageNum === 1) redirect("/blog");

  const allPosts = await listPosts();
  const { posts, page, pageCount } = paginatePosts(allPosts, pageNum);

  if (posts.length === 0) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="pt-16 sm:pt-20 lg:pt-24">
          <SectionHeader
            eyebrow={`Page ${page} of ${pageCount}`}
            title={
              <>
                More notes from{" "}
                <span className="font-display italic text-muted-foreground">
                  the archive
                </span>
              </>
            }
            description="Older posts continue here — keep scrolling for more shipping notes."
          />

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
        </Section>
      </main>
      <Footer />
    </>
  );
}
