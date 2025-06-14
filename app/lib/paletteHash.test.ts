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

    // Compare only the essential properties
    expect(deserialized?.name).toBe(palette.name);
    expect(deserialized?.value).toBe(palette.value);
    expect(deserialized?.valueStop).toBe(palette.valueStop);
    expect(deserialized?.colorMode).toBe(palette.colorMode);
    expect(deserialized?.h).toBe(palette.h);
    expect(deserialized?.s).toBe(palette.s);
    expect(deserialized?.lMin).toBe(palette.lMin);
    expect(deserialized?.lMax).toBe(palette.lMax);
    expect(deserialized?.stopSelection).toBe(palette.stopSelection);
    expect(deserialized?.swatches).toBeDefined();
    expect(deserialized?.swatches.length).toBeGreaterThan(0);
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
