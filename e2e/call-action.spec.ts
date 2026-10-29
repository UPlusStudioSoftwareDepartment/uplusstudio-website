import { expect, test } from "@playwright/test";

for (const locale of ["tr", "en"] as const) {
  test(`${locale}: primary call action targets the studio without opening a form`, async ({ page, isMobile }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      sessionStorage.setItem("u-curtain", "1");
      // Observe the protocol handoff without opening the tester's real phone app.
      document.addEventListener("click", (event) => {
        const link = event.target instanceof Element ? event.target.closest("a") : null;
        if (link?.getAttribute("href")?.startsWith("tel:")) {
          event.preventDefault();
          document.documentElement.dataset.callTarget = link.getAttribute("href") ?? "";
        }
      }, true);
    });
    const appointmentRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/appointment-")) appointmentRequests.push(request.url());
    });
    await page.goto(`/${locale}`);
    const call = locale === "tr" ? "Şimdi Ara" : "Call now";
    await page.getByRole("main").getByRole("link", { name: call, exact: true }).first().click();
    await expect(page.locator("html")).toHaveAttribute("data-call-target", "tel:+905453204007");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.screenshot({ path: `docs/marketing-growth/home-${locale}-${isMobile ? "phone" : "desktop"}.png` });

    if (isMobile) {
      const menuLabel = locale === "tr" ? "Menü" : "Menu";
      await page.getByRole("button", { name: menuLabel, exact: true }).click();
      const menu = page.getByRole("dialog", { name: menuLabel, exact: true });
      await menu.getByRole("link", { name: call, exact: true }).click();
      await expect(menu).toBeHidden();
      await expect.poll(() => page.evaluate(() => document.body.style.position)).toBe("");
    }

    await page.goto(`/${locale}/services`);
    await page.getByRole("main").getByRole("button", { name: /—/ }).first().click();
    const showcase = page.getByRole("dialog");
    await expect(showcase).toBeVisible();
    await showcase.getByRole("link", { name: call, exact: true }).click();
    await expect(showcase).toBeHidden();
    await expect(page.locator("html")).toHaveAttribute("data-call-target", "tel:+905453204007");
    expect(appointmentRequests).toEqual([]);
  });
}
