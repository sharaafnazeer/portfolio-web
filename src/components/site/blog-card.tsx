import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { formatPostDate, type PostListItem } from "@/lib/posts";

type BlogCardProps = {
  post: PostListItem;
};

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group/post block h-full focus:outline-none"
    >
      <Card className="h-full transition-all group-hover/post:ring-foreground/20 group-focus-visible/post:ring-foreground/30">
        {post.coverImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover/post:scale-[1.03]"
            />
          </div>
        ) : null}
        <CardContent className="flex h-full flex-col gap-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="outline" className="h-6 px-2">
              {post.tag}
            </Badge>
            <span>{post.readingTime}</span>
          </div>
          <h3 className="font-display text-2xl leading-tight transition-colors">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span>{formatPostDate(post.date)}</span>
          <span className="inline-flex items-center gap-1 text-foreground/80 transition-transform group-hover/post:translate-x-0.5">
            Read
            <ArrowUpRight className="size-3.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
