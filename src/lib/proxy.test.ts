import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import proxy from "../proxy";

const config = vi.hoisted(() => ({ maintenance: false }));

vi.mock("next-intl/middleware", () => ({
  default: () => () => NextResponse.next(),
}));

vi.mock("@/lib/app-config", () => ({
  get isInMaintenance() {
    return config.maintenance;
  },
}));

function rewritePath(path: string) {
  const response = proxy(new NextRequest(`https://example.com${path}`));
  const rewrite = response.headers.get("x-middleware-rewrite");
  return rewrite ? new URL(rewrite).pathname : null;
}

beforeEach(() => {
  config.maintenance = false;
});

describe("maintenance routing", () => {
  it.each([
    ["/en/projects/no-such-project", "/en/maintenance"],
    ["/tr/services/no-such-service", "/tr/maintenance"],
    ["/en/projects/modern-villa/video", "/en/maintenance"],
    ["/tr/projects/villa-donusum%75", "/tr/maintenance"],
    ["/en/about", "/en/maintenance"],
    ["/unknown", "/tr/maintenance"],
  ])("routes %s to %s", (path, target) => {
    config.maintenance = true;
    expect(rewritePath(path)).toBe(target);
  });

  it("serves the maintenance URL without rewriting it", () => {
    config.maintenance = true;
    expect(rewritePath("/en/maintenance")).toBeNull();
  });
});

describe("missing page routing", () => {
  it.each([
    "/tr/projects/villa-donusum%75",
    "/en/projects/villa-donusum%75/video",
    "/en/services/ic-mimarlik-ankar%61",
  ])("preserves the valid encoded URL %s", (path) => {
    expect(rewritePath(path)).toBeNull();
  });

  it.each([
    ["/en/projects/no-such-project", "/en/__not-found"],
    ["/tr/services/no-such-service", "/tr/__not-found"],
    ["/en/projects/modern-villa/video", "/en/__not-found"],
    ["/en/maintenance", "/en/__not-found"],
    ["/tr/projects/%E0%A4%A", "/tr/__not-found"],
  ])("routes %s to %s", (path, target) => {
    expect(rewritePath(path)).toBe(target);
  });
});
