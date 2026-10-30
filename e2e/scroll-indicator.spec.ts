import { expect, test } from "@playwright/test";

for (const width of [320, 768, 1440]) {
  test(`the studio scroll indicator stays below the header and inside its track at ${width}px`, async ({ page, isMobile }) => {
    await page.setViewportSize({ width, height: 852 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/tr/about");
    await page.waitForLoadState("networkidle");
    const bar = page.locator(".scroll-indicator");
    await expect(bar).toHaveCSS("opacity", "0");
    if (!isMobile) await page.mouse.move(width / 2, 500);
    await expect(async () => {
      if (isMobile) {
        // Mobile WebKit cannot send wheel input. Simulate touch intent and the
        // resulting scroll separately: synthetic touch events do not pan the page.
        const active = await bar.evaluate((element) => {
          window.dispatchEvent(new Event("touchmove"));
          window.scrollBy({ top: 120, behavior: "instant" });
          // Synthetic touch cannot trigger native panning. Notify the indicator
          // after moving the real scroll position, and sample before idle expiry.
          window.dispatchEvent(new Event("scroll"));
          return element.classList.contains("is-active");
        });
        expect(active).toBe(true);
      } else {
        await page.mouse.wheel(0, 120);
        await expect(bar).toHaveClass(/is-active/, { timeout: 300 });
      }
    }).toPass({ timeout: 20000 });
    const geometry = await bar.evaluate((element) => {
      const track = element.parentElement!;
      const header = document.querySelector("nav")!;
      const rect = element.getBoundingClientRect();
      const bounds = track.getBoundingClientRect();
      const themeColor = getComputedStyle(document.documentElement).getPropertyValue("--color-clay").trim();
      return {
        belowHeader: bounds.top >= header.getBoundingClientRect().bottom,
        lowerLayer: Number(getComputedStyle(track).zIndex) < Number(getComputedStyle(header).zIndex),
        insideTrack: rect.top >= bounds.top && rect.bottom <= bounds.bottom + 1,
        narrow: bounds.width <= 3,
        themeColor,
        color: getComputedStyle(element).backgroundColor,
        pointerEvents: getComputedStyle(track).pointerEvents,
      };
    });
    expect(geometry).toEqual({
      belowHeader: true, lowerLayer: true, insideTrack: true, narrow: true,
      themeColor: "#c4825c", color: "rgb(196, 130, 92)", pointerEvents: "none",
    });
    if (isMobile) {
      await page.evaluate(() => {
        window.dispatchEvent(new Event("touchmove"));
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
        window.dispatchEvent(new Event("scroll"));
      });
    } else {
      await page.keyboard.press("End");
    }
    await expect.poll(() => bar.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const track = element.parentElement!.getBoundingClientRect();
      return Math.abs(rect.bottom - track.bottom);
    })).toBeLessThanOrEqual(1);
    await expect(bar).toHaveCSS("opacity", "0", { timeout: 3000 });
  });
}
