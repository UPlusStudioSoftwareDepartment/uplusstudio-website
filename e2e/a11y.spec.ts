import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";
import { LOCALES, PATHS } from "./pages";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const CARD_LINKS_HAVE_FULL_SIZE_TWINS_IN_THE_FOOTER = ["target-size"];

test.skip(({ browserName }) => browserName !== "chromium", "one engine is enough for the rules axe checks");
test.beforeEach(({ page }) => page.emulateMedia({ reducedMotion: "reduce" }));

const opaque = (locator: Locator) =>
  expect
    .poll(() =>
      locator.evaluate((el) => {
        let opacity = getComputedStyle(el).visibility === "visible" ? 1 : 0;
        for (let node: Element | null = el; node; node = node.parentElement) opacity *= Number(getComputedStyle(node).opacity);
        return opacity;
      })
    )
    .toBe(1);

async function violations(page: Page, include?: string, exceptions: string[] = []) {
  const builder = new AxeBuilder({ page }).withTags(TAGS).disableRules(exceptions);
  const { violations } = await (include ? builder.include(include) : builder).analyze();
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 4).map((n) => n.target.join(" ")).join(" | ")}`);
}

for (const locale of LOCALES) {
  for (const path of PATHS) {
    test(`/${locale}${path} passes axe WCAG 2.2 AA`, async ({ page }) => {
      await page.goto(`/${locale}${path}`);
      await page.waitForLoadState("networkidle");
      expect(await violations(page)).toEqual([]);
    });
  }
}

test("open dialogs pass axe WCAG 2.2 AA", async ({ page, isMobile }) => {
  await page.goto("/tr/contact");
  await page.waitForLoadState("networkidle");
  if (isMobile) {
    await page.getByRole("button", { name: "Menü" }).click();
    await opaque(page.getByRole("dialog", { name: "Menü" }));
    await expect.poll(() => violations(page, '[role="dialog"]'), { timeout: 8000 }).toEqual([]);
  }
  await page.getByRole("button", { name: "Kartviziti paylaş" }).filter({ visible: true }).first().click();
  const card = page.getByRole("dialog", { name: "Dijital kartvizit" });
  await opaque(card.locator("a[href$=vcard]"));
  await expect.poll(() => violations(page, '[role="dialog"]', CARD_LINKS_HAVE_FULL_SIZE_TWINS_IN_THE_FOOTER), { timeout: 8000 }).toEqual([]);
  if (isMobile) return;
  await page.keyboard.press("Escape");
  await expect(card).toBeHidden();

});
