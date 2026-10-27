"use client";

import { useEffect } from "react";
import HomeHero from "@/components/home/HomeHero";

export default function HomePageClient() {
  useEffect(() => {
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, []);

  return <HomeHero />;
}
