import { describe, it, expect } from "vitest";
import chroma from "chroma-js";
import { createSwatches } from "./createSwatches";
import { DEFAULT_PALETTE_CONFIG } from "~/lib/constants";
import type { ColorMode, PaletteConfig } from "~/types";

// Helper function to check if two colors are perceptually similar
// DeltaE values: 0 = identical, 1-2 = imperceptible, 2-10 = perceptible but acceptable
function areColorsSimilar(
  color1: string,
  color2: string,
  threshold: number = 2,
): boolean {
  try {
    const deltaE = chroma.deltaE(color1, color2);
    return deltaE <= threshold;
  } catch (error) {
    console.error(error);
    return color1.toUpperCase() === color2.toUpperCase();
  }
}

// Static baseline data captured from original createSwatches function
const BASELINE_LINEAR_PALETTE_1E70F6_STOP500 = [
  { stop: 0, hex: "#FFFFFF" }, // Not used in final output
  { stop: 50, hex: "#E6F0FE" },
  { stop: 100, hex: "#D3E3FD" },
  { stop: 200, hex: "#A7C7FB" },
  { stop: 300, hex: "#76A8FA" },
  { stop: 400, hex: "#4A8CF8" },
  { stop: 500, hex: "#1E70F6" }, // Input color
  { stop: 600, hex: "#0856D3" },
  { stop: 700, hex: "#06409D" },
  { stop: 800, hex: "#042C6C" },
  { stop: 900, hex: "#021636" },
  { stop: 950, hex: "#010A19" },
  { stop: 1000, hex: "#000000" }, // Not used in final output
];

const BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500 = [
  { stop: 0, hex: "#FFFFFF" }, // Not used in final output
  { stop: 50, hex: "#F0F6FE" },
  { stop: 100, hex: "#E2ECFE" },
  { stop: 200, hex: "#BFD7FC" },
  { stop: 300, hex: "#98BEFB" },
  { stop: 400, hex: "#679FF9" },
  { stop: 500, hex: "#1E70F6" }, // Input color
  { stop: 600, hex: "#0A62F0" },
  { stop: 700, hex: "#0854CE" },
  { stop: 800, hex: "#0744A7" },
  { stop: 900, hex: "#05347F" },
  { stop: 950, hex: "#042458" },
  { stop: 1000, hex: "#000000" }, // Not used in final output
];

describe("createSwatches", () => {
  it("should produce perceptually similar colors to expected baseline (linear mode)", () => {
    const input: PaletteConfig = {
      ...DEFAULT_PALETTE_CONFIG,
      value: "1E70F6",
      valueStop: 500,
      colorMode: "linear" as ColorMode, // Explicitly test linear mode
    };

    const result = createSwatches(input);

    // Basic sanity checks
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(13); // All stops including 0 and 1000

    // Filter to main stops for comparison (exclude 0 and 1000)
    const mainSwatches = result.filter((s: any) => ![0, 1000].includes(s.stop));
    const expectedMainSwatches = BASELINE_LINEAR_PALETTE_1E70F6_STOP500.filter(
      (s) => ![0, 1000].includes(s.stop),
    );

    expect(mainSwatches.length).toBe(expectedMainSwatches.length);

    // Test that each color is perceptually similar to baseline
    expectedMainSwatches.forEach((expectedSwatch) => {
      const actualSwatch = mainSwatches.find(
        (s: any) => s.stop === expectedSwatch.stop,
      );
      expect(actualSwatch).toBeDefined();

      const isSimilar = areColorsSimilar(
        expectedSwatch.hex,
        actualSwatch!.hex,
        2,
      );
      if (!isSimilar) {
        const deltaE = chroma.deltaE(expectedSwatch.hex, actualSwatch!.hex);
        console.log(
          `Linear Mode - Stop ${expectedSwatch.stop}: Expected ${expectedSwatch.hex} vs Actual ${actualSwatch!.hex} (ΔE: ${deltaE.toFixed(2)})`,
        );
      }
      expect(isSimilar).toBe(true);
    });

    // Test deterministic behavior - calling twice should give same result
    const result2 = createSwatches(input);
    result.forEach((swatch: any, index: number) => {
      expect(swatch.hex).toBe(result2[index].hex);
    });
  });

  it("should produce perceptually similar colors to expected baseline (perceived mode)", () => {
    const input: PaletteConfig = {
      ...DEFAULT_PALETTE_CONFIG,
      value: "1E70F6",
      valueStop: 500,
      colorMode: "perceived" as ColorMode, // Explicitly test perceived mode
    };

    const result = createSwatches(input);

    // Basic sanity checks
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(13); // All stops including 0 and 1000

    // Filter to main stops for comparison (exclude 0 and 1000)
    const mainSwatches = result.filter((s: any) => ![0, 1000].includes(s.stop));
    const expectedMainSwatches =
      BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500.filter(
        (s) => ![0, 1000].includes(s.stop),
      );

    expect(mainSwatches.length).toBe(expectedMainSwatches.length);

    // Test that each color is perceptually similar to baseline
    expectedMainSwatches.forEach((expectedSwatch) => {
      const actualSwatch = mainSwatches.find(
        (s: any) => s.stop === expectedSwatch.stop,
      );
      expect(actualSwatch).toBeDefined();

      const isSimilar = areColorsSimilar(
        expectedSwatch.hex,
        actualSwatch!.hex,
        2,
      );
      if (!isSimilar) {
        const deltaE = chroma.deltaE(expectedSwatch.hex, actualSwatch!.hex);
        console.log(
          `Perceived Mode - Stop ${expectedSwatch.stop}: Expected ${expectedSwatch.hex} vs Actual ${actualSwatch!.hex} (ΔE: ${deltaE.toFixed(2)})`,
        );
      }
      expect(isSimilar).toBe(true);
    });

    // Test deterministic behavior - calling twice should give same result
    const result2 = createSwatches(input);
    result.forEach((swatch: any, index: number) => {
      expect(swatch.hex).toBe(result2[index].hex);
    });
  });

  it("should preserve the exact input color at the specified stop", () => {
    const stop500 = BASELINE_LINEAR_PALETTE_1E70F6_STOP500[5];
    const input = {
      ...DEFAULT_PALETTE_CONFIG,
      value: stop500.hex.replace("#", ""), // Remove # prefix for value
      valueStop: stop500.stop,
    };

    const result = createSwatches(input);
    const stop500Result = result.find((s: any) => s.stop === stop500.stop);

    expect(stop500Result?.hex).toBe(stop500.hex);
  });

  it("should work with different input colors and stops", () => {
    const stop400 = BASELINE_LINEAR_PALETTE_1E70F6_STOP500[4];

    const input = {
      ...DEFAULT_PALETTE_CONFIG,
      value: stop400.hex.replace("#", ""), // Different color, remove # prefix
      valueStop: stop400.stop, // Different stop
    };

    const result = createSwatches(input);

    // Basic sanity checks
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(13);

    // Should preserve input color at specified stop
    const stop400Result = result.find((s: any) => s.stop === stop400.stop);
    expect(stop400Result?.hex).toBe(stop400.hex);

    // Should be deterministic
    const result2 = createSwatches(input);
    result.forEach((swatch: any, index: number) => {
      expect(swatch.hex).toBe(result2[index].hex);
    });
  });
});
