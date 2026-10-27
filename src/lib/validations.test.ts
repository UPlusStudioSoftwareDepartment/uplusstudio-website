import { describe, it, expect } from "vitest";
import { appointmentSchema, contactSchema } from "./validations";

describe("appointmentSchema", () => {
  it("accepts valid payload", () => {
    const valid = {
      name: "Test User",
      email: "test@example.com",
      phone: "05321234567",
      service: "Architectural Design",
      date: "2025-03-20",
      time: "10:00",
      message: "Salon ve mutfak için keşif görüşmesi istiyoruz.",
      passImage: "data:image/jpeg;base64," + "a".repeat(100),
    };
    expect(appointmentSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a missing or too short message", () => {
    const base = {
      name: "Test User",
      email: "test@example.com",
      phone: "05321234567",
      service: "Architectural Design",
      date: "2025-03-20",
      time: "10:00",
      passImage: "data:image/jpeg;base64," + "a".repeat(100),
    };
    expect(appointmentSchema.safeParse(base).success).toBe(false);
    expect(appointmentSchema.safeParse({ ...base, message: "   " }).success).toBe(false);
    expect(appointmentSchema.safeParse({ ...base, message: "kısa" }).success).toBe(false);
  });

  it("rejects missing name", () => {
    const invalid = {
      email: "test@example.com",
      service: "Design",
      date: "2025-03-20",
      time: "10:00",
      passImage: "data:image/jpeg;base64,abc",
    };
    expect(appointmentSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects invalid email", () => {
    const invalid = {
      name: "Test",
      email: "not-an-email",
      service: "Design",
      date: "2025-03-20",
      time: "10:00",
      passImage: "data:image/jpeg;base64,abc",
    };
    expect(appointmentSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects invalid base64 image format", () => {
    const invalid = {
      name: "Test",
      email: "test@example.com",
      service: "Design",
      date: "2025-03-20",
      time: "10:00",
      passImage: "invalid",
    };
    expect(appointmentSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects oversized base64 image", () => {
    const oversized = "a".repeat(3 * 1024 * 1024); 
    const invalid = {
      name: "Test",
      email: "test@example.com",
      service: "Design",
      date: "2025-03-20",
      time: "10:00",
      passImage: "data:image/jpeg;base64," + oversized,
    };
    expect(appointmentSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("contactSchema", () => {
  it("accepts valid contact data", () => {
    const valid = { name: "John Doe", email: "john@example.com", subject: "Project", message: "Hello, this is a message." };
    expect(contactSchema.safeParse(valid).success).toBe(true);
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
