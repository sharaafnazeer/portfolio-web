"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

type RevealProps = React.ComponentProps<typeof motion.div> & {
  delay?: number;
  y?: number;
};

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  ...rest
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
