import * as React from "react";
import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  id?: string;
  containerClassName?: string;
};

export function Section({
  id,
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative w-full py-24 sm:py-28 lg:py-32", className)}
      {...rest}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10",
          containerClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-balance text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
