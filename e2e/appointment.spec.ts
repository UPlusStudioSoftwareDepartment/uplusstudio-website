import { expect, test } from "@playwright/test";
import { captureOutgoing, hrefParam, openedUrls, testClientIp } from "./support";

test.beforeEach(async ({ page }) => { await captureOutgoing(page); });

test.describe("studio reply page", () => {
  test.skip(({ isMobile }) => isMobile, "the studio answers from Gmail on a computer");

  const createRequest = async (request: import("@playwright/test").APIRequestContext, locale: "tr" | "en" = "tr") => {
    const res = await request.post("/api/appointment-link", {
      headers: { "x-forwarded-for": testClientIp() },
      data: {
        name: locale === "en" ? "Mary-Jane Watson" : "Ayşe Yılmaz",
        email: "musteri@example.com",
        phone: "0532 123 45 67",
        service: "İç Mimarlık",
        date: "2026-11-04",
        time: "14:00",
        message: "Salon ve mutfak için keşif görüşmesi istiyoruz.",
        locale,
        via: "mail",
      },
    });
    expect(res.status()).toBe(200);
    return (await res.json()).token as string;
  };

  test("prepares a written approval and a written decline for the customer", async ({ page, request }) => {
    const token = await createRequest(request);
    await page.goto(`/tr/randevu-yanit?a=approve&t=${encodeURIComponent(token)}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ayşe Yılmaz");
    await page.getByLabel("Not (isteğe bağlı)").fill("Gelirken mevcut planlarınızı getirebilirsiniz.");
    await page.getByRole("button", { name: /Onayla ve müşteriye bildir/ }).click();
    await expect(page.getByRole("heading", { name: "Yanıtınız e-postada hazır." })).toBeVisible();
    const approval = (await openedUrls(page)).at(-1) ?? "";
    expect(hrefParam(approval, "to")).toBe("musteri@example.com");
    expect(hrefParam(approval, "su")).toBe("Randevunuz onaylandı · 4 Kasım 2026 14:00 · U+ Studio");
    const approvalBody = hrefParam(approval, "body");
    expect(approvalBody).toContain("Merhaba Ayşe,");
    expect(approvalBody).toContain("Tarih: 4 Kasım 2026 Çarşamba");
    expect(approvalBody).toContain("STÜDYODAN NOT\nGelirken mevcut planlarınızı getirebilirsiniz.");
    expect(approvalBody).toContain("Takvime ekle: https://calendar.google.com/");

    await page.goto(`/tr/randevu-yanit?a=decline&t=${encodeURIComponent(token)}`);
    const send = page.getByRole("button", { name: /Açıklamayla reddet/ });
    await expect(send).toBeDisabled();
    await page.getByLabel(/Açıklama \(müşteriye iletilecek\)/).fill("Bu hafta şantiyedeyiz.");
    await send.click();
    await expect(page.getByRole("heading", { name: "Yanıtınız e-postada hazır." })).toBeVisible();
    const refusal = (await openedUrls(page)).at(-1) ?? "";
    expect(hrefParam(refusal, "su")).toBe("Randevu talebiniz hakkında · U+ Studio");
    expect(hrefParam(refusal, "body")).toContain("AÇIKLAMA\nBu hafta şantiyedeyiz.");
  });

  test("answers English visitors in English", async ({ page, request }) => {
    const token = await createRequest(request, "en");
    await page.goto(`/tr/randevu-yanit?a=approve&t=${encodeURIComponent(token)}`);
    await expect(page.getByText(/yanıt e-postası İngilizce hazırlanır/)).toBeVisible();
    await page.getByRole("button", { name: /Onayla ve müşteriye bildir/ }).click();
    await expect(page.getByRole("heading", { name: "Yanıtınız e-postada hazır." })).toBeVisible();
    const approval = (await openedUrls(page)).at(-1) ?? "";
    expect(hrefParam(approval, "su")).toBe("Your appointment is confirmed · November 4, 2026 14:00 · U+ Studio");
    expect(hrefParam(approval, "body")).toContain("Hello Mary-Jane,");
  });
});

test.describe("appointment card", () => {
  test("renders the card page and image for a signed request", async ({ page, request }) => {
    const res = await request.post("/api/appointment-link", {
      headers: { "x-forwarded-for": testClientIp() },
      data: { name: "Ayşe Yılmaz", email: "ayse@example.com", phone: "0532 123 45 67", service: "İç Mimarlık", date: "2026-11-04", time: "14:00", message: "Keşif görüşmesi istiyoruz.", locale: "tr", via: "mail" },
    });
    expect(res.status()).toBe(200);
    const { url, image } = await res.json();
    const imageRes = await request.get(new URL(image).pathname + new URL(image).search);
    expect(imageRes.headers()["content-type"]).toBe("image/png");

    await page.goto(new URL(url).pathname + new URL(url).search);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ayşe Yılmaz");
    await expect(page.getByText("E-postayla geldi")).toBeVisible();
    await expect(page.getByText("Kasım 2026").first()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("rejects a tampered token everywhere", async ({ page, request }) => {
    await page.goto("/tr/randevu-kart/eyJuYW1lIjoiWCJ9.bozuk");
    await expect(page.getByText("Bu kart geçersiz ya da süresi dolmuş.")).toBeVisible();
    await page.goto("/tr/randevu-yanit?a=approve&t=eyJuYW1lIjoiWCJ9.bozuk");
    await expect(page.getByText("Bu bağlantı geçersiz ya da süresi dolmuş.")).toBeVisible();
    const res = await request.post("/api/appointment-response", { headers: { "x-forwarded-for": testClientIp() }, data: { token: "eyJuYW1lIjoiWCJ9.bozuk", action: "approve" } });
    expect(res.status()).toBe(400);
  });

  test("refuses requests the form would refuse", async ({ request }) => {
    const missingSlot = await request.post("/api/appointment-link", {
      headers: { "x-forwarded-for": testClientIp() },
      data: { name: "Ayşe Yılmaz", email: "ayse@example.com", phone: "0532 123 45 67", service: "İç Mimarlık", message: "Keşif görüşmesi istiyoruz.", locale: "tr" },
    });
    expect(missingSlot.status()).toBe(400);
    const invalid = await request.post("/api/appointment-link", {
      headers: { "x-forwarded-for": testClientIp() },
      data: { name: "X", email: "nope", phone: "1", service: "", message: "kısa" },
    });
    expect(invalid.status()).toBe(400);
  });
});
