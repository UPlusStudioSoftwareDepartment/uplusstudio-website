"use client";

import { LazyMotion } from "framer-motion";

const features = () => import("@/lib/motionFeatures").then((mod) => mod.default);

export default function MotionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LazyMotion features={features}>{children}</LazyMotion>;
}
