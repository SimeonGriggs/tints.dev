import { nanoid } from "nanoid";

import {
  DEFAULT_MODE,
  DEFAULT_PALETTE_CONFIG,
  META,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
} from "~/lib/constants";
import { createRandomPalette } from "~/lib/createRandomPalette";
import { createSwatches } from "~/lib/createSwatches";
import { isHex, isValidName, removeTrailingSlash } from "~/lib/helpers";
import { serializePalette } from "~/lib/paletteHash";
import type { Mode, PaletteConfig } from "~/types";

import { createDisplayColor } from "./createDisplayColor";

export function createPaletteFromNameValue(
  name: string,
  value: string
): PaletteConfig | null {
  if (!name || !isValidName(name) || !value || !isHex(value)) {
    return null;
  }

  const nameValue = {
    ...DEFAULT_PALETTE_CONFIG,
    id: nanoid(),
    name,
    value: value.toUpperCase(),
    swatches: [],
  };

  return {
    ...nameValue,
    swatches: createSwatches(nameValue),
  };
}

export function createCanonicalUrl(palettes: PaletteConfig[], apiUrl = false) {
  const baseUrl = apiUrl ? `${META.origin}/api` : META.origin;

  if (!palettes?.length) {
    // This shouldn't be possible?
    return removeTrailingSlash(baseUrl);
  } else if (palettes.length === 1) {
    // Single palettes use the new hash-based URL
    const hash = serializePalette(palettes[0]);
    const canonicalUrl = [baseUrl, "palette", hash].join(`/`);
    return removeTrailingSlash(canonicalUrl);
  } else if (typeof document !== "undefined") {
    // Use the current URL but maybe replace the base URL
    const currentUrl = new URL(window.location.href);
    const canonicalUrl = currentUrl
      .toString()
      .replace(currentUrl.origin, baseUrl);

    return removeTrailingSlash(canonicalUrl);
  }

  // Create a complete URL from current palettes
  const canonicalUrl = new URL(baseUrl);
  palettes.forEach((palette) => {
    canonicalUrl.searchParams.set(palette.name, palette.value.toUpperCase());
  });

  return removeTrailingSlash(canonicalUrl.toString());
}

export function createPaletteMetaImageUrl(palette: PaletteConfig) {
  const hash = serializePalette(palette);
  const metaImageUrl = [META.origin, "palette", hash, "og"].join("/");

  return {
    url: metaImageUrl,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  };
}

// Turn request URL object into initial palettes
export function requestToPalettes(url: string) {
  const requestUrl = new URL(url);

  if (!requestUrl) {
    return [];
  }

  const palettesParams = requestUrl.searchParams;
  const palettes: PaletteConfig[] = [];

  // Turn config strings into array of config objects
  if (Array.from(palettesParams.keys()).length) {
    palettesParams.forEach((value, key) => {
      if (isHex(value)) {
        const palette = createPaletteFromNameValue(key, value);

        if (palette) {
          palettes.push(palette);
        }
      }
    });
  } else {
    // Start with a random default palette if no query string provided
    const random = createRandomPalette();

    palettes.push(random);
  }

  return palettes;
}

// Convert array of palette objects used in GUI to array of colour swatches for Tailwind Config
export function output(palettes: PaletteConfig[], mode: Mode = DEFAULT_MODE) {
  const shaped = {};

  palettes.forEach((palette) => {
    const swatches = {};
    palette.swatches
      .filter((swatch) => ![0, 1000].includes(swatch.stop))
      .forEach((swatch) =>
        Object.assign(swatches, {
          [swatch.stop]: createDisplayColor(swatch.hex, mode, true),
        })
      );

    Object.assign(shaped, { [palette.name]: swatches });
  });

  return shaped;
}
