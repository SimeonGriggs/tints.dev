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
import { serializePalettes, serializePalette } from "~/lib/paletteHash";
import type { PaletteEssentials } from "~/lib/paletteHash";
import type { Mode, PaletteConfig } from "~/types";

import { createDisplayColor } from "./createDisplayColor";

export function createPaletteFromNameValue(
  name: string,
  value: string,
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
    return removeTrailingSlash(baseUrl);
  } else if (palettes.length === 1) {
    // Single palette: use new hash-based URL
    const essentials: PaletteEssentials = {
      name: palettes[0].name,
      value: palettes[0].value,
      valueStop: palettes[0].valueStop,
      colorMode: palettes[0].colorMode,
      h: palettes[0].h,
      s: palettes[0].s,
      lMin: palettes[0].lMin,
      lMax: palettes[0].lMax,
      stopSelection: palettes[0].stopSelection,
    };
    const hash = serializePalette(essentials);
    const canonicalUrl = [baseUrl, "palette", hash].join(`/`);
    return removeTrailingSlash(canonicalUrl);
  } else {
    // Multi-palette: use new hash-based URL
    const essentialsArr: PaletteEssentials[] = palettes.map((p) => ({
      name: p.name,
      value: p.value,
      valueStop: p.valueStop,
      colorMode: p.colorMode,
      h: p.h,
      s: p.s,
      lMin: p.lMin,
      lMax: p.lMax,
      stopSelection: p.stopSelection,
    }));
    const hash = serializePalettes(essentialsArr);
    const canonicalUrl = [baseUrl, "palette", hash].join(`/`);
    return removeTrailingSlash(canonicalUrl);
  }
}

export function createPaletteMetaImageUrl(palette: PaletteConfig) {
  const essentials: PaletteEssentials = {
    name: palette.name,
    value: palette.value,
    valueStop: palette.valueStop,
    colorMode: palette.colorMode,
    h: palette.h,
    s: palette.s,
    lMin: palette.lMin,
    lMax: palette.lMax,
    stopSelection: palette.stopSelection,
  };
  const hash = serializePalette(essentials);
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

  // Start with a random default palette if no hash provided
  const random = createRandomPalette();
  return [random];
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
        }),
      );

    Object.assign(shaped, { [palette.name]: swatches });
  });

  return shaped;
}

export function createRedirectResponse(
  request: Request,
  palette: PaletteConfig,
) {
  const url = new URL(request.url);
  const hash = serializePalette(palette);

  // Determine the new path based on the current path
  let newPath = `/palette/${hash}`;
  if (url.pathname.startsWith("/api/")) {
    newPath = `/api${newPath}`;
  } else if (url.pathname.endsWith("/og")) {
    newPath = `${newPath}/og`;
  }

  // Create the new URL
  const newUrl = new URL(newPath, url.origin);

  // Return a 301 (permanent) redirect
  return new Response(null, {
    status: 301,
    headers: {
      Location: newUrl.toString(),
      "Cache-Control": "public, max-age=31536000", // Cache for 1 year
    },
  });
}
