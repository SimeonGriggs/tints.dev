import type { PaletteConfig } from "~/types";
import { createSwatches } from "./createSwatches";

// Only serialize the essential properties needed to recreate the palette
export type PaletteEssentials = Pick<
  PaletteConfig,
  | "name"
  | "value"
  | "valueStop"
  | "colorMode"
  | "h"
  | "s"
  | "lMin"
  | "lMax"
  | "stopSelection"
>;

const COLOR_MODE_MAP: Record<string, PaletteEssentials["colorMode"]> = {
  l: "linear",
  p: "perceived",
};
const COLOR_MODE_REVERSE: Record<PaletteEssentials["colorMode"], string> = {
  linear: "l",
  perceived: "p",
};

const STOP_SELECTION_MAP: Record<string, PaletteEssentials["stopSelection"]> = {
  a: "auto",
  m: "manual",
};
const STOP_SELECTION_REVERSE: Record<
  PaletteEssentials["stopSelection"],
  string
> = {
  auto: "a",
  manual: "m",
};

const VERSION = "v1:";

function encodePalette(p: PaletteEssentials): string {
  return [
    p.name,
    p.value,
    p.valueStop,
    COLOR_MODE_REVERSE[p.colorMode],
    p.h,
    p.s,
    p.lMin,
    p.lMax,
    STOP_SELECTION_REVERSE[p.stopSelection],
  ].join("|");
}

function decodePalette(str: string): PaletteEssentials {
  const [name, value, valueStop, colorMode, h, s, lMin, lMax, stopSelection] =
    str.split("|");
  return {
    name,
    value,
    valueStop: Number(valueStop),
    colorMode: COLOR_MODE_MAP[colorMode] || "linear",
    h: Number(h),
    s: Number(s),
    lMin: Number(lMin),
    lMax: Number(lMax),
    stopSelection: STOP_SELECTION_MAP[stopSelection] || "auto",
  };
}

export function serializePalettes(palettes: PaletteEssentials[]): string {
  const joined = palettes.map(encodePalette).join("~");
  const base64 = btoa(joined)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return VERSION + base64;
}

export function deserializePalettes(hash: string): PaletteConfig[] | null {
  try {
    if (!hash.startsWith(VERSION)) return null;
    const base64 = hash.slice(VERSION.length);
    const str = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
    return str.split("~").map((paletteStr) => {
      const essentials = decodePalette(paletteStr);
      return {
        id: "",
        ...essentials,
        swatches: createSwatches(essentials as PaletteConfig),
        mode: "hex",
      };
    });
  } catch (error) {
    console.error("Failed to deserialize palettes:", error);
    return null;
  }
}

// For single palette compatibility
export function serializePalette(palette: PaletteEssentials): string {
  return serializePalettes([palette]);
}

export function deserializePalette(hash: string): PaletteConfig | null {
  const palettes = deserializePalettes(hash);
  return palettes && palettes[0] ? palettes[0] : null;
}
