import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const publicFile = (name: string) => readFileSync(resolve(import.meta.dirname, "../../public", name));
const pngSignature = Buffer.from("89504e470d0a1a0a", "hex");

describe("search favicon assets", () => {
  it("serves a genuine ICO with complete square frames, including 48px", () => {
    const ico = publicFile("favicon.ico");
    // A previous favicon.ico was actually a rectangular PNG. The extension alone is insufficient.
    expect(ico.subarray(0, 4)).toEqual(Buffer.from([0, 0, 1, 0]));
    const count = ico.readUInt16LE(4);
    expect(count).toBeGreaterThan(0);
    expect(6 + count * 16).toBeLessThanOrEqual(ico.length);

    const sizes: number[] = [];
    for (let index = 0; index < count; index++) {
      const entry = 6 + index * 16;
      const width = ico[entry] || 256;
      const height = ico[entry + 1] || 256;
      const length = ico.readUInt32LE(entry + 8);
      const offset = ico.readUInt32LE(entry + 12);
      expect(width).toBe(height);
      expect(length).toBeGreaterThan(0);
      expect(offset).toBeGreaterThanOrEqual(6 + count * 16);
      expect(offset + length).toBeLessThanOrEqual(ico.length);
      sizes.push(width);
    }
    expect(sizes).toContain(48);
  });

  it("provides a real square high-resolution PNG for search surfaces", () => {
    const png = publicFile("icon-192.png");
    expect(png.subarray(0, 8)).toEqual(pngSignature);
    expect(png.toString("ascii", 12, 16)).toBe("IHDR");
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    expect(width).toBe(height);
    expect(width).toBeGreaterThan(48);
  });
});
