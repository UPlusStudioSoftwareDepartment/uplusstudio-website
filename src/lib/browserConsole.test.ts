import { describe, expect, it } from "vitest";
import { isNativeWebKitMediaIconError } from "../../e2e/browserConsole";

const pageUrl = "http://localhost:3000/tr/projects/villa-donusumu";
const iconMessage = (icon: string) => `Button failed to load, iconName = ${icon}, layoutTraits = [MacOSLayoutTraits Inline], src = blob:http://localhost:3000/490dba80-e720-401c-8a7d-3b38262e3ed9`;

describe("native WebKit console diagnostics", () => {
  it.each(["invalid-placard", "pip-placard", "airplay-placard"])("recognises only the known %s control-resource diagnostic", (icon) => {
    expect(isNativeWebKitMediaIconError({ browserName: "webkit", message: iconMessage(icon), pageUrl })).toBe(true);
  });

  it.each([
    "Failed to load resource: the server responded with a status of 404",
    "NotSupportedError: The operation is not supported.",
    "Uncaught TypeError: Cannot read properties of undefined",
    iconMessage("Play"),
    iconMessage("pip-placard").replace("blob:", ""),
    iconMessage("pip-placard").replace("localhost:3000", "other.example"),
    iconMessage("pip-placard").replace("MacOSLayoutTraits Inline", "MacOSLayoutTraits Fullscreen"),
    iconMessage("pip-placard").replace("490dba80-e720-401c-8a7d-3b38262e3ed9", "broken-video.mp4"),
  ])("preserves application, network and other media errors: %s", (message) => {
    expect(isNativeWebKitMediaIconError({ browserName: "webkit", message, pageUrl })).toBe(false);
  });

  it("does not suppress a matching message from another browser", () => {
    expect(isNativeWebKitMediaIconError({ browserName: "chromium", message: iconMessage("pip-placard"), pageUrl })).toBe(false);
  });
});
