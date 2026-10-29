import { SERVICE_LANDINGS } from "../src/lib/serviceLandings";
import { projects } from "../src/lib/projects";
import { guides } from "../src/lib/guides";

export const PATHS = [
  "",
  "/about",
  "/services",
  ...SERVICE_LANDINGS.map((s) => `/services/${s.slug}`),
  "/projects",
  ...projects.map((project) => `/projects/${project.slug}`),
  ...projects.filter((project) => project.video).map((project) => `/projects/${project.slug}/video`),
  "/glossary",
  "/contact",
  "/kartvizit",
  "/kvkk",
  "/guides",
  ...guides.map(({ slug }) => `/guides/${slug}`),
];
export const LOCALES = ["tr", "en"] as const;
