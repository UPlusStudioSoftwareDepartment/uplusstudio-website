import { expect, test } from "@playwright/test";
import { captureOutgoing, fillAppointment, hrefParam, openAppointment, openedUrls, submitButton, testClientIp } from "./support";

const IOS_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

test.beforeEach(async ({ page }) => {
  await captureOutgoing(page);
});

test.describe("appointment form validation", () => {
  test("flags every required field when submitted empty", async ({ page }) => {
    const dialog = await openAppointment(page);
    await submitButton(dialog).click();
    await expect(dialog.getByText("Bu alan zorunludur.")).toHaveCount(5);
    await expect(dialog.getByText("Lütfen bir gün seçin.")).toBeVisible();
    await expect(dialog.getByText("Lütfen bir saat seçin.")).toBeVisible();
    expect(await openedUrls(page)).toEqual([]);
  });

  test("explains invalid name, email, phone and message", async ({ page }) => {
    const dialog = await openAppointment(page);
    await fillAppointment(dialog, { name: "Ali 2", email: "ali@", phone: "12345", message: "kısa" });
    await submitButton(dialog).click();
    await expect(dialog.getByText("Ad yalnızca harf içermelidir.")).toBeVisible();
    await expect(dialog.getByText("Geçerli bir e-posta adresi giriniz.")).toBeVisible();
    await expect(dialog.getByText("Geçerli bir telefon numarası girin (örn. 0532 123 45 67).")).toBeVisible();
    await expect(dialog.getByText("Mesaj en az 10 karakter olmalıdır.")).toBeVisible();
    expect(await openedUrls(page)).toEqual([]);
  });

  test("accepts international names and phone numbers", async ({ page }) => {
    const dialog = await openAppointment(page);
    await fillAppointment(dialog, { name: "Seán O'Neil-Smith", phone: "+44 20 7946 0000" });
    await expect(dialog.locator("#appointment-name + p")).toHaveCount(0);
    await expect(dialog.locator("#appointment-phone + p")).toHaveCount(0);
  });

  test("closes with Escape and keeps the page where it was", async ({ page }) => {
    await page.goto("/tr/contact");
    const trigger = page.getByRole("main").getByRole("button", { name: "Randevu Al" }).last();
    await trigger.evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 300, behavior: "instant" }));
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    const box = await trigger.boundingBox();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.body.style.position)).toBe("fixed");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    expect(Math.round((await trigger.boundingBox())!.y)).toBe(Math.round(box!.y));
  });
});

