import { describe, it, expect } from "vitest";
import chroma from "chroma-js";
import { createSwatches } from "./createSwatches";
import { DEFAULT_PALETTE_CONFIG } from "./constants";

// Helper function to check if two colors are perceptually similar
// DeltaE values: 0 = identical, 1-2 = imperceptible, 2-10 = perceptible but acceptable
function areColorsSimilar(
  color1: string,
  color2: string,
  threshold: number = 2
): boolean {
  try {
    const deltaE = chroma.deltaE(color1, color2);
    return deltaE <= threshold;
  } catch (error) {
    // Fallback to exact match if deltaE fails
    return color1.toUpperCase() === color2.toUpperCase();
  }
}

// Static baseline data captured from original createSwatches function
const BASELINE_PALETTE_1E70F6_STOP500 = [
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

describe("createSwatches", () => {
  it("should produce perceptually similar colors to expected baseline", () => {
    const input = {
      ...DEFAULT_PALETTE_CONFIG,
      value: "1E70F6",
      valueStop: 500,
    };

    const result = createSwatches(input);

    // Basic sanity checks
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(13); // All stops including 0 and 1000

    // Filter to main stops for comparison (exclude 0 and 1000)
    const mainSwatches = result.filter((s: any) => ![0, 1000].includes(s.stop));
    const expectedMainSwatches = BASELINE_PALETTE_1E70F6_STOP500.filter(
      (s) => ![0, 1000].includes(s.stop)
    );

    expect(mainSwatches.length).toBe(expectedMainSwatches.length);

    // Test that each color is perceptually similar to baseline
    expectedMainSwatches.forEach((expectedSwatch) => {
      const actualSwatch = mainSwatches.find(
        (s: any) => s.stop === expectedSwatch.stop
      );
      expect(actualSwatch).toBeDefined();

      const isSimilar = areColorsSimilar(
        expectedSwatch.hex,
        actualSwatch!.hex,
        2
      );
      if (!isSimilar) {
        const deltaE = chroma.deltaE(expectedSwatch.hex, actualSwatch!.hex);
        console.log(
          `Stop ${expectedSwatch.stop}: Expected ${expectedSwatch.hex} vs Actual ${actualSwatch!.hex} (ΔE: ${deltaE.toFixed(2)})`
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
    const input = {
      ...DEFAULT_PALETTE_CONFIG,
      value: "1E70F6",
      valueStop: 500,
    };

    const result = createSwatches(input);
    const stop500 = result.find((s: any) => s.stop === 500);

    expect(stop500?.hex).toBe("#1E70F6");
  });

  it("should work with different input colors and stops", () => {
    const input = {
      ...DEFAULT_PALETTE_CONFIG,
      value: "FF6B6B", // Different color
      valueStop: 400, // Different stop
    };

    const result = createSwatches(input);

    // Basic sanity checks
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(13);

    // Should preserve input color at specified stop
    const stop400 = result.find((s: any) => s.stop === 400);
    expect(stop400?.hex).toBe("#FF6B6B");

    // Should be deterministic
    const result2 = createSwatches(input);
    result.forEach((swatch: any, index: number) => {
      expect(swatch.hex).toBe(result2[index].hex);
    });
  });
});
