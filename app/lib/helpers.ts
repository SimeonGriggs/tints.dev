import { DEFAULT_PALETTE_CONFIG } from "~/lib/constants";
import type { PaletteConfig } from "~/types";
import chroma from "chroma-js";
import {
  BASELINE_LINEAR_PALETTE_1E70F6_STOP500,
  BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500,
} from "./testHelpers";

type RGB = { r: number; g: number; b: number };

export function luminanceFromRGB(r: number, g: number, b: number) {
  const [R, G, B] = [r, g, b].map((c) => {
    c = c / 255; // sRGB
    return c < 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 21.26 * R + 71.52 * G + 7.22 * B;
}

export function hexToRGB(H: string): RGB {
  if (H.length === 6 && !H.startsWith(`#`)) {
    H = `#${H}`;
  }

  let r = 0;
  let g = 0;
  let b = 0;
  if (H.length === 4) {
    r = parseInt(`${H[1]}${H[1]}`, 16);
    g = parseInt(`${H[2]}${H[2]}`, 16);
    b = parseInt(`${H[3]}${H[3]}`, 16);
  } else if (H.length === 7) {
    r = parseInt(`${H[1]}${H[2]}`, 16);
    g = parseInt(`${H[3]}${H[4]}`, 16);
    b = parseInt(`${H[5]}${H[6]}`, 16);
  }

  return { r, g, b };
}

export function hexToHSL(H: string) {
  if (H.length === 6 && !H.startsWith(`#`)) {
    H = `#${H}`;
  }

  // Convert hex to RGB first
  let { r, g, b } = hexToRGB(H);
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  //   return `hsl(${h},${s}%,${l}%)`;
  return { h, s, l };
}

export function HSLtoRGB(h: number, s: number, l: number) {
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function HSLToHex(h: number, s: number, l: number) {
  let { r, g, b } = HSLtoRGB(h, s, l);

  // Having obtained RGB, convert channels to hex
  const rHex = Math.round(r).toString(16) ?? "0";
  const gHex = Math.round(g).toString(16) ?? "0";
  const bHex = Math.round(b).toString(16) ?? "0";

  // Prepend 0s, if necessary
  return `#${rHex.padStart(2, "0")}${gHex.padStart(2, "0")}${bHex.padStart(2, "0")}`;
}

export function isHex(value: string) {
  const valueHex =
    value.length === 6 && !value.startsWith(`#`) ? `#${value}` : value;

  const re = new RegExp(/^#[0-9A-F]{6}$/i);

  return re.test(valueHex.toUpperCase());
}

export function isValidName(name: string) {
  const re = new RegExp(/^[A-Za-z-]{3,24}$/i);

  return re.test(name);
}

export function round(value: number, precision: number = 0) {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

export function removeTrailingSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

export function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function arrayObjectDiff(
  before: PaletteConfig[],
  current: PaletteConfig[],
) {
  const defaultKeys = Object.keys(DEFAULT_PALETTE_CONFIG);

  const changedKeys: (string | null)[] = defaultKeys
    .map((key: string) => {
      const beforeValues = before
        .map((p) => p[key as keyof PaletteConfig])
        .sort()
        .join();

      const currentValues = current
        .map((p) => p[key as keyof PaletteConfig])
        .sort()
        .join();

      return beforeValues === currentValues ? null : key;
    })
    .filter(Boolean);

  return changedKeys;
}

export function unsignedModulo(x: number, n: number) {
  return ((x % n) + n) % n;
}

export function clamp(x: number, min: number, max: number) {
  return Math.min(Math.max(x, min), max);
}

export function hexToRgb(hex: string): RGB {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

export function rgbToHex(rgb: RGB): string {
  // Having obtained RGB, convert channels to hex
  const rHex = Math.round(rgb.r).toString(16) ?? "0";
  const gHex = Math.round(rgb.g).toString(16) ?? "0";
  const bHex = Math.round(rgb.b).toString(16) ?? "0";

  // Prepend 0s, if necessary
  return `#${rHex.padStart(2, "0")}${gHex.padStart(2, "0")}${bHex.padStart(2, "0")}`;
}

export function generateTints(baseColor: string, count: number = 10): string[] {
  const rgb = hexToRgb(baseColor);
  const tints: string[] = [];

  // Generate tints
  for (let i = 0; i < count; i++) {
    const factor = 1 - i / count;
    const tint: RGB = {
      r: Math.round(rgb.r + (255 - rgb.r) * factor),
      g: Math.round(rgb.g + (255 - rgb.g) * factor),
      b: Math.round(rgb.b + (255 - rgb.b) * factor),
    };
    tints.push(rgbToHex(tint));
  }

  return tints;
}

export function generateShades(
  baseColor: string,
  count: number = 10,
): string[] {
  const rgb = hexToRgb(baseColor);
  const shades: string[] = [];

  // Generate shades
  for (let i = 0; i < count; i++) {
    const factor = i / count;
    const shade: RGB = {
      r: Math.round(rgb.r * (1 - factor)),
      g: Math.round(rgb.g * (1 - factor)),
      b: Math.round(rgb.b * (1 - factor)),
    };
    shades.push(rgbToHex(shade));
  }

  return shades;
}

/**
 * Calculate the appropriate stop value (50-950) based on a color's properties
 * @param color - The hex color value (with or without #)
 * @param colorMode - The current color mode ('linear' or 'perceived')
 * @returns The nearest available stop value (50, 100, 200, etc.)
 */
export function calculateStopFromColor(
  color: string,
  colorMode: "linear" | "perceived",
): number {
  const hexColor = color.startsWith("#") ? color : `#${color}`;

  let value: number;
  if (colorMode === "linear") {
    // In linear mode, use HSL lightness (0-100)
    const [, , l] = chroma(hexColor).hsl();
    value = l * 100; // Convert to 0-100 range
  } else {
    // In perceived mode, use luminance (0-1)
    value = chroma(hexColor).luminance() * 100; // Convert to 0-100 range
  }

  // Choose the correct baseline palette
  const baseline =
    colorMode === "linear"
      ? BASELINE_LINEAR_PALETTE_1E70F6_STOP500
      : BASELINE_PERCEIVED_PALETTE_1E70F6_STOP500;

  // Find the stop whose palette color's value is closest to the input color's value
  let closestStop = baseline[0].stop;
  let smallestDiff = Infinity;
  for (const swatch of baseline) {
    let swatchValue: number;
    if (colorMode === "linear") {
      const [, , l] = chroma(swatch.hex).hsl();
      swatchValue = l * 100;
    } else {
      swatchValue = chroma(swatch.hex).luminance() * 100;
    }
    const diff = Math.abs(swatchValue - value);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestStop = swatch.stop;
    }
  }
  return closestStop;
}
