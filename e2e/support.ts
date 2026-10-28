import { expect, type Locator, type Page } from "@playwright/test";
import { buildContactEmail } from "../src/lib/contactEmail";

const LIVE_SITE = !/^https?:\/\/(localhost|127\.0\.0\.1)[:/]/.test(process.env.BASE_URL ?? "http://localhost:3000");

type Outgoing = Window & { __opened: { url: string }[]; __clipboard: Record<string, string>[] };

export const testClientIp = () => `10.${[0, 0, 0].map(() => Math.floor(Math.random() * 250) + 1).join(".")}`;

export async function captureOutgoing(page: Page) {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": testClientIp() });
  if (LIVE_SITE) {
    await page.route("**/api/appointment-email", (route) => route.fulfill({ json: { sent: false } }));
    await page.route("**/api/contact", (route) => route.fulfill({ json: { sent: false, ...buildContactEmail(route.request().postDataJSON()) } }));
  }
  await page.addInitScript(() => {
    sessionStorage.setItem("u-curtain", "1");
    const w = window as unknown as Outgoing;
    w.__opened = [];
    w.__clipboard = [];
    window.open = ((url?: string | URL) => {
      const entry = { url: String(url ?? "") };
      w.__opened.push(entry);
      const location = {
        get href() {
          return entry.url;
        },
        set href(next: string) {
          entry.url = next;
        },
      };
      return { closed: false, close() {}, location } as unknown as Window;
    }) as typeof window.open;
    if (navigator.clipboard) {
      navigator.clipboard.write = async (items: ClipboardItem[]) => {
        const copied: Record<string, string> = {};
        for (const item of items) {
          for (const type of item.types) copied[type] = await (await item.getType(type)).text();
        }
        w.__clipboard.push(copied);
      };
    }
  });
}

export const openedUrls = (page: Page) => page.evaluate(() => (window as unknown as Outgoing).__opened.map((e) => e.url));

export const copiedHtml = (page: Page) =>
  page.evaluate(() => {
    const items = (window as unknown as Outgoing).__clipboard;
    return items.at(-1)?.["text/html"] ?? "";
  });

export async function openAppointment(page: Page, path = "/tr/contact", button = "Randevu Al") {
  await page.goto(path);
  await page.getByRole("main").getByRole("button", { name: button }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  return dialog;
}

export async function fillAppointment(
  dialog: Locator,
  values: { name?: string; email?: string; phone?: string; message?: string; service?: number; time?: string } = {}
) {
  await dialog.locator("#appointment-name").fill(values.name ?? "Ayşe Yılmaz");
  await dialog.locator("#appointment-email").fill(values.email ?? "ayse@example.com");
  await dialog.locator("#appointment-phone").fill(values.phone ?? "0532 123 45 67");
  await dialog.locator("fieldset button").nth(values.service ?? 1).click();
  await dialog.getByRole("button", { name: /Sonraki ay|Next month/ }).click();
  const day = dialog.locator("button[aria-label][aria-pressed]:not([disabled])").first();
  const dayLabel = (await day.getAttribute("aria-label")) ?? "";
  await day.click();
  await dialog.getByRole("button", { name: values.time ?? "14:00", exact: true }).click();
  await dialog.locator("#appointment-message").fill(values.message ?? "Salon ve mutfak için keşif görüşmesi istiyoruz.");
  return dayLabel;
}

export const submitButton = (dialog: Locator) => dialog.locator('button[type="submit"]');

export function hrefParam(url: string, name: string) {
  return new URL(url).searchParams.get(name) ?? "";
}
