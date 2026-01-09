import { describe, it, expect } from "vitest";
import {
  createHueScale,
  createSaturationScale,
  createDistributionValues,
} from "../scales";
import { createDisplayColor } from "../createDisplayColor";
import {
  hexToHSL,
  HSLToHex,
  lightnessFromHSLum,
  luminanceFromHex,
} from "../helpers";
import { DEFAULT_STOP, DEFAULT_STOPS } from "../constants";

describe("createHueScale", () => {
  it("returns correct length and stops", () => {
    const scale = createHueScale(0, DEFAULT_STOP);
    expect(scale).toHaveLength(DEFAULT_STOPS.length);
    expect(scale.map((s) => s.stop)).toEqual(DEFAULT_STOPS);
  });

  it("applies hue tweaks correctly", () => {
    const scale = createHueScale(10, 500);
    // The tweak should be 0 at the valueStop, and increase with distance
    const base = scale.find((s) => s.stop === 500);
    expect(base?.tweak).toBe(0);
    const farthest = scale.find((s) => s.stop === 0);
    expect(farthest?.tweak).toBeGreaterThan(0);
  });
});

describe("createSaturationScale", () => {
  it("returns correct length and stops", () => {
    const scale = createSaturationScale(0, DEFAULT_STOP);
    expect(scale).toHaveLength(DEFAULT_STOPS.length);
    expect(scale.map((s) => s.stop)).toEqual(DEFAULT_STOPS);
  });

  it("applies saturation tweaks correctly", () => {
    const scale = createSaturationScale(10, 500);
    const base = scale.find((s) => s.stop === 500);
    expect(base?.tweak).toBe(0);
    const farthest = scale.find((s) => s.stop === 0);
    expect(farthest?.tweak).toBeGreaterThan(0);
  });
});

describe("createDistributionValues", () => {
  it("returns correct length and stops", () => {
    const scale = createDistributionValues(0, 100, 50, DEFAULT_STOP);
    expect(scale).toHaveLength(DEFAULT_STOPS.length);
    expect(scale.map((s) => s.stop)).toEqual(DEFAULT_STOPS);
  });

  it("respects lMin and lMax", () => {
    const scale = createDistributionValues(20, 80, 50, DEFAULT_STOP);
    const min = scale.find((s) => s.stop === 1000)?.tweak;
    const max = scale.find((s) => s.stop === 0)?.tweak;
    expect(min).toBe(20);
    expect(max).toBe(80);
  });
});

describe("createDisplayColor", () => {
  it("returns hex for hex mode", () => {
    expect(createDisplayColor("3B82F6", "hex")).toBe("#3B82F6");
    expect(createDisplayColor("#3B82F6", "hex")).toBe("#3B82F6");
  });

  it("returns null for invalid input", () => {
    expect(createDisplayColor("notacolor", "hex")).toBeNull();
    expect(createDisplayColor("", "hex")).toBeNull();
  });

  it("returns color() for p-3 mode", () => {
    const result = createDisplayColor("3B82F6", "p-3");
    expect(result).toMatch(/^color\(display-p3 .+\)$/);
  });

  it("returns oklch() for oklch mode", () => {
    const result = createDisplayColor("3B82F6", "oklch");
    expect(result).toMatch(/^oklch\(.+\)$/);
  });

  it("returns hsl() for hsl mode", () => {
    const result = createDisplayColor("3B82F6", "hsl");
    expect(result).toMatch(/^hsl\(.+\)$/);
  });
});

describe("hexToHSL and HSLToHex", () => {
  it("converts hex to HSL and back", () => {
    const hex = "3B82F6";
    const hsl = hexToHSL(hex);
    const roundTrip = HSLToHex(hsl.h, hsl.s, hsl.l)
      .replace("#", "")
      .toUpperCase();
    // Allow for minor rounding differences
    expect(roundTrip).toContain("3B82F");
  });
});

describe("luminanceFromHex", () => {
  it("returns 0 for black and 1 for white", () => {
    expect(luminanceFromHex("000000")).toBeCloseTo(0, 2);
    expect(luminanceFromHex("FFFFFF")).toBeCloseTo(1, 2);
  });
});

describe("lightnessFromHSLum", () => {
  it("returns a number between 0 and 100", () => {
    const l = lightnessFromHSLum(210, 100, 0.5);
    expect(l).toBeGreaterThanOrEqual(0);
    expect(l).toBeLessThanOrEqual(100);
  });
});
