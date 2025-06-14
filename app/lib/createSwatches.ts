import chroma from "chroma-js";
import { Hsluv } from "hsluv";

import { DEFAULT_PALETTE_CONFIG } from "~/lib/constants";
import type { PaletteConfig } from "~/types";

/**
 * Chroma-js based implementation for stable palette generation
 * Uses HSLuv for perceived mode and direct HSL manipulation for linear mode
 */
export function createSwatches(palette: PaletteConfig) {
  const { value, valueStop } = palette;

  // Tweaks may be passed in, otherwise use defaults
  const colorMode = palette.colorMode ?? DEFAULT_PALETTE_CONFIG.colorMode;
  const h = palette.h ?? DEFAULT_PALETTE_CONFIG.h;
  const s = palette.s ?? DEFAULT_PALETTE_CONFIG.s;
  const lMin = palette.lMin ?? DEFAULT_PALETTE_CONFIG.lMin;
  const lMax = palette.lMax ?? DEFAULT_PALETTE_CONFIG.lMax;

  // All available stops (including 0 and 1000 for calculation)
  const allStops = [
    0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000,
  ];

  // Create base color from input
  const baseColor = chroma(`#${value}`);
  const [baseH, baseS, baseL] = baseColor.hsl();

  // 1. Create hue scale
  const valueStopIndex = allStops.indexOf(valueStop);
  if (valueStopIndex === -1) {
    throw new Error(`Invalid valueStop: ${valueStop}`);
  }

  const hueScale = allStops.map((stop) => {
    const stopIndex = allStops.indexOf(stop);
    const diff = Math.abs(stopIndex - valueStopIndex);
    const tweakValue = h ? diff * h : 0;
    return { stop, tweak: tweakValue };
  });

  // 2. Create saturation scale
  const saturationScale = allStops.map((stop) => {
    const stopIndex = allStops.indexOf(stop);
    const diff = Math.abs(stopIndex - valueStopIndex);
    const tweakValue = s ? Math.round((diff + 1) * s * (1 + diff / 10)) : 0;
    return { stop, tweak: Math.min(tweakValue, 100) };
  });

  // 3. Create lightness distribution
  const hsluv = new Hsluv();
  hsluv.hex = `#${value}`;
  hsluv.hexToHsluv();

  const lightnessValue = colorMode === "linear" ? baseL * 100 : hsluv.hsluv_l;

  // Create the three anchor points
  const distributionAnchors = [
    { stop: 0, tweak: lMax },
    { stop: valueStop, tweak: lightnessValue },
    { stop: 1000, tweak: lMin },
  ];

  // Interpolate for missing stops
  const distributionScale = allStops.map((stop) => {
    // If it's an anchor point, use the anchor value
    const anchor = distributionAnchors.find((a) => a.stop === stop);
    if (anchor) {
      return anchor;
    }

    // Otherwise interpolate between anchor points
    let leftAnchor, rightAnchor;

    if (stop < valueStop) {
      leftAnchor = distributionAnchors[0]; // stop 0
      rightAnchor = distributionAnchors[1]; // valueStop
    } else {
      leftAnchor = distributionAnchors[1]; // valueStop
      rightAnchor = distributionAnchors[2]; // stop 1000
    }

    // Linear interpolation
    const range = rightAnchor.stop - leftAnchor.stop;
    const position = stop - leftAnchor.stop;
    const ratio = position / range;
    const tweak =
      leftAnchor.tweak + (rightAnchor.tweak - leftAnchor.tweak) * ratio;

    return { stop, tweak: Math.round(tweak) };
  });

  const swatches = allStops.map((stop, stopIndex) => {
    if (stop === valueStop) {
      // Preserve exact input color
      const inputColor = chroma(`#${value.toUpperCase()}`);
      const [finalH, finalS, finalL] = inputColor.hsl();

      return {
        stop,
        hex: `#${value.toUpperCase()}`,
        h: isNaN(finalH) ? 0 : finalH,
        hScale: 0,
        s: isNaN(finalS) ? 0 : finalS * 100,
        sScale: (isNaN(finalS) ? 0 : finalS * 100) - 50,
        l: isNaN(finalL) ? 0 : finalL * 100,
      };
    }

    // Get tweaks for this stop
    const hTweak = hueScale[stopIndex].tweak;
    const sTweak = saturationScale[stopIndex].tweak;
    const lTweak = distributionScale[stopIndex].tweak;

    let newColor: chroma.Color;

    if (colorMode === "linear") {
      // Direct HSL manipulation for linear mode
      const newH = (baseH + hTweak) % 360;
      const newS = Math.max(0, Math.min(100, baseS * 100 + sTweak));
      const newL = Math.max(0, Math.min(100, lTweak));

      newColor = chroma.hsl(newH, newS / 100, newL / 100);
    } else {
      // HSLuv for perceived mode
      const hsluv = new Hsluv();
      hsluv.hex = `#${value}`;
      hsluv.hexToHsluv();

      const newHsluvH = (hsluv.hsluv_h + hTweak) % 360;
      const newHsluvS = Math.max(0, Math.min(100, hsluv.hsluv_s + sTweak));
      const newHsluvL = Math.max(0, Math.min(100, lTweak));

      hsluv.hsluv_h = newHsluvH;
      hsluv.hsluv_s = newHsluvS;
      hsluv.hsluv_l = newHsluvL;
      hsluv.hsluvToHex();

      newColor = chroma(hsluv.hex);
    }

    const [finalH, finalS, finalL] = newColor.hsl();

    return {
      stop,
      hex: newColor.hex().toUpperCase(),
      h: isNaN(finalH) ? 0 : finalH,
      hScale: ((((hTweak + 180) % 360) - 180) / 180) * 50,
      s: isNaN(finalS) ? 0 : finalS * 100,
      sScale: (isNaN(finalS) ? 0 : finalS * 100) - 50,
      l: isNaN(finalL) ? 0 : finalL * 100,
    };
  });

  return swatches;
}
