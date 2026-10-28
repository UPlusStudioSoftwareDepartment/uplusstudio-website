import { describe, it, expect } from "vitest";
import { appointmentSchema, contactSchema, isPersonName, isPhoneNumber } from "./validations";

const appointment = {
  name: "Test User",
  email: "test@example.com",
  phone: "05321234567",
  service: "İç Mimarlık",
  date: "2025-03-20",
  time: "10:00",
  message: "Salon ve mutfak için keşif görüşmesi istiyoruz.",
};

describe("appointmentSchema", () => {
  it("accepts a valid request and defaults the locale to Turkish", () => {
    const parsed = appointmentSchema.safeParse(appointment);
    expect(parsed.success).toBe(true);
    expect(parsed.data?.locale).toBe("tr");
  });

  it("keeps the English locale for English visitors", () => {
    expect(appointmentSchema.parse({ ...appointment, locale: "en" }).locale).toBe("en");
  });

  it("rejects a missing or too short message", () => {
    const base = { ...appointment, message: undefined };
    expect(appointmentSchema.safeParse(base).success).toBe(false);
    expect(appointmentSchema.safeParse({ ...base, message: "   " }).success).toBe(false);
    expect(appointmentSchema.safeParse({ ...base, message: "kısa" }).success).toBe(false);
  });

  it("rejects a missing name, an invalid email and an invalid phone", () => {
    const noName = { ...appointment, name: undefined };
    expect(appointmentSchema.safeParse(noName).success).toBe(false);
    expect(appointmentSchema.safeParse({ ...appointment, email: "not-an-email" }).success).toBe(false);
    expect(appointmentSchema.safeParse({ ...appointment, phone: "12345" }).success).toBe(false);
  });
});

describe("isPersonName", () => {
  it.each(["Şükrü Öztürk", "Mary-Jane Watson", "Seán O'Neil", "José Álvarez", "  Ayşe Nur  "])("accepts %s", (name) => {
    expect(isPersonName(name)).toBe(true);
  });

  it.each(["Ali 2", "-Ali", "<script>", "ali@veli"])("rejects %s", (name) => {
    expect(isPersonName(name)).toBe(false);
  });
});

describe("isPhoneNumber", () => {
  it.each(["0532 123 45 67", "5321234567", "+90 532 123 45 67", "0312 123 45 67", "(0532) 123-45-67", "+44 20 7946 0000", "0049 30 123456"])(
    "accepts %s",
    (phone) => expect(isPhoneNumber(phone)).toBe(true)
  );

  it.each(["12345", "0532 123 45", "0132 123 45 67", "+90 532 12", "abc"])("rejects %s", (phone) => {
    expect(isPhoneNumber(phone)).toBe(false);
  });
});

describe("contactSchema", () => {
  const contact = { name: "John Doe", email: "john@example.com", phone: "0532 123 45 67", subject: "İç Mimarlık", message: "Hello, this is a message." };

  it("accepts valid contact data", () => {
    expect(contactSchema.safeParse(contact).success).toBe(true);
  });

  it("requires every field", () => {
    for (const field of Object.keys(contact)) {
      expect(contactSchema.safeParse({ ...contact, [field]: "" }).success, field).toBe(false);
    }
  });

  it("explains missing fields in Turkish instead of type errors", () => {
    const result = contactSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((i) => i.message)).toEqual([
      "Adınızı ve soyadınızı yazın",
      "Geçersiz e-posta adresi",
      "Geçerli bir telefon numarası girin",
      "Konu seçin",
      "Mesajınız en az 10 karakter olmalıdır",
    ]);
  });

  it("rejects an invalid phone or name", () => {
    expect(contactSchema.safeParse({ ...contact, phone: "123" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...contact, name: "John 2" }).success).toBe(false);
  });

  it("rejects short name", () => {
    const invalid = { name: "J", email: "john@example.com", message: "Valid message here." };
    expect(contactSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects short message", () => {
    const invalid = { name: "John Doe", email: "john@example.com", message: "Short" };
    expect(contactSchema.safeParse(invalid).success).toBe(false);
  });
});
