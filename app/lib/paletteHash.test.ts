import { describe, expect, it } from "vitest";
import { DEFAULT_PALETTE_CONFIG } from "./constants";
import { deserializePalette, serializePalette } from "./paletteHash";

describe("paletteHash", () => {
  it("should serialize and deserialize a palette config", () => {
    const palette = {
      ...DEFAULT_PALETTE_CONFIG,
      id: "test-id",
      name: "blue",
      value: "1E69F6",
      valueStop: 500,
    };

    const hash = serializePalette(palette);
    const deserialized = deserializePalette(hash);

    expect(deserialized).toEqual(palette);
  });

  it("should handle invalid hash", () => {
    const result = deserializePalette("invalid-hash");
    expect(result).toBeNull();
  });

  it("should produce URL-safe strings", () => {
    const palette = {
      ...DEFAULT_PALETTE_CONFIG,
      id: "test-id",
      name: "blue",
      value: "1E69F6",
      valueStop: 500,
    };

    const hash = serializePalette(palette);
    expect(hash).not.toContain("+");
    expect(hash).not.toContain("/");
    expect(hash).not.toContain("=");
  });
});
