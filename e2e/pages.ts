import { SERVICE_LANDINGS } from "../src/lib/serviceLandings";
import { projects } from "../src/lib/projects";

export const PATHS = [
  "",
  "/about",
  "/services",
  ...SERVICE_LANDINGS.map((s) => `/services/${s.slug}`),
  "/projects",
  `/projects/${projects[0].slug}`,
  "/glossary",
  "/contact",
  "/kartvizit",
  "/kvkk",
];
export const LOCALES = ["tr", "en"] as const;
