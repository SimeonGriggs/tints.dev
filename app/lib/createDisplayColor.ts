import chroma from "chroma-js";

import type { Mode } from "~/types";

import { isHex, round } from "./helpers";

export function createDisplayColor(
  color: string,
  mode?: Mode,
  alphaPlaceholder?: boolean
): string | null {
  if (!color || !isHex(color)) {
    return null;
  }

  const hexColor = color.startsWith("#") ? color : `#${color}`;
  let display = null;

  if (!mode || mode === `hex`) {
    display = hexColor.toUpperCase();
  } else if (mode === `p-3`) {
    const [r, g, b] = chroma(hexColor).rgb();

    display = `color(${[
      `display-p3`,
      round(r / 255, 3),
      round(g / 255, 3),
      round(b / 255, 3),
      `/`,
      alphaPlaceholder ? `<alpha-value>` : 1,
    ].join(` `)})`;
  } else if (mode === `oklch`) {
    const [l, c, h] = chroma(hexColor).oklch();

    // For grayscale colors (very low chroma), use hex format instead of OKLCH
    // as OKLCH with zero chroma can cause rendering issues
    if (c < 0.001) {
      display = hexColor.toUpperCase();
    } else {
      display = `oklch(${[
        round(l * 100, 2) + `%`,
        round(c, 3),
        ...(isNaN(h) ? [] : [round(h, 2)]),
        `/`,
        alphaPlaceholder ? `<alpha-value>` : 1,
      ].join(` `)})`;
    }
  } else if (mode === `hsl`) {
    const [h, s, l] = chroma(hexColor).hsl();
    display = `hsl(${[
      round(h, 1),
      round(s * 100, 1) + `%`,
      round(l * 100, 1) + `%`,
      `/`,
      alphaPlaceholder ? `<alpha-value>` : 1,
    ].join(` `)})`;
  }

  return display;
}
