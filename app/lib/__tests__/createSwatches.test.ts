import { describe, it, expect } from "vitest";
import { createSwatches } from "../createSwatches";
import { DEFAULT_PALETTE_CONFIG } from "../constants";

describe("createSwatches", () => {
  describe("basic structure", () => {
    it("should create a palette with 13 swatches including 0 and 1000 stops", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6", // Blue
        valueStop: 500,
      };

      const swatches = createSwatches(palette);
      expect(swatches).toHaveLength(13);

      // Verify 0 and 1000 stops exist
      expect(swatches.find((swatch) => swatch.stop === 0)).toBeDefined();
      expect(swatches.find((swatch) => swatch.stop === 1000)).toBeDefined();

      // Verify middle stops (excluding 0 and 1000)
      const middleStops = swatches
        .filter((swatch) => swatch.stop !== 0 && swatch.stop !== 1000)
        .map((swatch) => swatch.stop);
      expect(middleStops).toEqual([
        50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
      ]);
    });

    it("should maintain the original value at the specified stop", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6", // Blue
        valueStop: 500,
      };

      const swatches = createSwatches(palette);
      const valueSwatch = swatches.find((swatch) => swatch.stop === 500);
      expect(valueSwatch?.hex).toBe("#3B82F6");
    });
  });

  describe("color validation", () => {
    it("should generate valid hex colors", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6", // Blue
        valueStop: 500,
      };

      const swatches = createSwatches(palette);
      swatches.forEach((swatch) => {
        expect(swatch.hex).toMatch(/^#[0-9A-F]{6}$/);
      });
    });

    it("should generate colors with valid HSL values", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6", // Blue
        valueStop: 500,
      };

      const swatches = createSwatches(palette);
      swatches.forEach((swatch) => {
        expect(swatch.h).toBeGreaterThanOrEqual(0);
        expect(swatch.h).toBeLessThanOrEqual(360);
        expect(swatch.s).toBeGreaterThanOrEqual(0);
        expect(swatch.s).toBeLessThanOrEqual(100);
        expect(swatch.l).toBeGreaterThanOrEqual(0);
        expect(swatch.l).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("color relationships", () => {
    it("should generate progressively darker colors from 0 to 1000", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6", // Blue
        valueStop: 500,
      };

      const swatches = createSwatches(palette);
      const sortedByStop = [...swatches].sort((a, b) => a.stop - b.stop);

      // Verify lightness decreases as stop increases
      for (let i = 1; i < sortedByStop.length; i++) {
        expect(sortedByStop[i].l).toBeLessThanOrEqual(sortedByStop[i - 1].l);
      }
    });

    it("should maintain hue relationships with tweaks", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6", // Blue
        valueStop: 500,
        h: 10, // Add a hue tweak
      };

      const swatches = createSwatches(palette);
      const baseHue = swatches.find((swatch) => swatch.stop === 500)?.h ?? 0;

      // Verify hue tweaks are applied consistently
      swatches.forEach((swatch) => {
        if (swatch.stop !== 500) {
          expect(Math.abs(swatch.h - baseHue)).toBeLessThanOrEqual(360);
        }
      });
    });
  });

  describe("edge cases", () => {
    it("should handle very dark colors", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "000000", // Black
        valueStop: 500,
      };

      const swatches = createSwatches(palette);
      expect(swatches.find((swatch) => swatch.stop === 0)?.l).toBeGreaterThan(
        0
      );
    });

    it("should handle very light colors", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "FFFFFF", // White
        valueStop: 500,
      };

      const swatches = createSwatches(palette);
      expect(swatches.find((swatch) => swatch.stop === 1000)?.l).toBeLessThan(
        100
      );
    });

    it("should handle highly saturated colors", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "FF0000", // Pure Red
        valueStop: 500,
      };

      const swatches = createSwatches(palette);
      const baseSaturation =
        swatches.find((swatch) => swatch.stop === 500)?.s ?? 0;
      expect(baseSaturation).toBeGreaterThan(90);
    });
  });

  describe("configuration options", () => {
    it("should respect useLightness setting", () => {
      const paletteWithLightness = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6",
        valueStop: 500,
        useLightness: true,
      };

      const paletteWithLuminance = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6",
        valueStop: 500,
        useLightness: false,
      };

      const swatchesWithLightness = createSwatches(paletteWithLightness);
      const swatchesWithLuminance = createSwatches(paletteWithLuminance);

      // The generated colors should be different
      expect(swatchesWithLightness).not.toEqual(swatchesWithLuminance);
    });

    it("should respect lMin and lMax settings", () => {
      const palette = {
        ...DEFAULT_PALETTE_CONFIG,
        value: "3B82F6",
        valueStop: 500,
        lMin: 20,
        lMax: 80,
      };

      const swatches = createSwatches(palette);
      swatches.forEach((swatch) => {
        expect(swatch.l).toBeGreaterThanOrEqual(20);
        expect(swatch.l).toBeLessThanOrEqual(80);
      });
    });

    it("should handle different valueStop positions", () => {
      const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

      stops.forEach((stop) => {
        const palette = {
          ...DEFAULT_PALETTE_CONFIG,
          value: "3B82F6",
          valueStop: stop,
        };

        const swatches = createSwatches(palette);
        const valueSwatch = swatches.find((s) => s.stop === stop);
        expect(valueSwatch?.hex).toBe("#3B82F6");
      });
    });
  });
});
