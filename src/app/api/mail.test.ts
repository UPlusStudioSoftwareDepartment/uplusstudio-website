import { beforeEach, describe, expect, it, vi } from "vitest";

const mailer = vi.hoisted(() => ({ enabled: false, sendMail: vi.fn() }));

vi.mock("@/lib/mailer", () => ({
  canSendMail: () => mailer.enabled,
  sendMail: mailer.sendMail,
  studioInbox: () => "studio@example.com",
}));

process.env.APPOINTMENT_SECRET = "test-secret";

const { createAppointmentToken, studioSignature } = await import("@/lib/appointmentToken");
const appointmentEmail = await import("./appointment-email/route");
const appointmentResponse = await import("./appointment-response/route");
const contact = await import("./contact/route");

let ip = 0;
const post = (path: string, body: unknown) =>
  new Request(`https://www.uplusstudio.com.tr${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.1.1.${++ip}` },
    body: JSON.stringify(body),
  });

const request = {
  name: "Ayşe Yılmaz",
  email: "ayse@example.com",
  phone: "0532 123 45 67",
  service: "İç Mimarlık",
  date: "2026-11-04",
  time: "14:00",
  message: "Salon ve mutfak için keşif görüşmesi.",
  locale: "tr" as const,
};
const token = createAppointmentToken(request) ?? "";

beforeEach(() => {
  mailer.enabled = false;
  mailer.sendMail.mockReset();
});

describe("studio email for a new request", () => {
  it("never hands the approve / decline links to the visitor", async () => {
    const res = await appointmentEmail.POST(post("/api/appointment-email", { token }));
    expect(await res.json()).toEqual({ sent: false });
    expect(mailer.sendMail).not.toHaveBeenCalled();
  });

  it("sends the card with signed links straight to the studio when mail is configured", async () => {
    mailer.enabled = true;
    const res = await appointmentEmail.POST(post("/api/appointment-email", { token }));
    expect(await res.json()).toEqual({ sent: true });
    const mail = mailer.sendMail.mock.calls[0][0];
    expect(mail.to).toBe("studio@example.com");
    expect(mail.replyTo).toBe("ayse@example.com");
    expect(mail.html).toContain(`&s=${studioSignature(token)}`);
  });
});

describe("studio reply to the visitor", () => {
  const reply = (extra: { signature?: string } = {}) => post("/api/appointment-response", { token, action: "approve", note: "", ...extra });

  it("emails the visitor directly only with the studio signature", async () => {
    mailer.enabled = true;
    const res = await appointmentResponse.POST(reply({ signature: studioSignature(token) }));
    expect(await res.json()).toEqual({ sent: true, to: "ayse@example.com" });
    expect(mailer.sendMail.mock.calls[0][0].to).toBe("ayse@example.com");
  });

  it("falls back to a draft for anyone without the signature", async () => {
    mailer.enabled = true;
    for (const extra of [{ signature: "forged" }, {}]) {
      const res = await appointmentResponse.POST(reply(extra));
      const body = await res.json();
      expect(body.compose.to).toBe("ayse@example.com");
    }
    expect(mailer.sendMail).not.toHaveBeenCalled();
  });

  it("asks for a day and time before confirming an open request", async () => {
    const open = createAppointmentToken({ ...request, date: "", time: "" }) ?? "";
    const res = await appointmentResponse.POST(post("/api/appointment-response", { token: open, action: "approve", note: "" }));
    expect(res.status).toBe(400);
  });
});

describe("contact form", () => {
  const message = { name: "Ayşe Yılmaz", email: "ayse@example.com", phone: "0532 123 45 67", subject: "İç Mimarlık", message: "Mutfak yenilemesi için bilgi almak istiyorum." };

  it("sends the message to the studio with the visitor as reply-to", async () => {
    mailer.enabled = true;
    const res = await contact.POST(post("/api/contact", message));
    expect(await res.json()).toEqual({ sent: true });
    const mail = mailer.sendMail.mock.calls[0][0];
    expect(mail.to).toBe("studio@example.com");
    expect(mail.replyTo).toBe("ayse@example.com");
    expect(mail.subject).toBe("Web sitesinden mesaj · İç Mimarlık · Ayşe Yılmaz");
  });

  it("returns a labelled plain-text draft when mail is not configured", async () => {
    const res = await contact.POST(post("/api/contact", { ...message, phone: "05321234567" }));
    const body = await res.json();
    expect(body.sent).toBe(false);
    expect(body.html).toBeUndefined();
    expect(body.text).toBe(
      [
        "Merhaba U+ Studio,",
        "",
        "İletişim formunuz üzerinden size ulaşıyorum.",
        "",
        "KONU",
        "İç Mimarlık",
        "",
        "MESAJ",
        "Mutfak yenilemesi için bilgi almak istiyorum.",
        "",
        "İLETİŞİM BİLGİLERİM",
        "Ad Soyad: Ayşe Yılmaz",
        "Telefon: 0532 123 45 67",
        "E-posta: ayse@example.com",
        "",
        "— uplusstudio.com.tr iletişim formu",
      ].join("\n")
    );
  });

  it("rejects a message with a missing field", async () => {
    const res = await contact.POST(post("/api/contact", { ...message, phone: "" }));
    expect(res.status).toBe(400);
  });
});
