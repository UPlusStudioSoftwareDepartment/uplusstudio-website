import { expect, test, type Page } from "@playwright/test";
import { captureOutgoing, hrefParam, openedUrls } from "./support";

const IOS_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

test.beforeEach(async ({ page }) => {
  await captureOutgoing(page);
});

async function fillContact(page: Page) {
  await page.goto("/tr/contact");
  await page.locator("#name").fill("Ayşe Yılmaz");
  await page.locator("#email").fill("ayse@example.com");
  await page.locator("#phone").fill("05321234567");
  await page.locator("#subject").click();
  await page.getByRole("option", { name: /Villa/ }).click();
  await page.locator("#message").fill("Gölbaşı'ndaki arsamız için ön görüşme yapmak istiyoruz.");
}

const form = (page: Page) => page.locator("form").filter({ has: page.locator("#message") });

test("asks for every field before sending", async ({ page }) => {
  await page.goto("/tr/contact");
  await form(page).locator('button[type="submit"]').click();
  for (const message of ["Adınızı ve soyadınızı yazın (yalnızca harf).", "Geçerli bir e-posta adresi girin.", "Geçerli bir telefon numarası girin (örn. 0532 123 45 67).", "Lütfen bir konu seçin.", "Mesajınız en az 10 karakter olmalıdır."]) {
    await expect(page.getByText(message)).toBeVisible();
  }
  expect(await openedUrls(page)).toEqual([]);
});

test("subject menu lists the studio services and works with the keyboard", async ({ page }) => {
  await page.goto("/tr/contact");
  const subject = page.locator("#subject");
  await subject.focus();
  await page.keyboard.press("ArrowDown");
  const options = page.getByRole("option");
  await expect(options).toHaveCount(11);
  await expect(options.last()).toHaveText(/Diğer \/ Genel bilgi/);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("listbox")).toBeHidden();
  await expect(subject).toHaveText(/İç Mimarlık/);
  await subject.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("listbox")).toBeHidden();
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "Gmail web compose is the desktop path");

  test("opens a Gmail draft with the message already written in it", async ({ page }) => {
    await fillContact(page);
    await form(page).locator('button[type="submit"]').click();
    await expect.poll(async () => (await openedUrls(page))[0] ?? "").toContain("https://mail.google.com/mail/?view=cm");
    const draft = (await openedUrls(page))[0];
    expect(hrefParam(draft, "to")).toBe("mimarhaceruyar@gmail.com");
    expect(hrefParam(draft, "su")).toBe("Web sitesinden mesaj · Villa & Müstakil Ev · Ayşe Yılmaz");
    const body = hrefParam(draft, "body");
    expect(body).toContain("KONU\nVilla & Müstakil Ev");
    expect(body).toContain("MESAJ\nGölbaşı'ndaki arsamız için ön görüşme yapmak istiyoruz.");
    expect(body).toContain("Telefon: 0532 123 45 67");
    await expect(page.getByText(/Mesajınız Gmail'de hazır/)).toBeVisible();
  });

  test("sends the same message over WhatsApp with bold labels", async ({ page }) => {
    await fillContact(page);
    await form(page).getByRole("button", { name: "WhatsApp" }).click();
    await expect.poll(async () => (await openedUrls(page))[0] ?? "").toContain("https://wa.me/905453204007?text=");
    const text = hrefParam((await openedUrls(page))[0], "text");
    expect(text).toContain("*KONU*\nVilla & Müstakil Ev");
    expect(text).toContain("*Ad Soyad:* Ayşe Yılmaz");
    expect(text).toContain("*Telefon:* 0532 123 45 67");
  });
});

test.describe("phones", () => {
  test.skip(({ isMobile }) => !isMobile, "mailto is the phone path");
  test.use({ userAgent: IOS_UA });

  test("offers the Gmail and Mail apps with the message written", async ({ page }) => {
    await fillContact(page);
    await form(page).locator('button[type="submit"]').click();
    const gmail = page.getByRole("link", { name: "Gmail'de aç" });
    await expect(gmail).toHaveAttribute("href", /^googlegmail:\/\/\/co\?to=mimarhaceruyar%40gmail\.com/);
    const mailto = (await page.getByRole("link", { name: "Mail uygulamasında aç" }).getAttribute("href")) ?? "";
    expect(hrefParam(mailto, "body")).toContain("İLETİŞİM BİLGİLERİM");
  });
});
