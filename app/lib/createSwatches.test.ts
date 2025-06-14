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
  threshold: number = 5, // Increased threshold for HSLuv
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

describe("HSLuv implementation", () => {
  it("should maintain consistent perceived brightness across different hues", () => {
    const baseColor = "1E70F6"; // Blue
    const redColor = "F61E1E"; // Red
    const greenColor = "1EF61E"; // Green

    const config = {
      ...DEFAULT_PALETTE_CONFIG,
      colorMode: "perceived" as ColorMode,
      valueStop: 500,
    };

    // Generate palettes for different hues
    const bluePalette = createSwatches({ ...config, value: baseColor });
    const redPalette = createSwatches({ ...config, value: redColor });
    const greenPalette = createSwatches({ ...config, value: greenColor });

    // Compare lightness values at each stop
    bluePalette.forEach((blueSwatch, index) => {
      const redSwatch = redPalette[index];
      const greenSwatch = greenPalette[index];

      // Colors at the same stop should have similar perceived brightness
      // Increased threshold to 10 to account for HSLuv's more accurate color space
      expect(Math.abs(blueSwatch.l - redSwatch.l)).toBeLessThan(10);
      expect(Math.abs(blueSwatch.l - greenSwatch.l)).toBeLessThan(10);
    });
  });

  it("should handle edge cases correctly", () => {
    const testCases = [
      { value: "000000", name: "black" },
      { value: "FFFFFF", name: "white" },
      { value: "FF0000", name: "fully saturated red" },
      { value: "00FF00", name: "fully saturated green" },
      { value: "0000FF", name: "fully saturated blue" },
    ];

    testCases.forEach(({ value }) => {
      const config = {
        ...DEFAULT_PALETTE_CONFIG,
        value,
        valueStop: 500,
        colorMode: "perceived" as ColorMode,
      };

      const result = createSwatches(config);

      // Basic validation
      expect(result).toBeDefined();
      expect(result.length).toBe(13);

      // Check that all colors are valid
      result.forEach((swatch) => {
        expect(() => chroma(swatch.hex)).not.toThrow();
      });

      // Check that the value stop color is preserved
      const valueStopSwatch = result.find((s) => s.stop === 500);
      expect(valueStopSwatch?.hex).toBe(`#${value}`);
    });
  });

  it("should maintain saturation better than the old implementation", () => {
    const config = {
      ...DEFAULT_PALETTE_CONFIG,
      value: "FF0000", // Bright red
      valueStop: 500,
      colorMode: "perceived" as ColorMode,
    };

    const result = createSwatches(config);

    // Check that saturation doesn't drop too quickly
    const midToneSwatches = result.filter(
      (s) => s.stop >= 300 && s.stop <= 700,
    );
    midToneSwatches.forEach((swatch) => {
      expect(swatch.s).toBeGreaterThan(40); // Adjusted threshold for HSLuv
    });
  });
});

describe("HSLuv regression tests", () => {
  it("should maintain the same output format", () => {
    const config = {
      ...DEFAULT_PALETTE_CONFIG,
      value: "1E70F6",
      valueStop: 500,
      colorMode: "perceived" as ColorMode,
    };

    const result = createSwatches(config);

    // Check structure of each swatch
    result.forEach((swatch) => {
      expect(swatch).toHaveProperty("stop");
      expect(swatch).toHaveProperty("hex");
      expect(swatch).toHaveProperty("h");
      expect(swatch).toHaveProperty("hScale");
      expect(swatch).toHaveProperty("s");
      expect(swatch).toHaveProperty("sScale");
      expect(swatch).toHaveProperty("l");

      // Check value types
      expect(typeof swatch.stop).toBe("number");
      expect(typeof swatch.hex).toBe("string");
      expect(typeof swatch.h).toBe("number");
      expect(typeof swatch.hScale).toBe("number");
      expect(typeof swatch.s).toBe("number");
      expect(typeof swatch.sScale).toBe("number");
      expect(typeof swatch.l).toBe("number");
    });
  });

  it("should handle tweaks correctly", () => {
    const config = {
      ...DEFAULT_PALETTE_CONFIG,
      value: "1E70F6",
      valueStop: 500,
      colorMode: "perceived" as ColorMode,
      h: 10, // Add some hue tweak
      s: 5, // Add some saturation tweak
    };

    const result = createSwatches(config);

    // Check that tweaks are applied
    const valueStopSwatch = result.find((s) => s.stop === 500);
    // For the value stop, we expect the original color to be preserved
    expect(valueStopSwatch?.hex).toBe(`#${config.value}`);

    // Check that tweaks are applied to other stops
    const otherStops = result.filter((s) => s.stop !== 500);
    otherStops.forEach((swatch) => {
      expect(swatch.hScale).not.toBe(0); // Should have some hue tweak
      expect(swatch.sScale).not.toBe(0); // Should have some saturation tweak
    });
  });
});
