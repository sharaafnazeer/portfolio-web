import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { listPosts } from "@/lib/posts";
// Projects are hidden from the public site for now — keep the data layer in
// place but skip emitting their URLs into the sitemap. Re-enable by importing
// `listProjects` from `@/lib/projects` and uncommenting the route blocks below.
// import { listProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // {
    //   url: `${SITE_URL}/projects`,
    //   lastModified: now,
    //   changeFrequency: "monthly",
    //   priority: 0.8,
    // },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // const projectRoutes: MetadataRoute.Sitemap = (await listProjects()).map((p) => ({
  //   url: `${SITE_URL}/projects/${p.slug}`,
  //   lastModified: now,
  //   changeFrequency: "yearly",
  //   priority: 0.6,
  // }));

  return [...staticRoutes, ...postRoutes];
}
