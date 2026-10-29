import { type Page } from "@playwright/test";
import { buildContactEmail } from "../src/lib/contactEmail";

type Outgoing = Window & { __opened: { url: string }[]; __clipboard: Record<string, string>[] };

export const testClientIp = () => `10.${[0, 0, 0].map(() => Math.floor(Math.random() * 250) + 1).join(".")}`;

export async function captureOutgoing(page: Page) {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": testClientIp() });
  // A local server can also have real mail credentials. UI tests must never deliver mail.
  await page.route("**/api/appointment-email", (route) => route.fulfill({ json: { sent: false } }));
  await page.route("**/api/contact", (route) => route.fulfill({ json: { sent: false, ...buildContactEmail(route.request().postDataJSON()) } }));
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


export function hrefParam(url: string, name: string) {
  return new URL(url).searchParams.get(name) ?? "";
}
