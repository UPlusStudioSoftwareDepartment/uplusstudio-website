import { expect, test } from "@playwright/test";
import { SERVICE_LANDINGS } from "../src/lib/serviceLandings";
import { projects } from "../src/lib/projects";

for (const locale of ["tr", "en"] as const) {
  const call = locale === "tr" ? "Şimdi Ara" : "Call now";
  const paths = ["", "/about", "/contact", "/services", "/projects", "/kartvizit", ...SERVICE_LANDINGS.map(({ slug }) => `/services/${slug}`), ...projects.map(({ slug }) => `/projects/${slug}`)];
  for (const path of paths) {
    test(`${locale}${path}: call links replace appointment entry points`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/${locale}${path}`);
      await expect(page.getByRole("main").getByRole("link", { name: call, exact: true }).first()).toHaveAttribute("href", "tel:+905453204007");
      await expect(page.getByRole("button", { name: /Randevu Al|Book a meeting|Book an appointment/i })).toHaveCount(0);
      await expect(page.locator("#appointment-name")).toHaveCount(0);
    });
  }
  test(`${locale}: planning content and next steps are discoverable`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator("#home-faq")).toBeVisible();
    await expect(page.locator("#home-process")).toBeVisible();
    await expect(page.locator("#project-preparation")).toBeVisible();
    const contact = page.locator('section[aria-labelledby="home-faq"]').getByRole("link", { name: locale === "tr" ? "Projenizi anlatın" : "Tell us about your project" });
    await contact.click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/contact$`));
    await expect(page.locator("#message")).toBeVisible();
  });
}
