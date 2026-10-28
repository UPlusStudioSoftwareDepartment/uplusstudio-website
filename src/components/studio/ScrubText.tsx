"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type MotionValue } from "framer-motion";

function Word({ word, progress, range }: Readonly<{ word: string; progress: MotionValue<number>; range: [number, number] }>) {
  const opacity = useTransform(progress, range, [0.5, 1]);
  return (
    <m.span style={{ opacity }} className="inline-block whitespace-pre motion-reduce:!opacity-100">
      {word}{" "}
    </m.span>
  );
}

export default function ScrubText({
  text,
  className = "",
  as: Tag = "p",
  id,
}: Readonly<{ text: string; className?: string; as?: "p" | "h2"; id?: string }>) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Word key={`${word}-${i}`} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
      ))}
    </Tag>
  );
}