test.describe("desktop email flow", () => {
  test.skip(({ isMobile }) => isMobile, "Gmail web compose is the desktop path");

  test("opens a Gmail draft with the request already written and no studio buttons", async ({ page }) => {
    const dialog = await openAppointment(page);
    const dayLabel = await fillAppointment(dialog);
    await submitButton(dialog).click();
    await expect(dialog.getByText(/Randevu talebiniz Gmail'de hazır/)).toBeVisible();

    const [draft] = await openedUrls(page);
    expect(draft).toContain("https://mail.google.com/mail/?view=cm");
    expect(hrefParam(draft, "to")).toBe("mimarhaceruyar@gmail.com");
    const [dayNumber, monthName] = dayLabel.split(" ");
    expect(hrefParam(draft, "su")).toMatch(new RegExp(`^Randevu talebi · Ayşe Yılmaz · ${dayNumber} ${monthName} \\d{4} 14:00$`));
    const body = hrefParam(draft, "body");
    expect(body).toContain("HİZMET\nİç Mimarlık");
    expect(body).toMatch(new RegExp(`TARİH VE SAAT\\n${dayNumber} ${monthName} \\d{4} \\S+, 14:00`));
    expect(body).toContain("İLETİŞİM BİLGİLERİM\nAd Soyad: Ayşe Yılmaz\nTelefon: 0532 123 45 67\nE-posta: ayse@example.com");
    expect(body).toMatch(/RANDEVU KARTI\nhttp\S+\/tr\/randevu-kart\/\S+\?k=mail/);
    expect(body).not.toContain("randevu-yanit");
  });

  test("downloads the same detailed card that WhatsApp sends", async ({ page }) => {
    const dialog = await openAppointment(page);
    await fillAppointment(dialog);
    await submitButton(dialog).click();
    await expect(dialog.getByText(/Randevu talebiniz Gmail'de hazır/)).toBeVisible();
    const download = page.waitForEvent("download");
    await dialog.getByRole("button", { name: "Kartı indir" }).last().click();
    const file = await download;
    expect(file.suggestedFilename()).toBe("uplus-studio-randevu-karti.jpg");
    const bytes = (await (await file.createReadStream()).toArray()).reduce((n, chunk) => n + chunk.length, 0);
    expect(bytes).toBeGreaterThan(40_000);
  });

  test("keeps the page and offers a retry when the browser blocks the Gmail window", async ({ page }) => {
    await page.addInitScript(() => {
      const open = window.open;
      let blocked = false;
      window.open = ((...args: Parameters<typeof window.open>) => {
        if (!blocked) {
          blocked = true;
          return null;
        }
        return open(...args);
      }) as typeof window.open;
    });
    const dialog = await openAppointment(page);
    await fillAppointment(dialog);
    await submitButton(dialog).click();
    await expect(dialog.getByText(/Gmail'i açmak için aşağıdaki butona basın/)).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/tr/contact");
    expect(await openedUrls(page)).toEqual([]);
    await dialog.getByRole("button", { name: "Gmail'i aç" }).click();
    await expect.poll(async () => (await openedUrls(page))[0] ?? "").toContain("https://mail.google.com/mail/?view=cm");
    expect(hrefParam((await openedUrls(page))[0], "body")).toContain("İLETİŞİM BİLGİLERİM");
  });

  test("sends WhatsApp the same request with bold labels and the card link", async ({ page }) => {
    const dialog = await openAppointment(page);
    await fillAppointment(dialog);
    await dialog.getByRole("button", { name: "WhatsApp" }).click();
    await expect.poll(async () => (await openedUrls(page))[0] ?? "").toContain("https://wa.me/905453204007?text=");
    const text = hrefParam((await openedUrls(page))[0], "text");
    expect(text).toContain("*Ad Soyad:* Ayşe Yılmaz");
    expect(text).toMatch(/\*Tarih ve saat\*\n.+, 14:00/);
    expect(text).toMatch(/Randevu kartı:\* http\S+\/tr\/randevu-kart\/\S+/);
  });
});

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

test.describe("phone email flow", () => {
  test.skip(({ isMobile }) => !isMobile, "mailto is the phone path");

  test("offers the mail app with the request written in it on Android", async ({ page }) => {
    const dialog = await openAppointment(page);
    await fillAppointment(dialog);
    await submitButton(dialog).click();
    const link = dialog.getByRole("link", { name: /Gmail'de aç/ });
    await expect(link).toBeVisible();
    const href = (await link.getAttribute("href")) ?? "";
    expect(href.startsWith("mailto:mimarhaceruyar@gmail.com?")).toBe(true);
    expect(hrefParam(href, "subject")).toContain("Ayşe Yılmaz");
    expect(hrefParam(href, "body")).toContain("HİZMET\nİç Mimarlık");
  });

  test.describe("on iPhone", () => {
    test.use({ userAgent: IOS_UA });

    test("offers both the Gmail app and the Mail app", async ({ page }) => {
      const dialog = await openAppointment(page);
      await fillAppointment(dialog);
      await submitButton(dialog).click();
      await expect(dialog.getByRole("link", { name: /Gmail'de aç/ })).toHaveAttribute("href", /^googlegmail:\/\/\/co\?to=mimarhaceruyar%40gmail\.com/);
      await expect(dialog.getByRole("link", { name: /Mail uygulamasında aç/ })).toHaveAttribute("href", /^mailto:mimarhaceruyar@gmail\.com\?/);
    });
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
