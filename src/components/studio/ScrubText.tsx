"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({ word, progress, range }: Readonly<{ word: string; progress: MotionValue<number>; range: [number, number] }>) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {word}{" "}
    </motion.span>
  );
}

export default function ScrubText({
  text,
  className = "",
  as: Tag = "p",
  id,
}: Readonly<{ text: string; className?: string; as?: "p" | "h2"; id?: string }>) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(/\s+/).filter(Boolean);

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Word key={`${word}-${i}`} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </Tag>
  );
}
